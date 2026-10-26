/**
 * 場地借用：場地清單。改完存檔、重新部署後網站就會更新。
 *
 * 借用紀錄存在 Firestore（見 FIREBASE.md），借用狀況頁面即時讀取，
 * 會自動以「今天」所在的那一週顯示，也可以切換上一週 / 下一週。
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
  /** 單張討論桌單次最多可借幾小時（選填；只對有 `tables` 的場地有效） */
  tableMaxHours?: number;
}

/**
 * 一筆借用紀錄。存在 Firestore 的 `bookingDays` 集合（同一個場地同一天一份文件），
 * 由系上同學在場地頁線上預約，或由管理員代為登記；不再寫在這個檔案裡。
 */
export interface Booking {
  /** 文件內的代號，取消預約時用 */
  id: string;
  /** 對應上面場地的 `id` */
  venue: string;
  /**
   * 借哪一張討論桌（只有設定了 `tables` 的場地才會有）：1 是第一張、2 是第二張…
   * `null` 就是借整間。
   */
  table: number | null;
  /** 日期，格式 'YYYY-MM-DD'，例如 '2026-10-12' */
  date: string;
  /** 開始與結束時間，格式 'HH:MM'（24 小時制） */
  start: string;
  end: string;
  /** 借用單位，例如「學術部」「大一班代」 */
  by: string;
  /** 用途（選填），例如「幹部會議」 */
  purpose: string;
  /** 預約者的帳號代號與名字（Google 帳號） */
  uid: string;
  name: string;
}

export const venues: Venue[] = [
  { id: '103', name: '103 教室', location: '管理學院教研館' },
  {
    id: '105',
    name: '105 教室',
    location: '管理學院教研館',
    tables: ['討論桌 1', '討論桌 2', '討論桌 3'],
    notes: ['進入須脫鞋，並將鞋子整齊放好', '單張桌子單次借用上限 3 小時'],
    tableMaxHours: 3,
  },
  { id: '108', name: '108 教室', location: '管理學院教研館' },
  { id: '110', name: '110 教室', location: '管理學院教研館' },
];
