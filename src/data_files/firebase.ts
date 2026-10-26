/**
 * Google 登入與線上預約用的 Firebase 設定。
 *
 * 到 Firebase 主控台 → 專案設定 → 一般 → 「你的應用程式」複製網頁應用程式的設定，
 * 貼到下面（這些值本來就會出現在網頁裡，不是密碼，可以放進 GitHub）。
 * 還沒填好之前，網站上的登入按鈕與線上預約會自動隱藏，其他頁面不受影響。
 *
 * 完整設定步驟請看專案根目錄的 FIREBASE.md。
 */
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

/** 最多可以預約幾天後的時段（含今天），例如 14 就是兩週內 */
export const BOOKING_DAYS_AHEAD = 14;

/**
 * 角色，由低到高：
 * - member：一般（用 Google 登入後的預設），只能看借用狀況
 * - student：系上同學，可以線上預約、取消自己的預約
 * - admin：管理員，可以刪除任何預約、把人設成系上同學或取消
 * - super：超級管理員，管理員能做的都能做，另外可以任命或取消管理員
 *
 * 角色存在 Firestore 的 `users` 集合；權限檢查寫在根目錄的 firestore.rules。
 */
export type Role = 'member' | 'student' | 'admin' | 'super';

export const ROLE_RANK: Record<Role, number> = {
  member: 0,
  student: 1,
  admin: 2,
  super: 3,
};
