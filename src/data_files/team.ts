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
      { name: '王小明', title: '會長' },
      { name: '林小華', title: '副會長' },
    ],
  },
  {
    name: '財務部',
    description: '管理系學會經費與活動預算，處理報帳與贊助款項。',
    members: [
      { name: '陳大同', title: '財務部長' },
      { name: '李小美', title: '財務部員' },
    ],
  },
  {
    name: '行政部',
    description: '負責系上教研教室的借用登記、文件與會議紀錄，讓系學會順利運作。',
    members: [
      { name: '張家豪', title: '行政部長' },
      { name: '黃宜庭', title: '行政部員' },
    ],
  },
  {
    name: '學術部',
    description: '籌辦職涯講座與訪談，整理各領域的學習與職涯資源。',
    members: [
      { name: '吳承恩', title: '學術部長' },
      { name: '劉怡君', title: '學術部員' },
      { name: '蔡宗翰', title: '學術部員' },
    ],
  },
  {
    name: '活動部',
    description: '籌辦迎新、宿營、系烤、之夜等系上活動。',
    members: [
      { name: '楊雅婷', title: '活動部長' },
      { name: '許志明', title: '活動部員' },
    ],
  },
  {
    name: '行銷部',
    description: '經營系學會 IG 等社群、設計視覺素材，並負責活動與招募宣傳。',
    members: [
      { name: '鄭佳穎', title: '行銷部長' },
      { name: '謝承翰', title: '行銷部員' },
    ],
  },
];
