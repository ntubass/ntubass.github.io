import ogImageSrc from '@images/social.png';

/**
 * 網站基本資料。系學會名稱、網址、聯絡信箱都在這裡改一次就好，
 * 導覽列、頁尾、分頁標題、SEO 都會自動套用。
 */
export const SITE = {
  /** 系學會名稱（導覽列 logo、分頁標題、頁尾） */
  title: '臺大工管系學會',
  /** 一句話標語 */
  tagline: '國立臺灣大學工商管理學系系學會',
  /** 網站網址（不含子路徑），自動取自 astro.config.mjs 的 `site` */
  url: (import.meta.env.SITE ?? 'https://example.com').replace(/\/$/, ''),
  /** 聯絡信箱 */
  email: 'ntubassgoo@gmail.com',
  /** 目前是第幾屆（頁尾版權用，例如 '第 30 屆'）；留空字串就不顯示 */
  term: '',
  author: '臺大工管系學會',
};

/**
 * 「關於我們」頁的許願池按鈕連到的表單（Google 表單等）。
 * 留空字串的話按鈕會顯示成灰色的「許願表單準備中」、不能點。
 */
export const WISH_FORM_URL = '';

// 每頁的標題、描述文字在 `src/copy/zh-tw.ts`；
// `src/utils/metadata.ts` 會用它們組出 <head>。
export const OG = {
  image: ogImageSrc,
};
