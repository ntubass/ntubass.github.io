/**
 * 導覽結構：每個連結的 id 與網址。顯示的文字在 `copy.nav.labels`（以 id 對應），
 * 所以改文字不用動這裡，改網址不用動文案。
 */
export type NavLinkId =
  | 'home'
  | 'activities'
  | 'career'
  | 'resources'
  | 'partners'
  | 'venues'
  | 'about';

/**
 * 導覽列的順序就是這裡的順序。`alsoActiveOn`：在這些網址底下時，這個選項也會亮起來
 * （例如訪談頁 /interviews/xxx/ 屬於職涯發展）。
 */
export const navLinks: {
  id: NavLinkId;
  path: string;
  alsoActiveOn?: string[];
}[] = [
  { id: 'home', path: '/' },
  { id: 'activities', path: '/activities' },
  { id: 'career', path: '/career', alsoActiveOn: ['/interviews'] },
  { id: 'resources', path: '/resources' },
  { id: 'partners', path: '/partners' },
  { id: 'venues', path: '/venues' },
  { id: 'about', path: '/about-us' },
];

/** 社群連結：沒有的平台留空字串，頁尾就不會顯示 */
export const socialLinks = {
  instagram: 'https://www.instagram.com/ntubasa_/',
  facebook: 'https://www.facebook.com/',
  linkedIn: 'https://www.linkedin.com/',
};
