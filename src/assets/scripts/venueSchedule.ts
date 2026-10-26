import type { Booking } from '@data/venues';
import {
  hasRole,
  isEnabled,
  signIn,
  watchSession,
  type Session,
} from '@scripts/auth';
import {
  OverlapError,
  addBooking,
  conflicts,
  removeBooking,
  watchBookings,
  type NewBooking,
} from '@scripts/bookings';

/**
 * 場地頁「借用狀況」：一週的借用表（電腦版表格、手機版每天一張卡片），
 * 資料即時從 Firestore 讀取。系上同學登入後可以點空格預約、取消自己的預約；
 * 管理員可以取消任何人的預約。資料與文字由 VenuesView 放在 #venue-schedule-data。
 */

type Data = {
  venues: {
    id: string;
    name: string;
    tables?: string[];
    tableMaxHours?: number;
  }[];
  daysAhead: number;
  labels: {
    today: string;
    free: string;
    wholeRoom: string;
    allFree: string;
    weekdays: string[];
    loading: string;
    loadFailed: string;
  };
  booking: {
    bookBtn: string;
    signInHint: string;
    pendingHint: string;
    readyHint: string;
    submit: string;
    submitting: string;
    success: string;
    remove: string;
    removeConfirm: string;
    removed: string;
    errors: Record<
      | 'required'
      | 'order'
      | 'past'
      | 'tooFar'
      | 'tooLong'
      | 'overlap'
      | 'failed',
      string
    >;
  };
};

