/**
 * 場地借用：場地清單與借用紀錄。改完存檔、重新部署後網站就會更新。
 *
 * 借用狀況頁面會自動以「今天」所在的那一週顯示，也可以切換上一週 / 下一週。
 */

/** 全間借用的「借用規範與申請表」網址；留空字串的話按鈕會顯示成灰色、不能點 */
export const VENUE_FORM_URL =
  'https://docs.google.com/document/d/1SNOJ-OfJK9r16naUsDUAP5Gn_ZXS-pqKPKGUnhpE-5Q/edit?usp=sharing';

export interface Venue {
  /** 代號，借用紀錄用這個對應場地 */
  id: string;
  name: string;
  /** 位置（選填），例如「管理學院一館 1 樓」 */
  location?: string;
  /** 容納人數（選填），例如「約 40 人」 */
  capacity?: string;
  /** 設備（選填），例如 ['投影機', '白板'] */
  equipment?: string[];
  /**
   * 可以分開借用的討論桌（選填）。有填的話，借用紀錄可以指定 `table`，
   * 借用狀況表會把每張桌子各列成一行。
   */
  tables?: string[];
  /** 注意事項（選填），會顯示在場地卡片上，例如 ['進入須脫鞋'] */
  notes?: string[];
}

export interface Booking {
  /** 對應上面場地的 `id` */
  venue: string;
  /**
   * 借哪一張討論桌（只有設定了 `tables` 的場地才需要）：1 是第一張、2 是第二張…
   * 不填就是借整間。
   */
  table?: number;
  /** 日期，格式 'YYYY-MM-DD'，例如 '2026-10-12' */
  date: string;
  /** 開始與結束時間，格式 'HH:MM'（24 小時制） */
  start: string;
  end: string;
  /** 借用單位，例如「學術部」「大一班代」 */
  by: string;
  /** 用途（選填），例如「幹部會議」 */
  purpose?: string;
}

export const venues: Venue[] = [
  { id: '103', name: '103 教室', location: '管理學院教研館' },
  {
    id: '105',
    name: '105 教室',
    location: '管理學院教研館',
    tables: ['討論桌 1', '討論桌 2', '討論桌 3'],
    notes: ['進入須脫鞋，並將鞋子整齊放好', '單張桌子單次借用上限 3 小時'],
  },
  { id: '108', name: '108 教室', location: '管理學院教研館' },
  { id: '110', name: '110 教室', location: '管理學院教研館' },
];

/** 借用紀錄：順序不拘，網站會自動排序（以下為範例，請換成實際紀錄） */
export const bookings: Booking[] = [
  {
    venue: '103',
    date: '2026-10-05',
    start: '12:10',
    end: '13:20',
    by: '幹部',
    purpose: '週會',
  },
  {
    venue: '105',
    table: 1,
    date: '2026-10-06',
    start: '18:30',
    end: '20:30',
    by: '學術部',
    purpose: '課程籌備',
  },
  {
    venue: '105',
    table: 3,
    date: '2026-10-06',
    start: '19:00',
    end: '21:00',
    by: '大二班代',
    purpose: '小組討論',
  },
  {
    venue: '110',
    date: '2026-10-07',
    start: '19:00',
    end: '21:00',
    by: '活動部',
    purpose: '職涯講座',
  },
  {
    venue: '105',
    date: '2026-10-08',
    start: '12:10',
    end: '13:20',
    by: '行銷部',
    purpose: '社群企劃討論',
  },
  {
    venue: '105',
    table: 2,
    date: '2026-10-09',
    start: '15:30',
    end: '17:00',
    by: '財務部',
    purpose: '預算討論',
  },
  {
    venue: '108',
    date: '2026-10-09',
    start: '18:00',
    end: '21:00',
    by: '活動部',
    purpose: '系烤籌備',
  },
  {
    venue: '103',
    date: '2026-10-12',
    start: '12:10',
    end: '13:20',
    by: '幹部',
    purpose: '週會',
  },
  {
    venue: '110',
    date: '2026-10-13',
    start: '18:30',
    end: '21:30',
    by: '活動部',
    purpose: '之夜排練',
  },
  {
    venue: '105',
    table: 1,
    date: '2026-10-14',
    start: '10:20',
    end: '12:10',
    by: '大二班代',
    purpose: '班會',
  },
  {
    venue: '105',
    table: 2,
    date: '2026-10-14',
    start: '10:20',
    end: '12:10',
    by: '大三班代',
    purpose: '小組報告',
  },
  {
    venue: '108',
    date: '2026-10-15',
    start: '18:00',
    end: '20:00',
    by: '行政部',
    purpose: '資料整理',
  },
  {
    venue: '105',
    date: '2026-10-17',
    start: '09:00',
    end: '17:00',
    by: '活動部',
    purpose: '工作坊',
  },
  {
    venue: '103',
    date: '2026-10-19',
    start: '12:10',
    end: '13:20',
    by: '幹部',
    purpose: '週會',
  },
  {
    venue: '105',
    table: 3,
    date: '2026-10-21',
    start: '19:00',
    end: '21:00',
    by: '學術部',
    purpose: '模擬面試',
  },
];
