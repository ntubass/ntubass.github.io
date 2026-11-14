/**
 * 系學會網站的小型後端（Google Apps Script）：系上同學信箱驗證 + 場地預約通知
 *
 * 信箱驗證流程：
 * 1. 網站送來「Firebase 登入憑證 + 學號」→ 確認學號是工管系的，寄 6 位數驗證碼到「學號@ntu.edu.tw」
 * 2. 網站送來「Firebase 登入憑證 + 驗證碼 + 姓名 + 手機」→ 驗證碼正確就把這個帳號設成系上同學，
 *    並把個人資料存到 Firestore 的 profiles/{uid}
 *
 * 場地預約通知：網站在預約成功後送來「Firebase 登入憑證 + 哪一筆預約」，這支程式自己到 Firestore
 * 讀那筆預約（並確認是本人建立的），再寄信給所有超級管理員。網站不能指定信件內容或收件人。
 *
 * 驗證碼只存在這支程式這端（CacheService），網頁看不到，所以沒辦法作弊。
 * 寫入 Firestore 用的是服務帳號，不受 firestore.rules 限制，所以「設成系上同學」只能透過這裡完成。
 *
 * 設定方式見專案根目錄的 FIREBASE.md「信箱驗證」一節。需要的指令碼屬性（Script Properties）：
 *   FIREBASE_API_KEY   網站設定裡的 apiKey
 *   FIREBASE_PROJECT_ID 網站設定裡的 projectId
 *   SA_CLIENT_EMAIL    服務帳號金鑰 JSON 裡的 client_email
 *   SA_PRIVATE_KEY     服務帳號金鑰 JSON 裡的 private_key（整段，含 BEGIN/END 那兩行）
 *   DEPT_CODES         （選填）工管系的系所代碼，多個用逗號分隔，預設 701
 *   NOTIFY_EMAILS      （選填）預約通知另外要寄給誰，多個用逗號分隔；不填就只寄給所有超級管理員
 *   SITE_URL           （選填）網站網址，例如 https://ntubass.github.io，會放在預約通知信裡
 */

const CODE_TTL_SECONDS = 600; // 驗證碼 10 分鐘內有效
const MAX_ATTEMPTS = 5; // 每組驗證碼最多試 5 次
const RESEND_COOLDOWN_SECONDS = 60; // 同一個帳號 60 秒內不能重寄
const MAX_SENDS_PER_HOUR = 5; // 同一個帳號或同一個學號，一小時最多寄 5 次

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad-request' });
  }
  try {
    const uid = verifyIdToken(body.idToken);
    if (!uid) return reply({ ok: false, error: 'not-signed-in' });
    if (body.action === 'send') return reply(sendCode(uid, body));
    if (body.action === 'verify') return reply(verifyCode(uid, body));
    if (body.action === 'notify-booking') return reply(notifyBooking(uid, body));
    return reply({ ok: false, error: 'bad-request' });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'server' });
  }
}

// --- 1. 寄驗證碼 ---
function sendCode(uid, body) {
  const studentId = String(body.studentId || '').trim().toUpperCase();
  if (!isDeptStudentId(studentId)) return { ok: false, error: 'student-id' };

  const cache = CacheService.getScriptCache();
  if (cache.get('cooldown:' + uid)) return { ok: false, error: 'too-soon' };
  if (!underHourlyLimit(cache, 'sends:' + uid) || !underHourlyLimit(cache, 'sends:' + studentId))
    return { ok: false, error: 'too-many' };

  const owner = getStudentIdOwner(studentId);
  if (owner && owner !== uid) return { ok: false, error: 'student-id-taken' };

  const code = String(Math.floor(100000 + Math.random() * 900000));
  cache.put(
    'code:' + uid,
    JSON.stringify({ code: code, studentId: studentId, attempts: 0 }),
    CODE_TTL_SECONDS
  );
  cache.put('cooldown:' + uid, '1', RESEND_COOLDOWN_SECONDS);

  const to = studentId.toLowerCase() + '@ntu.edu.tw';
  MailApp.sendEmail({
    to: to,
    subject: '【NTUBA Student Association】系上同學驗證碼：' + code,
    body:
      '你好：\n\n' +
      '你的驗證碼是 ' + code + '，請在 10 分鐘內回到網站輸入。\n\n' +
      '如果你沒有在系學會網站申請驗證，請直接忽略這封信。\n\n' +
      'NTUBA Student Association 臺大工管系學會',
    name: 'NTUBA Student Association',
  });
  return { ok: true, email: to };
}

