import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import {
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { firebaseConfig, ROLE_RANK, type Role } from '@data/firebase';

/**
 * 瀏覽器端的登入狀態：Google 登入 + 從 Firestore `users/{uid}` 讀角色。
 * 導覽列和場地頁都從這裡取得目前的使用者，同一頁只會初始化一次。
 */

export interface Session {
  user: User;
  role: Role;
}

export const isConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

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
  if (auth) await fbSignOut(auth);
}
