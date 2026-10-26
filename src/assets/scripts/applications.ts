import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, isDemo } from '@scripts/auth';
import {
  getDemoApplications,
  onDemoApplications,
  setDemoApplication,
  setDemoUserRole,
} from '@scripts/demo';

/**
 * 「系上同學」申請：同學在個人資料頁填姓名、信箱、電話、學號並上傳學生證照片，
 * 超級管理員在管理後台核准（設成系上同學）或退回。核准或退回時學生證照片會一起刪除。
 *
 * 資料在 Firestore 的 `applications/{uid}`（一人一份）；學生證照片在瀏覽器壓縮後以
 * data URL 存在同一份文件裡（不需要付費的 Storage）。權限見 firestore.rules：
 * 只有本人與超級管理員讀得到。展示模式時改用 demo.ts 的假資料。
 */

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  /** 學生證照片（JPEG data URL） */
  photo: string;
}

export interface Application extends ApplicationForm {
  uid: string;
  status: ApplicationStatus;
  /** 退回原因 */
  note: string;
  submittedAt: Date | null;
}

const toApplication = (uid: string, v: Record<string, unknown>): Application => ({
  uid,
  name: String(v.name ?? ''),
  email: String(v.email ?? ''),
  phone: String(v.phone ?? ''),
  studentId: String(v.studentId ?? ''),
  photo: String(v.photo ?? ''),
  status: (v.status as ApplicationStatus) ?? 'pending',
  note: String(v.note ?? ''),
  submittedAt:
    (v.submittedAt as { toDate?: () => Date } | undefined)?.toDate?.() ??
    (v.submittedAt instanceof Date ? v.submittedAt : null),
});

/** 監看自己的申請；還沒申請時回傳 null */
export function watchMyApplication(
  uid: string,
  onData: (app: Application | null) => void,
  onError: (err: Error) => void
) {
  if (isDemo)
    return onDemoApplications(list =>
      onData(list.find(a => a.uid === uid) ?? null)
    );
  return onSnapshot(
    doc(db!, 'applications', uid),
    snap => onData(snap.exists() ? toApplication(uid, snap.data()) : null),
    onError
  );
}

/** 送出（或重新送出）申請，狀態回到「審核中」 */
export async function submitApplication(uid: string, form: ApplicationForm) {
  if (isDemo) {
    setDemoApplication({ ...form, uid, status: 'pending', note: '', submittedAt: new Date() });
    return;
  }
  await setDoc(doc(db!, 'applications', uid), {
    ...form,
    status: 'pending',
    note: '',
    submittedAt: serverTimestamp(),
  });
}

/** 監看所有待審核的申請（超級管理員） */
export function watchPendingApplications(
  onData: (apps: Application[]) => void,
  onError: (err: Error) => void
) {
  const sort = (list: Application[]) =>
    list.sort(
      (a, b) =>
        (a.submittedAt?.getTime() ?? 0) - (b.submittedAt?.getTime() ?? 0)
    );
  if (isDemo)
    return onDemoApplications(list =>
      onData(sort(list.filter(a => a.status === 'pending')))
    );
  return onSnapshot(
    query(collection(db!, 'applications'), where('status', '==', 'pending')),
    snap => onData(sort(snap.docs.map(d => toApplication(d.id, d.data())))),
    onError
  );
}

/** 核准：設成系上同學，並刪掉學生證照片 */
export async function approveApplication(uid: string) {
  if (isDemo) {
    const app = getDemoApplications().find(a => a.uid === uid);
    if (app) setDemoApplication({ ...app, status: 'approved', photo: '' });
    setDemoUserRole(uid, 'student');
    return;
  }
  const batch = writeBatch(db!);
  batch.update(doc(db!, 'applications', uid), {
    status: 'approved',
    photo: deleteField(),
    reviewedAt: serverTimestamp(),
  });
  batch.update(doc(db!, 'users', uid), { role: 'student' });
  await batch.commit();
}

/** 退回：寫上原因，並刪掉學生證照片 */
export async function rejectApplication(uid: string, note: string) {
  if (isDemo) {
    const app = getDemoApplications().find(a => a.uid === uid);
    if (app) setDemoApplication({ ...app, status: 'rejected', note, photo: '' });
    return;
  }
  const batch = writeBatch(db!);
  batch.update(doc(db!, 'applications', uid), {
    status: 'rejected',
    note,
    photo: deleteField(),
    reviewedAt: serverTimestamp(),
  });
  await batch.commit();
}

/**
 * 把使用者選的照片縮小、壓成 JPEG data URL，控制在約 600KB 以內
 * （Firestore 單一文件上限是 1MB）。
 */
export async function compressPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const limit = 600_000;
  for (const [maxSide, quality] of [
    [1280, 0.82],
    [1100, 0.75],
    [960, 0.7],
    [800, 0.65],
  ] as const) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/jpeg', quality);
    if (url.length <= limit) return url;
  }
  throw new Error('照片太大');
}
