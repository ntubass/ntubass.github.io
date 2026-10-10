/**
 * 合作夥伴名單，顯示在「合作夥伴」頁的 Logo 牆。順序就是顯示順序。
 *
 * - `name`：企業或組織名稱
 * - `logo`：Logo 檔名（選填）。把圖片放進 `src/images/partners/`，
 *   這裡只要填檔名，例如 `logo: 'acme.png'`。
 *   建議用去背的 PNG 或 SVG；沒填的話會直接顯示名稱文字。
 * - `url`：官網網址（選填，有填的話 Logo 可以點）
 */
export interface Partner {
  name: string;
  /** `src/images/partners/` 裡的檔名，例如 'acme.png' */
  logo?: string;
  url?: string;
}

export const partners: Partner[] = [
  { name: '範例科技股份有限公司' },
  { name: '範例顧問公司' },
  { name: '範例零售股份有限公司' },
  { name: '範例製造股份有限公司' },
  { name: '範例金融集團' },
  { name: '範例基金會' },
];
