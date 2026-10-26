import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import type { Booking } from '@data/venues';
import { db } from '@scripts/auth';

/**
 * 線上預約的讀寫。資料存在 Firestore 的 `bookingDays/{場地}_{日期}`：
 * 同一個場地同一天的預約放在同一份文件的 `bookings` 欄位裡，
 * 所以新增時可以用 transaction 一次檢查「這天有沒有重疊」，兩個人同時按也不會重複預約。
 */

export type NewBooking = Omit<Booking, 'id' | 'uid' | 'name'>;

/** 兩筆預約有沒有衝突：同場地同天、時間重疊，且借的是同一張桌子或其中一筆是整間 */
export const conflicts = (a: NewBooking, b: NewBooking) =>
  a.venue === b.venue &&
  a.date === b.date &&
  a.start < b.end &&
  b.start < a.end &&
  (a.table === null || b.table === null || a.table === b.table);

const dayRef = (venue: string, date: string) =>
  doc(db!, 'bookingDays', `${venue}_${date}`);

/** 即時監看 `from`～`to`（含）這幾天的所有預約 */
export function watchBookings(
  from: string,
  to: string,
  onData: (bookings: Booking[]) => void,
  onError: (err: Error) => void
) {
  const q = query(
    collection(db!, 'bookingDays'),
    where('date', '>=', from),
    where('date', '<=', to)
  );
  return onSnapshot(
    q,
    snap => {
      const list: Booking[] = [];
      snap.forEach(d => {
        const { venue, date, bookings = {} } = d.data();
        for (const [id, b] of Object.entries<Record<string, unknown>>(
          bookings
        ))
          list.push({
            id,
            venue,
            date,
            table: (b.table as number | null) ?? null,
            start: String(b.start),
            end: String(b.end),
            by: String(b.by ?? ''),
            purpose: String(b.purpose ?? ''),
            uid: String(b.uid ?? ''),
            name: String(b.name ?? ''),
          });
      });
      onData(list);
    },
    onError
  );
}

export class OverlapError extends Error {}

/** 新增一筆預約；時段已被預約時丟出 `OverlapError` */
export async function addBooking(
  booking: NewBooking,
  user: { uid: string; name: string }
) {
  const ref = dayRef(booking.venue, booking.date);
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  const entry = {
    table: booking.table,
    start: booking.start,
    end: booking.end,
    by: booking.by,
    purpose: booking.purpose,
    uid: user.uid,
    name: user.name,
    createdAt: serverTimestamp(),
  };
  await runTransaction(db!, async tx => {
    const snap = await tx.get(ref);
    const existing = (snap.data()?.bookings ?? {}) as Record<
      string,
      NewBooking
    >;
    const clash = Object.values(existing).some(b =>
      conflicts(booking, { ...b, venue: booking.venue, date: booking.date })
    );
    if (clash) throw new OverlapError();
    if (snap.exists()) tx.update(ref, { [`bookings.${id}`]: entry });
    else
      tx.set(ref, {
        venue: booking.venue,
        date: booking.date,
        bookings: { [id]: entry },
      });
  });
}

/** 取消一筆預約（自己的，或管理員取消任何人的） */
export function removeBooking(b: Pick<Booking, 'id' | 'venue' | 'date'>) {
  return updateDoc(dayRef(b.venue, b.date), {
    [`bookings.${b.id}`]: deleteField(),
  });
}
