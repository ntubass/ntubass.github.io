/**
 * 現任幹部名單，依部門分組。每個部門會在「關於我們」頁顯示成一張卡片，
 * 首頁也會顯示精簡版。部門的順序就是卡片的順序。
 *
 * - `name`：姓名
 * - `title`：職稱
 * - `photo`：大頭照檔名（選填）。把照片放進 `src/images/team/`，
 *   這裡只要填檔名，例如 `photo: 'wang.jpg'`。
 *   沒填的話會顯示灰色的照片預留位置。建議用直式照片（寬:高 = 4:5）。
 * - `linkedin`：個人 LinkedIn 網址（選填，有填姓名就會變成連結）
 */
export interface TeamMember {
  name: string;
  title: string;
  /** `src/images/team/` 裡的檔名，例如 'wang.jpg' */
  photo?: string;
  linkedin?: string;
}

export interface Department {
  /** 部門名稱 */
  name: string;
  /** 部門負責什麼（一兩句話） */
  description: string;
  members: TeamMember[];
}

export const departments: Department[] = [
  {
    name: '正副會長',
    description: '統籌系學會整體方向、對外合作，並協調各部門運作。',
    members: [
      { name: '陳宥均', title: '會長', photo: '陳宥均.jpg' },
      { name: '劉翔安', title: '副會長', photo: '劉翔安.jpg' },
    ],
  },
  {
    name: '財務部',
    description: '管理系學會經費與活動預算，處理報帳與贊助款項。',
    members: [
      { name: '林之云', title: '財務部長', photo: '林之云.jpg' },
    ],
  },
  {
    name: '行政部',
    description: '負責系上教研教室的借用登記、文件與會議紀錄，讓系學會順利運作。',
    members: [
      { name: '周愈軒', title: '行政部長', photo: '周愈軒.jpg' },
      { name: '林子曦', title: '行政部長', photo: '林子曦.jpg' },
    ],
  },
  {
    name: '學術部',
    description: '籌辦職涯講座與訪談，整理各領域的學習與職涯資源。',
    members: [
      { name: '葉翊廷', title: '學術部長', photo: '葉翊廷.jpg' },
      { name: '岳楷翔', title: '學術部長', photo: '岳楷翔.jpg' },
      { name: '崔珈瑄', title: '學術部長', photo: '崔珈瑄.jpg' },
    ],
  },
  {
    name: '活動部',
    description: '籌辦迎新、宿營、系烤、之夜等系上活動。',
    members: [
      { name: '王廷宇', title: '活動部長', photo: '王廷宇.jpg' },
      { name: '楊芷淵', title: '活動部長', photo: '楊芷淵.jpg' },
      { name: '吳孟蓁', title: '活動部長', photo: '吳孟蓁.jpg' },
    ],
  },
  {
    name: '行銷部',
    description: '經營系學會 IG 等社群、設計視覺素材，並負責活動宣傳。',
    members: [
      { name: '胡詠涵', title: '行銷部長', photo: '胡詠涵.jpg' },
      { name: '吳宇薇', title: '行銷部長', photo: '吳宇薇.jpg' },
      { name: '鄭清蔚', title: '行銷部長', photo: '鄭清蔚.jpg' },
    ],
  },
];
