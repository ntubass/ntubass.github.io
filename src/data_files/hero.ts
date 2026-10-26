/**
 * 首頁最上方拍立得拼貼的照片。拼貼有 10 個位置，照片依順序填入；
 * 照片少於 10 張時會從頭輪流使用，所以放幾張都可以。
 *
 * 換成系學會自己的照片：
 * 1. 把照片放進 `src/images/hero/`（建議寬度 1200px 以上）
 * 2. 在下面的清單填 `file: 'hero/檔名.jpg'`，`caption` 是寫在相框下緣的字（選填）
 * 3. 用不到的圖庫照片從清單刪掉即可
 *
 * 版面上第 2、4、5、7、9 個位置是橫的大相框，適合放大合照或活動全景。
 * `position` 可以調整照片裁切的重心，例如 '50% 30%' 是偏上（選填）。
 */
export interface HeroPhoto {
  /** `src/images/` 底下的路徑，例如 'hero/2025-宿營.jpg' */
  file: string;
  /** 相框下緣的說明（選填） */
  caption?: string;
  /** 照片裁切的重心（CSS object-position，選填） */
  position?: string;
}

// 目前是暫時的圖庫照片（來源見 src/images/heroes/CREDITS.md），沒有說明文字
export const heroPhotos: HeroPhoto[] = [
  { file: 'heroes/partners.jpg', position: '50% 40%' },
  { file: 'heroes/home.jpg' },
  { file: 'heroes/activities.jpg', position: '50% 30%' },
  { file: 'heroes/about.jpg' },
  { file: 'heroes/venues.jpg', position: '30% 50%' },
  { file: 'heroes/resources.jpg' },
  { file: 'heroes/career.jpg' },
];