const root = document.querySelector<HTMLElement>('[data-venue-schedule]');
const raw = document.getElementById('venue-schedule-data')?.textContent;
if (root && raw) {
  const data: Data = JSON.parse(raw);
  const $ = <T extends Element = HTMLElement>(sel: string) =>
    document.querySelector<T>(sel)!;
  const head = root.querySelector('[data-week-head]')!;
  const body = root.querySelector('[data-week-body]')!;
  const days = root.querySelector('[data-week-days]')!;
  const label = root.querySelector('[data-week-label]')!;
  const status = $('[data-schedule-status]');
  const bar = $('[data-booking-bar]');
  const hint = $('[data-booking-hint]');
  const daysHint = $('[data-booking-days]');
  const signInBtn = $<HTMLButtonElement>('[data-booking-signin]');
  const openBtn = $<HTMLButtonElement>('[data-booking-open]');
  const dialog = $<HTMLDialogElement>('[data-booking-dialog]');
  const form = $<HTMLFormElement>('[data-booking-form]');
  const tableField = $('[data-table-field]');
  const formError = $('[data-booking-error]');
  const submitBtn = $<HTMLButtonElement>('[data-booking-submit]');
  const toastEl = $('[data-booking-toast]');
  const field = <T extends HTMLInputElement | HTMLSelectElement>(
    name: string
  ) => form.elements.namedItem(name) as T;

  const pad = (n: number) => String(n).padStart(2, '0');
  const iso = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const short = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const mondayOf = (d: Date) => {
    const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
    return m;
  };
  const addDays = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  };
  const el = (tag: string, cls = '', text = '') => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };
  // 直接設 display，不會被元素本身的 flex 等 class 蓋過
  const show = (node: HTMLElement, on: boolean, display = 'block') => {
    node.classList.remove('hidden');
    node.style.display = on ? display : 'none';
  };

  let toastTimer = 0;
  const toast = (text: string) => {
    toastEl.textContent = text;
    show(toastEl, true);
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => show(toastEl, false), 2500);
  };

  // --- 狀態 ---
  let session: Session | null = null;
  let bookings: Booking[] = [];
  const todayIso = iso(new Date());
  const lastIso = iso(addDays(new Date(), data.daysAhead - 1));
  let monday = mondayOf(new Date());

  const canBook = () => hasRole(session, 'student');
  const bookable = (dayIso: string) =>
    canBook() && dayIso >= todayIso && dayIso <= lastIso;
  const canRemove = (b: Booking) =>
    !!session && (b.uid === session.user.uid || hasRole(session, 'admin'));

  const venueOf = (id: string) => data.venues.find(v => v.id === id);

  // 場地名稱（借討論桌時加上桌號，借整間時加上「整間」）
  const placeOf = (b: Booking) => {
    const v = venueOf(b.venue);
    if (!v) return b.venue;
    if (!v.tables) return v.name;
    return b.table
      ? `${v.name} ${v.tables[b.table - 1] ?? ''}`
      : `${v.name}（${data.labels.wholeRoom}）`;
  };

  const chip = (b: Booking, withVenue = '', tag = '') => {
    const mine = !!session && b.uid === session.user.uid;
    const c = el('div', `booking-chip${mine ? ' is-mine' : ''}`);
    // 管理員把滑鼠移上去可以看到是誰預約的
    if (hasRole(session, 'admin') && b.name) c.title = b.name;
    // 例如「整間借用」：自己一行，不會在窄格子裡斷成兩半
    if (tag)
      c.append(
        el(
          'span',
          'block text-[11px] font-bold whitespace-nowrap text-orange-600 dark:text-orange-300',
          tag
        )
      );
    c.append(el('span', 'block font-bold', `${b.start}–${b.end}`));
    const who = [withVenue, b.by, b.purpose].filter(Boolean).join(' · ');
    c.append(el('span', 'block text-xs opacity-80', who));
    if (canRemove(b) && b.date >= todayIso) {
      const btn = el('button', 'booking-remove', data.booking.remove);
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', async () => {
        if (!confirm(data.booking.removeConfirm)) return;
        try {
          await removeBooking(b);
          toast(data.booking.removed);
        } catch (err) {
          console.error(err);
          toast(data.booking.errors.failed);
        }
      });
      c.append(btn);
    }
    return c;
  };

  // 空格：可以預約時是按鈕，點了打開預約視窗並帶入場地與日期
  const freeSlot = (
    dayIso: string,
    venue?: string,
    table?: number | null,
    text = data.labels.free
  ) => {
    if (!bookable(dayIso))
      return el(
        'span',
        'block p-1 text-xs text-neutral-400 dark:text-neutral-500',
        text
      );
    const btn = el('button', 'slot-free', text === '+' ? '+' : `+ ${text}`);
    btn.setAttribute('type', 'button');
    btn.addEventListener('click', () => openDialog({ date: dayIso, venue, table }));
    return btn;
  };

  // 表格的每一行：一般場地一行；有討論桌的場地每張桌子一行
  type Row = {
    venue: string;
    name: string;
    table?: number;
    tableName?: string;
    groupSize?: number;
  };
  const rows: Row[] = data.venues.flatMap(v =>
    v.tables
      ? v.tables.map((t, i) => ({
          venue: v.id,
          name: v.name,
          table: i + 1,
          tableName: t,
          groupSize: i === 0 ? v.tables!.length : 0,
        }))
      : [{ venue: v.id, name: v.name }]
  );

  const weekDates = () => Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const render = () => {
    const week = weekDates();
    const isos = week.map(iso);
    label.textContent = `${week[0].getFullYear()} 年 ${short(week[0])} – ${short(week[6])}`;
    const inWeek = bookings
      .filter(b => isos.includes(b.date))
      .sort((a, b) => a.start.localeCompare(b.start));

    // --- 電腦版表格 ---
    head.replaceChildren();
    const hr = el('tr');
    const corner = el(
      'th',
      'w-44 border-b border-neutral-300/60 p-3 dark:border-neutral-700'
    );
    corner.setAttribute('colspan', '2');
    hr.append(corner);
    week.forEach((d, i) => {
      const isToday = isos[i] === todayIso;
      const th = el(
        'th',
        `border-b border-l border-neutral-300/60 p-3 text-center dark:border-neutral-700 ${isToday ? 'bg-yellow-400/20' : ''}`
      );
      th.append(
        el(
          'span',
          'block font-bold text-neutral-800 dark:text-neutral-200',
          data.labels.weekdays[i]
        )
      );
      th.append(
        el(
          'span',
          `block text-xs ${isToday ? 'font-bold text-orange-500' : 'text-neutral-500'}`,
          isToday ? `${short(d)} ${data.labels.today}` : short(d)
        )
      );
      hr.append(th);
    });
    head.append(hr);

    body.replaceChildren();
    rows.forEach(row => {
      const tr = el('tr');
      const thBase =
        'border-t border-neutral-300/60 p-3 text-left align-top font-bold text-neutral-800 dark:border-neutral-700 dark:text-neutral-200';
      if (row.table === undefined) {
        const th = el('th', thBase, row.name);
        th.setAttribute('colspan', '2');
        tr.append(th);
      } else {
        if (row.groupSize) {
          const th = el('th', `${thBase} w-20`, row.name);
          th.setAttribute('rowspan', String(row.groupSize));
          tr.append(th);
        }
        tr.append(
          el(
            'th',
            'w-24 border-t border-l border-neutral-300/60 p-3 text-left align-top text-xs font-semibold text-orange-600 dark:border-neutral-700 dark:text-orange-300',
            row.tableName
          )
        );
      }
      isos.forEach(dayIso => {
        const isToday = dayIso === todayIso;
        const td = el(
          'td',
          `${row.table === undefined ? 'h-24' : 'h-16'} border-t border-l border-neutral-300/60 p-1.5 align-top dark:border-neutral-700 ${isToday ? 'bg-yellow-400/10' : ''}`
        );
        // 這一格的借用：借整間的話，每張討論桌的那一行都會顯示
        const list = inWeek.filter(
          b =>
            b.venue === row.venue &&
            b.date === dayIso &&
            (row.table === undefined ||
              b.table === null ||
              b.table === row.table)
        );
        if (list.length) {
          const stack = el('div', 'space-y-1');
          list.forEach(b =>
            stack.append(
              chip(
                b,
                '',
                row.table !== undefined && b.table === null
                  ? data.labels.wholeRoom
                  : ''
              )
            )
          );
          // 同一天的其他時段還是可以預約
          if (bookable(dayIso))
            stack.append(freeSlot(dayIso, row.venue, row.table ?? null, '+'));
          td.append(stack);
        } else {
          td.append(freeSlot(dayIso, row.venue, row.table ?? null));
        }
        tr.append(td);
      });
      body.append(tr);
    });

    // --- 手機版：每天一張卡片 ---
    days.replaceChildren();
    week.forEach((d, i) => {
      const isToday = isos[i] === todayIso;
      const card = el(
        'div',
        `rounded-2xl border p-4 ${isToday ? 'border-yellow-400 bg-yellow-400/10' : 'border-neutral-300/60 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/60'}`
      );
      const titleRow = el('div', 'flex items-center justify-between gap-2');
      const title = el(
        'p',
        'font-bold text-neutral-800 dark:text-neutral-200',
        `${data.labels.weekdays[i]} ${short(d)}`
      );
      if (isToday)
        title.append(
          el('span', 'ms-2 text-sm text-orange-500', data.labels.today)
        );
      titleRow.append(title);
      if (bookable(isos[i])) {
        const btn = el('button', 'week-btn', data.booking.bookBtn);
        btn.setAttribute('type', 'button');
        btn.addEventListener('click', () => openDialog({ date: isos[i] }));
        titleRow.append(btn);
      }
      card.append(titleRow);
      const list = inWeek.filter(b => b.date === isos[i]);
      if (list.length) {
        const stack = el('div', 'mt-3 space-y-2');
        list.forEach(b => stack.append(chip(b, placeOf(b))));
        card.append(stack);
      } else {
        card.append(
          el('p', 'mt-1 text-sm text-neutral-500', data.labels.allFree)
        );
      }
      days.append(card);
    });
  };

  // --- 讀取資料：換週時重新訂閱那一週 ---
  let unsubscribe: (() => void) | null = null;
  const subscribe = () => {
    unsubscribe?.();
    if (!isEnabled) return;
    const week = weekDates();
    status.textContent = data.labels.loading;
    show(status, true);
    unsubscribe = watchBookings(
      iso(week[0]),
      iso(week[6]),
      list => {
        bookings = list;
        show(status, false);
        render();
      },
      err => {
        console.error(err);
        status.textContent = data.labels.loadFailed;
        show(status, true);
      }
    );
  };

  const shift = (weeks: number) => {
    monday = addDays(monday, weeks * 7);
    bookings = [];
    render();
    subscribe();
  };
  root
    .querySelector('[data-week-prev]')!
    .addEventListener('click', () => shift(-1));
  root
    .querySelector('[data-week-next]')!
    .addEventListener('click', () => shift(1));
  root.querySelector('[data-week-today]')!.addEventListener('click', () => {
    monday = mondayOf(new Date());
    shift(0);
  });

  // --- 預約提示列：依登入狀態顯示 ---
  if (isEnabled) {
    watchSession(s => {
      session = s;
      show(bar, true, 'flex');
      show(signInBtn, !s, 'inline-flex');
      show(openBtn, canBook(), 'inline-flex');
      show(daysHint, canBook(), 'inline');
      hint.textContent = !s
        ? data.booking.signInHint
        : canBook()
          ? data.booking.readyHint
          : data.booking.pendingHint;
      render();
    });
    signInBtn.addEventListener('click', () => signIn());
    openBtn.addEventListener('click', () => openDialog({}));
  }

  // --- 預約視窗 ---
  const fillTables = (venueId: string, table: number | null = null) => {
    const v = venueOf(venueId);
    const select = field<HTMLSelectElement>('table');
    select.replaceChildren();
    show(tableField, !!v?.tables, 'flex');
    if (!v?.tables) return;
    v.tables.forEach((t, i) => {
      const o = el('option', '', t) as HTMLOptionElement;
      o.value = String(i + 1);
      select.append(o);
    });
    const whole = el('option', '', data.labels.wholeRoom) as HTMLOptionElement;
    whole.value = '';
    select.append(whole);
    select.value = table ? String(table) : '';
  };

  const setError = (msg: string) => {
    formError.textContent = msg;
    show(formError, !!msg);
  };

  function openDialog(prefill: {
    date?: string;
    venue?: string;
    table?: number | null;
  }) {
    form.reset();
    setError('');
    const venue = prefill.venue ?? data.venues[0].id;
    field<HTMLSelectElement>('venue').value = venue;
    fillTables(venue, prefill.table ?? null);
    const date = field<HTMLInputElement>('date');
    date.min = todayIso;
    date.max = lastIso;
    date.value = prefill.date ?? todayIso;
    dialog.showModal();
  }

  field<HTMLSelectElement>('venue').addEventListener('change', e =>
    fillTables((e.target as HTMLSelectElement).value)
  );
  $('[data-booking-cancel]').addEventListener('click', () => dialog.close());

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const validate = (b: NewBooking) => {
    const e = data.booking.errors;
    if (!b.date || !b.start || !b.end || !b.by) return e.required;
    if (b.start >= b.end) return e.order;
    const now = new Date();
    const nowHm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    if (b.date < todayIso || (b.date === todayIso && b.start < nowHm))
      return e.past;
    if (b.date > lastIso) return e.tooFar.replace('{n}', String(data.daysAhead));
    const max = venueOf(b.venue)?.tableMaxHours;
    if (b.table !== null && max && toMinutes(b.end) - toMinutes(b.start) > max * 60)
      return e.tooLong.replace('{n}', String(max));
    if (bookings.some(x => conflicts(b, x))) return e.overlap;
    return '';
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!session) return;
    const venue = field<HTMLSelectElement>('venue').value;
    const tableValue = field<HTMLSelectElement>('table').value;
    const b: NewBooking = {
      venue,
      table: venueOf(venue)?.tables && tableValue ? Number(tableValue) : null,
      date: field<HTMLInputElement>('date').value,
      start: field<HTMLInputElement>('start').value,
      end: field<HTMLInputElement>('end').value,
      by: field<HTMLInputElement>('by').value.trim(),
      purpose: field<HTMLInputElement>('purpose').value.trim(),
    };
    const msg = validate(b);
    if (msg) return setError(msg);

    setError('');
    submitBtn.disabled = true;
    submitBtn.textContent = data.booking.submitting;
    try {
      await addBooking(b, {
        uid: session.user.uid,
        name: session.user.displayName ?? session.user.email ?? '',
      });
      dialog.close();
      toast(data.booking.success);
      // 預約在別週的話，跳到那一週
      const target = mondayOf(new Date(`${b.date}T00:00`));
      if (iso(target) !== iso(monday)) {
        monday = target;
        shift(0);
      }
    } catch (err) {
      if (err instanceof OverlapError) setError(data.booking.errors.overlap);
      else {
        console.error(err);
        setError(data.booking.errors.failed);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = data.booking.submit;
    }
  });

  render();
  subscribe();
}