// --- 2. 確認驗證碼，設成系上同學 ---
function verifyCode(uid, body) {
  const cache = CacheService.getScriptCache();
  const raw = cache.get('code:' + uid);
  if (!raw) return { ok: false, error: 'expired' };
  const saved = JSON.parse(raw);
  if (saved.attempts >= MAX_ATTEMPTS) {
    cache.remove('code:' + uid);
    return { ok: false, error: 'too-many-attempts' };
  }
  if (String(body.code || '').trim() !== saved.code) {
    saved.attempts += 1;
    cache.put('code:' + uid, JSON.stringify(saved), CODE_TTL_SECONDS);
    return { ok: false, error: 'wrong-code', left: MAX_ATTEMPTS - saved.attempts };
  }

  const name = String(body.name || '').trim().slice(0, 40);
  const phone = String(body.phone || '').replace(/[\s-]/g, '');
  if (!name || !/^09\d{8}$/.test(phone)) return { ok: false, error: 'bad-request' };

  // 一個學號只能綁一個帳號（寄信之後才被別人綁走的情況也要擋）
  const owner = getStudentIdOwner(saved.studentId);
  if (owner && owner !== uid) return { ok: false, error: 'student-id-taken' };

  const now = new Date().toISOString();
  const email = saved.studentId.toLowerCase() + '@ntu.edu.tw';
  firestoreWrite('studentIds/' + saved.studentId, { uid: { stringValue: uid } });
  firestoreWrite('profiles/' + uid, {
    name: { stringValue: name },
    phone: { stringValue: phone },
    studentId: { stringValue: saved.studentId },
    ntuEmail: { stringValue: email },
    verifiedAt: { timestampValue: now },
  });
  // 只把「一般」升成系上同學，不會動到管理員或超級管理員
  const user = firestoreRead('users/' + uid);
  const role = user && user.fields && user.fields.role ? user.fields.role.stringValue : 'member';
  if (role === 'member') firestoreWrite('users/' + uid, { role: { stringValue: 'student' } }, ['role']);

  cache.remove('code:' + uid);
  return { ok: true };
}

// --- 3. 場地預約通知：寄信給所有超級管理員 ---
function notifyBooking(uid, body) {
  const venue = String(body.venue || '');
  const date = String(body.date || '');
  const bookingId = String(body.bookingId || '');
  if (!/^[\w-]+$/.test(venue) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\w+$/.test(bookingId))
    return { ok: false, error: 'bad-request' };

  // 同一筆預約只通知一次
  const cache = CacheService.getScriptCache();
  if (cache.get('notified:' + bookingId)) return { ok: true };

  // 信件內容一律從 Firestore 讀，並確認這筆預約是送通知的人自己建立的
  const day = firestoreRead('bookingDays/' + venue + '_' + date);
  const entries = day && day.fields && day.fields.bookings ? day.fields.bookings.mapValue.fields || {} : {};
  const entry = entries[bookingId] ? entries[bookingId].mapValue.fields : null;
  if (!entry || str(entry.uid) !== uid) return { ok: false, error: 'bad-request' };

  const table = entry.table && entry.table.integerValue ? Number(entry.table.integerValue) : null;
  const place = venue + ' 教室' + (table ? '・討論桌 ' + table : '（整間借用）');
  // 取那個日期（UTC 中午）的星期，不受時區影響
  const weekday = '日一二三四五六'.charAt(new Date(date + 'T12:00:00Z').getUTCDay());
  const md = Number(date.slice(5, 7)) + '/' + Number(date.slice(8, 10)) + '（' + weekday + '）';
  const time = str(entry.start) + '–' + str(entry.end);

  const booker = firestoreRead('users/' + uid);
  const bookerEmail = booker && booker.fields ? str(booker.fields.email) : '';

  const recipients = superAdminEmails();
  const extra = (prop('NOTIFY_EMAILS', true) || '').split(',').map(function (e) { return e.trim(); }).filter(String);
  const to = recipients.concat(extra).filter(function (e, i, all) { return e && all.indexOf(e) === i; });
  if (!to.length) return { ok: true };

  const site = (prop('SITE_URL', true) || '').replace(/\/$/, '');
  MailApp.sendEmail({
    to: to.join(','),
    subject: '【場地預約】' + place + '｜' + md + ' ' + time,
    body:
      '有一筆新的場地預約：\n\n' +
      '場地：' + place + '\n' +
      '日期：' + date + '（' + weekday + '）\n' +
      '時段：' + time + '\n' +
      '借用單位：' + str(entry.by) + '\n' +
      '用途：' + (str(entry.purpose) || '（未填）') + '\n' +
      '預約人：' + str(entry.name) + (bookerEmail ? '（' + bookerEmail + '）' : '') + '\n' +
      (site ? '\n借用狀況：' + site + '/venues/#schedule\n' : '') +
      '\n這封信由系學會網站自動寄出，寄給所有超級管理員。',
    name: 'NTUBA Student Association',
  });
  cache.put('notified:' + bookingId, '1', 21600);
  return { ok: true };
}

