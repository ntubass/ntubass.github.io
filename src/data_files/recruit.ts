/**
 * 招募設定。招募開始時把 `isOpen` 改成 true，並填上報名表單網址。
 *
 * 目前網站不顯示任何招募內容（首頁的招募橫幅、「加入系學會」按鈕、關於我們頁的招募區塊都已拿掉），
 * 這個檔案、`RecruitSection.astro` 與文案 `copy.recruit` 先保留，之後要恢復時再放回頁面。
 */
export const RECRUIT = {
  isOpen: true,
  /** 報名表單網址（Google 表單等） */
  formUrl: 'https://forms.google.com/',
};
