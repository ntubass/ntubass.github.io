/**
 * 活動成果的活動清單，順序就是頁面上由上到下的順序。
 *
 * - `id`：英文代號，會變成網址錨點，例如 /activities#camp
 * - `name`：活動名稱
 * - `time`：顯示在活動名稱上方的時間，自由填寫，例如 '9 月'、'上學期・10 月'
 * - `description`：活動簡介（一兩句話）
 * - `website`：活動網站網址（留空字串的話按鈕會是灰色、不能點）
 * - `photos`：活動相簿網址，例如 Google 相簿、IG 精選動態（留空字串的話按鈕會是灰色、不能點）
 * - `images`：活動照片的檔名清單（選填），可以放好幾張，頁面上可以左右滑動瀏覽。
 *   把照片放進 `src/images/activities/`，這裡只要填檔名，例如
 *   `images: ['camp-1.jpg', 'camp-2.jpg', 'camp-3.jpg']`。
 *   建議用橫式照片（寬:高 = 4:3），重點放在中間；沒填的話會顯示暖色的預留位置。
 */
export interface ClubActivity {
  id: string;
  name: string;
  time: string;
  description: string;
  website: string;
  photos: string;
  /** `src/images/activities/` 裡的檔名，例如 ['camp-1.jpg', 'camp-2.jpg'] */
  images?: string[];
}

export const activities: ClubActivity[] = [
  {
    id: 'welcome',
    name: '小迎新',
    time: '8 月',
    description:
      '開學前為新生舉辦的第一場見面活動，認識同屆同學與學長姐，提前熟悉系上與校園生活。',
    website: '',
    photos: '',
  },
  {
    id: 'camp',
    name: '宿營',
    time: '9 月',
    description:
      '專為新生設計的迎新宿營，透過團康、隊呼與晚會，讓大家在幾天內從陌生到熟悉。',
    website: '',
    photos: '',
  },
  {
    id: 'bbq',
    name: '系烤',
    time: '11 月',
    description:
      '全系一起烤肉同樂，學長姐與學弟妹在輕鬆的氣氛中交流，是系上最受歡迎的聚會之一。',
    website: '',
    photos: '',
  },
  {
    id: 'azalea',
    name: '杜鵑花節',
    time: '3 月',
    description:
      '在校園開放日向高中生介紹系上的課程與生活，由系學會成員規劃攤位與解說。',
    website: '',
    photos: '',
  },
  {
    id: 'night',
    name: '之夜',
    time: '4 月',
    description:
      '系上年度的表演盛會，從戲劇、舞蹈到樂團，全部由同學自己籌備與演出。',
    website: '',
    photos: '',
  },
  {
    id: 'party',
    name: '期末聯歡',
    time: '6 月',
    description:
      '學期結束前的聯歡活動，替這一學年畫下句點，也歡送即將畢業的學長姐。',
    website: '',
    photos: '',
  },
  {
    id: 'key',
    name: '管理之鑰',
    time: '7 月',
    description: '系上的年度代表活動，詳細內容請見活動網站。',
    website: '',
    photos: '',
  },
];
