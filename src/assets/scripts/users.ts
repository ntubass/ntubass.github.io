import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ROLE_RANK, type Role } from '@data/firebase';
import { db, isDemo } from '@scripts/auth';
import { onDemoUsers, setDemoUserRole } from '@scripts/demo';

/**
 * 管理後台用的使用者清單與角色設定。資料在 Firestore 的 `users` 集合；
 * 展示模式時改用 demo.ts 的假資料。真正的權限檢查在 firestore.rules。
 */

export interface UserRow {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date | null;
}

/** 即時監看所有使用者；回傳取消訂閱的函式 */
export function watchUsers(
  onData: (users: UserRow[]) => void,
  onError: (err: Error) => void
) {
  if (isDemo) return onDemoUsers(onData);
  return onSnapshot(
    collection(db!, 'users'),
    snap =>
      onData(
        snap.docs.map(d => {
          const v = d.data();
          return {
            uid: d.id,
            name: String(v.name ?? ''),
            email: String(v.email ?? ''),
            role: (v.role in ROLE_RANK ? v.role : 'member') as Role,
            createdAt: v.createdAt?.toDate?.() ?? null,
          };
        })
      ),
    onError
  );
}

export async function setUserRole(uid: string, role: Role) {
  if (isDemo) return setDemoUserRole(uid, role);
  await updateDoc(doc(db!, 'users', uid), { role });
}