/** 所有超級管理員的信箱 */
function superAdminEmails() {
  const res = UrlFetchApp.fetch(
    'https://firestore.googleapis.com/v1/projects/' + prop('FIREBASE_PROJECT_ID') + '/databases/(default)/documents:runQuery',
    {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + accessToken() },
      payload: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'users' }],
          where: { fieldFilter: { field: { fieldPath: 'role' }, op: 'EQUAL', value: { stringValue: 'super' } } },
        },
      }),
      muteHttpExceptions: true,
    }
  );
  if (res.getResponseCode() !== 200) throw new Error('Firestore query failed: ' + res.getContentText());
  return JSON.parse(res.getContentText())
    .filter(function (row) { return row.document; })
    .map(function (row) { return str(row.document.fields.email); })
    .filter(String);
}

/** Firestore 欄位轉成字串 */
function str(field) {
  return field && field.stringValue ? field.stringValue : '';
}

// --- 工具 ---
function isDeptStudentId(studentId) {
  const codes = (prop('DEPT_CODES', true) || '701').split(',').map(function (c) { return c.trim(); });
  const m = /^[A-Z]\d{2}(\d{3})\d{3}$/.exec(studentId);
  return !!m && codes.indexOf(m[1]) !== -1;
}

function underHourlyLimit(cache, key) {
  const n = Number(cache.get(key) || 0);
  if (n >= MAX_SENDS_PER_HOUR) return false;
  cache.put(key, String(n + 1), 3600);
  return true;
}

function getStudentIdOwner(studentId) {
  const doc = firestoreRead('studentIds/' + studentId);
  return doc && doc.fields && doc.fields.uid ? doc.fields.uid.stringValue : null;
}

/** 用 Firebase 的 Identity Toolkit 確認登入憑證是真的，回傳 uid */
function verifyIdToken(idToken) {
  if (!idToken) return null;
  const res = UrlFetchApp.fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + prop('FIREBASE_API_KEY'),
    { method: 'post', contentType: 'application/json', payload: JSON.stringify({ idToken: idToken }), muteHttpExceptions: true }
  );
  if (res.getResponseCode() !== 200) return null;
  const data = JSON.parse(res.getContentText());
  return data.users && data.users[0] ? data.users[0].localId : null;
}

function firestoreUrl(path) {
  return 'https://firestore.googleapis.com/v1/projects/' + prop('FIREBASE_PROJECT_ID') + '/databases/(default)/documents/' + path;
}

function firestoreRead(path) {
  const res = UrlFetchApp.fetch(firestoreUrl(path), {
    headers: { Authorization: 'Bearer ' + accessToken() },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() === 404) return null;
  if (res.getResponseCode() !== 200) throw new Error('Firestore read failed: ' + res.getContentText());
  return JSON.parse(res.getContentText());
}

/** 寫入文件；給 fieldPaths 時只更新那些欄位，否則整份覆蓋 */
function firestoreWrite(path, fields, fieldPaths) {
  let url = firestoreUrl(path);
  if (fieldPaths) url += '?' + fieldPaths.map(function (f) { return 'updateMask.fieldPaths=' + f; }).join('&');
  const res = UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + accessToken() },
    payload: JSON.stringify({ fields: fields }),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) throw new Error('Firestore write failed: ' + res.getContentText());
}

/** 用服務帳號換一張可以讀寫 Firestore 的存取權杖（快取 50 分鐘） */
function accessToken() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('access-token');
  if (cached) return cached;
  const now = Math.floor(Date.now() / 1000);
  const enc = function (obj) {
    return Utilities.base64EncodeWebSafe(JSON.stringify(obj)).replace(/=+$/, '');
  };
  const unsigned =
    enc({ alg: 'RS256', typ: 'JWT' }) + '.' +
    enc({
      iss: prop('SA_CLIENT_EMAIL'),
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    });
  const key = prop('SA_PRIVATE_KEY').replace(/\\n/g, '\n');
  const signature = Utilities.base64EncodeWebSafe(Utilities.computeRsaSha256Signature(unsigned, key)).replace(/=+$/, '');
  const res = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: unsigned + '.' + signature,
    },
  });
  const token = JSON.parse(res.getContentText()).access_token;
  cache.put('access-token', token, 3000);
  return token;
}

function prop(name, optional) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value && !optional) throw new Error('缺少指令碼屬性 ' + name);
  return value;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** 在 Apps Script 編輯器裡手動執行一次，授權寄信與連線權限，並確認設定正確 */
function testSetup() {
  console.log('Firestore 連線：', accessToken() ? 'OK' : '失敗');
  console.log('B12701001 是工管系學號：', isDeptStudentId('B12701001'));
  console.log('今天還能寄的信件數：', MailApp.getRemainingDailyQuota());
  console.log('預約通知會寄給：', superAdminEmails().join(', ') || '（目前沒有超級管理員）');
}
