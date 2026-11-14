import { collection, doc, onSnapshot } from 'firebase/firestore';
import { isDeptStudentId } from '@data/firebase';
import { db, isDemo, setDemoSessionRole } from '@scripts/auth';
import { AppsScriptError, appsScriptReady, callAppsScript } from '@scripts/appsScript';
import {
  DEMO_ME,
  getDemoCode,
  getDemoProfiles,
  onDemoProfiles,
  setDemoCode,
  setDemoProfile,
  setDemoUserRole,
} from '@scripts/demo';

/**
 * 系上同學信箱驗證：同學輸入學號，Apps Script（apps-script/site-backend.gs）寄 6 位數驗證碼到
 * 「學號@ntu.edu.tw」；輸入正確後 Apps Script 把帳號設成系上同學，並把個人資料存到
 * Firestore 的 `profiles/{uid}`（只有本人與超級管理員讀得到，網頁不能直接寫入）。
 * 展示模式時改用 demo.ts 的假資料，驗證碼會直接回傳給畫面顯示。
 */

export interface Profile {
  uid: string;
  name: string;
  phone: string;
  studentId: string;
  ntuEmail: string;
  verifiedAt: Date | null;
}

/** Apps Script 或展示模式回傳的錯誤代碼，對應到文案 `copy.profile.errors` */
export type VerifyError =
  | 'student-id'
  | 'student-id-taken'
  | 'too-soon'
  | 'too-many'
  | 'expired'
  | 'wrong-code'
  | 'too-many-attempts'
  | 'not-signed-in'
  | 'bad-request'
  | 'server';

/** 驗證失敗；`code` 是 Apps Script 或展示模式回傳的錯誤代碼（VerifyError） */
export { AppsScriptError as VerifyFailure };
const VerifyFailure = AppsScriptError;

export const verificationReady = isDemo || appsScriptReady;

const toProfile = (uid: string, v: Record<string, unknown>): Profile => ({
  uid,
  name: String(v.name ?? ''),
  phone: String(v.phone ?? ''),
  studentId: String(v.studentId ?? ''),
  ntuEmail: String(v.ntuEmail ?? ''),
  verifiedAt:
    (v.verifiedAt as { toDate?: () => Date } | undefined)?.toDate?.() ??
    (v.verifiedAt instanceof Date ? v.verifiedAt : null),
});

/** 寄驗證碼到「學號@ntu.edu.tw」，回傳寄送的信箱（展示模式另外回傳驗證碼） */
export async function sendVerificationCode(studentId: string) {
  const id = studentId.trim().toUpperCase();
  if (!isDeptStudentId(id)) throw new VerifyFailure('student-id');
  if (isDemo) {
    const owner = getDemoProfiles().find(p => p.studentId === id);
    if (owner) throw new VerifyFailure('student-id-taken');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setDemoCode({ code, studentId: id, attempts: 0 });
    return { email: `${id.toLowerCase()}@ntu.edu.tw`, demoCode: code };
  }
  const data = await callAppsScript<{ email?: string }>({ action: 'send', studentId: id });
  return { email: data.email ?? `${id.toLowerCase()}@ntu.edu.tw` };
}

/** 確認驗證碼；正確的話帳號會變成系上同學，個人資料一起存起來 */
export async function confirmVerificationCode(
  uid: string,
  form: { code: string; name: string; phone: string }
) {
  if (isDemo) {
    const saved = getDemoCode();
    if (!saved) throw new VerifyFailure('expired');
    if (form.code.trim() !== saved.code) {
      saved.attempts += 1;
      setDemoCode(saved.attempts >= 5 ? null : saved);
      throw new VerifyFailure(
        saved.attempts >= 5 ? 'too-many-attempts' : 'wrong-code',
        5 - saved.attempts
      );
    }
    setDemoCode(null);
    setDemoProfile({
      uid,
      name: form.name,
      phone: form.phone,
      studentId: saved.studentId,
      ntuEmail: `${saved.studentId.toLowerCase()}@ntu.edu.tw`,
      verifiedAt: new Date(),
    });
    // 「展示帳號」的角色由左下角切換列控制，其他範例帳號存在使用者清單
    if (uid === DEMO_ME.uid) setDemoSessionRole('student');
    else setDemoUserRole(uid, 'student');
    return;
  }
  await callAppsScript({ action: 'verify', ...form });
}

/** 監看自己的個人資料；還沒驗證時回傳 null */
export function watchMyProfile(
  uid: string,
  onData: (profile: Profile | null) => void,
  onError: (err: Error) => void
) {
  if (isDemo)
    return onDemoProfiles(list => onData(list.find(p => p.uid === uid) ?? null));
  return onSnapshot(
    doc(db!, 'profiles', uid),
    snap => onData(snap.exists() ? toProfile(uid, snap.data()) : null),
    onError
  );
}

/** 監看所有人的個人資料（超級管理員，管理後台用） */
export function watchProfiles(
  onData: (profiles: Profile[]) => void,
  onError: (err: Error) => void
) {
  if (isDemo) return onDemoProfiles(list => onData(list));
  return onSnapshot(
    collection(db!, 'profiles'),
    snap => onData(snap.docs.map(d => toProfile(d.id, d.data()))),
    onError
  );
}
