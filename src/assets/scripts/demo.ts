import type { Booking } from '@data/venues';
import type { Role } from '@data/firebase';

/**
 * 展示模式的假資料：還沒設定 Firebase 時，在自己電腦上（`npm run dev`）用來看
 * 登入、預約、管理後台的畫面。資料存在瀏覽器的 localStorage，正式網站不會用到。
 * 由 auth.ts、bookings.ts、users.ts 在展示模式時呼叫，頁面本身不需要知道。
 */

export interface DemoUser {
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

/** 展示模式裡「你」的帳號；角色由左下角的切換列決定 */
export const DEMO_ME = {
  uid: 'demo-me',
  displayName: '展示帳號',
  email: 'demo@example.com',
  photoURL: '',
};

const KEYS = {
  role: 'demo:role',
  bookings: 'demo:bookings',
  users: 'demo:users',
};

const read = <T>(key: string, fallback: () => T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // 讀不到就用預設值
  }
  return fallback();
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 無痕模式等情況寫不進去也沒關係，只是重新整理後會回到預設
  }
};

// --- 角色 ---

/** `null` 代表未登入 */
export const getDemoRole = () => read<Role | null>(KEYS.role, () => 'student');
export const setDemoRole = (role: Role | null) => write(KEYS.role, role);

// --- 預約 ---

const pad = (n: number) => String(n).padStart(2, '0');
const isoOf = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayFromToday = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return isoOf(d);
};

/** 範例預約：以今天為準往前後排幾天，讓本週和下週都看得到 */
const seedBookings = (): Booking[] => {
  const other = { uid: 'demo-other', name: '範例同學' };
  const me = { uid: DEMO_ME.uid, name: DEMO_ME.displayName };
  const rows: [number, string, number | null, string, string, string, string, typeof me][] = [
    [-1, '103', null, '12:10', '13:20', '幹部', '週會', other],
    [0, '105', 1, '18:30', '20:30', '學術部', '課程籌備', other],
    [0, '105', 3, '19:00', '21:00', '大二班代', '小組討論', me],
    [1, '110', null, '19:00', '21:00', '活動部', '職涯講座', other],
    [2, '105', null, '12:10', '13:20', '行銷部', '社群企劃討論', other],
    [3, '108', null, '18:00', '21:00', '活動部', '系烤籌備', me],
    [6, '103', null, '12:10', '13:20', '幹部', '週會', other],
    [8, '105', 2, '15:30', '17:00', '財務部', '預算討論', other],
  ];
  return rows.map(([offset, venue, table, start, end, by, purpose, who], i) => ({
    id: `seed${i}`,
    venue,
    table,
    date: dayFromToday(offset),
    start,
    end,
    by,
    purpose,
    ...who,
  }));
};

type BookingListener = () => void;
const bookingListeners = new Set<BookingListener>();

export const getDemoBookings = () => read(KEYS.bookings, seedBookings);
export const setDemoBookings = (list: Booking[]) => {
  write(KEYS.bookings, list);
  bookingListeners.forEach(fn => fn());
};
export const onDemoBookings = (fn: BookingListener) => {
  bookingListeners.add(fn);
  return () => bookingListeners.delete(fn);
};

// --- 使用者（管理後台） ---

const seedUsers = (): DemoUser[] => {
  const days = (n: number) => new Date(Date.now() - n * 86400000);
  return [
    { uid: 'demo-u1', name: '範例同學 A', email: 'student-a@example.com', role: 'member', createdAt: days(1) },
    { uid: 'demo-u2', name: '範例同學 B', email: 'student-b@example.com', role: 'member', createdAt: days(3) },
    { uid: 'demo-u3', name: '範例同學 C', email: 'student-c@example.com', role: 'student', createdAt: days(12) },
    { uid: 'demo-u4', name: '範例同學 D', email: 'student-d@example.com', role: 'student', createdAt: days(20) },
    { uid: 'demo-u5', name: '範例幹部 E', email: 'officer-e@example.com', role: 'admin', createdAt: days(40) },
    { uid: 'demo-u6', name: '範例會長 F', email: 'president-f@example.com', role: 'super', createdAt: days(60) },
  ];
};

type UserListener = (users: DemoUser[]) => void;
const userListeners = new Set<UserListener>();

/** 使用者清單，加上「你」這個帳號（角色跟著切換列） */
export const getDemoUsers = (): DemoUser[] => {
  const others = read(KEYS.users, seedUsers).map(u => ({
    ...u,
    createdAt: new Date(u.createdAt),
  }));
  const role = getDemoRole();
  if (!role) return others;
  return [
    {
      uid: DEMO_ME.uid,
      name: DEMO_ME.displayName,
      email: DEMO_ME.email,
      role,
      createdAt: new Date(),
    },
    ...others,
  ];
};
export const setDemoUserRole = (uid: string, role: Role) => {
  const others = read(KEYS.users, seedUsers).map(u =>
    u.uid === uid ? { ...u, role } : u
  );
  write(KEYS.users, others);
  const all = getDemoUsers();
  userListeners.forEach(fn => fn(all));
};
export const onDemoUsers = (fn: UserListener) => {
  userListeners.add(fn);
  fn(getDemoUsers());
  return () => userListeners.delete(fn);
};

/** 清掉展示資料，回到預設的範例 */
export const resetDemo = () => {
  Object.values(KEYS).forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch {
      // 忽略
    }
  });
};
