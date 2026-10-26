import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';
import {
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { firebaseConfig, ROLE_RANK, type Role } from '@data/firebase';
import { DEMO_ME, getDemoRole, resetDemo, setDemoRole } from '@scripts/demo';

/**
 * 瀏覽器端的登入狀態：Google 登入 + 從 Firestore `users/{uid}` 讀角色。
 * 導覽列和場地頁都從這裡取得目前的使用者，同一頁只會初始化一次。
 *
 * 還沒設定 Firebase 時，在自己電腦上開發（`npm run dev`）會進入展示模式：
 * 用假資料顯示所有畫面，左下角可以切換角色。正式網站不會有展示模式。
 */

export interface SessionUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface Session {
  user: SessionUser;
  role: Role;
}

export const isConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);
/** 展示模式：本機開發且還沒設定 Firebase */
export const isDemo = import.meta.env.DEV && !isConfigured;
/** 登入與預約相關的畫面要不要顯示 */
export const isEnabled = isConfigured || isDemo;

const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

type Listener = (session: Session | null) => void;
const listeners = new Set<Listener>();
let current: Session | null = null;
let ready = false;
let stopProfile: (() => void) | null = null;

const emit = (session: Session | null) => {
  current = session;
  ready = true;
  listeners.forEach(fn => fn(session));
};

if (auth && db) {
  onAuthStateChanged(auth, user => {
    stopProfile?.();
    stopProfile = null;
    if (!user) return emit(null);

    // 角色被管理員改掉時，畫面會即時跟著變
    const ref = doc(db, 'users', user.uid);
    stopProfile = onSnapshot(
      ref,
      snap => {
        if (!snap.exists()) {
          // 第一次登入：建立個人資料，角色一律從「一般」開始
          setDoc(ref, {
            email: user.email ?? '',
            name: user.displayName ?? user.email ?? '',
            photo: user.photoURL ?? '',
            role: 'member',
            createdAt: serverTimestamp(),
          }).catch(err => console.error('建立使用者資料失敗', err));
          return emit({ user, role: 'member' });
        }
        const role = snap.data().role as Role;
        emit({ user, role: role in ROLE_RANK ? role : 'member' });
      },
      err => {
        console.error('讀取使用者角色失敗', err);
        emit({ user, role: 'member' });
      }
    );
  });
}

const emitDemo = () => {
  const role = getDemoRole();
  emit(role ? { user: DEMO_ME, role } : null);
  document
    .querySelectorAll<HTMLButtonElement>('[data-demo-role]')
    .forEach(btn =>
      btn.setAttribute(
        'aria-pressed',
        String(btn.dataset.demoRole === (role ?? 'none'))
      )
    );
};

/** 展示模式左下角的角色切換列 */
function mountDemoBar() {
  const labels: [Role | 'none', string][] = [
    ['none', '未登入'],
    ['member', '一般'],
    ['student', '系上同學'],
    ['admin', '管理員'],
    ['super', '超級管理員'],
  ];
  const bar = document.createElement('div');
  bar.className = 'demo-bar';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', '展示模式：切換角色');
  bar.innerHTML = `<span>展示模式</span>${labels
    .map(([r, l]) => `<button type="button" data-demo-role="${r}">${l}</button>`)
    .join('')}<button type="button" data-demo-reset title="清除展示資料">重設</button>`;
  const style = document.createElement('style');
  style.textContent = `
    .demo-bar { position: fixed; left: 12px; bottom: 12px; z-index: 90; display: flex; flex-wrap: wrap; align-items: center; gap: 4px;
      max-width: calc(100vw - 24px); padding: 6px; border-radius: 14px; background: rgb(23 23 23 / .92); color: #fafafa;
      font: 600 12px/1 system-ui, sans-serif; box-shadow: 0 8px 24px rgb(0 0 0 / .25); }
    .demo-bar span { padding: 0 6px; color: #facc15; }
    .demo-bar button { padding: 6px 9px; border-radius: 9px; color: #d4d4d4; }
    .demo-bar button:hover { background: rgb(255 255 255 / .1); }
    .demo-bar button[aria-pressed='true'] { background: #facc15; color: #171717; }`;
  document.head.append(style);
  document.body.append(bar);
  bar.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('button');
    if (!btn) return;
    if (btn.hasAttribute('data-demo-reset')) {
      resetDemo();
      location.reload();
      return;
    }
    const r = btn.dataset.demoRole as Role | 'none';
    setDemoRole(r === 'none' ? null : r);
    emitDemo();
  });
}

if (isDemo) {
  const start = () => {
    mountDemoBar();
    emitDemo();
  };
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start);
  else start();
}

/** 訂閱登入狀態；回傳取消訂閱的函式。已經有結果時會立刻呼叫一次。 */
export function watchSession(fn: Listener): () => void {
  listeners.add(fn);
  if (ready) fn(current);
  return () => listeners.delete(fn);
}

/** 目前的角色是否至少是 `role` */
export const hasRole = (session: Session | null, role: Role) =>
  !!session && ROLE_RANK[session.role] >= ROLE_RANK[role];

export async function signIn() {
  if (isDemo) {
    setDemoRole('member');
    return emitDemo();
  }
  if (!auth) return;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    const code = (err as { code?: string }).code;
    // 使用者自己關掉視窗不算錯誤
    if (
      code !== 'auth/popup-closed-by-user' &&
      code !== 'auth/cancelled-popup-request'
    )
      console.error('登入失敗', err);
  }
}

export async function signOut() {
  if (isDemo) {
    setDemoRole(null);
    return emitDemo();
  }
  if (auth) await fbSignOut(auth);
}
