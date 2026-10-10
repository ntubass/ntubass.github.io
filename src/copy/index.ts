import type { MarketingLocale } from '@utils/locale';
import { zhTw } from './zh-tw';

/**
 * Copy module: one typed table of UI strings per locale.
 *
 * `Copy` is the shape of the Traditional Chinese table, so any locale added
 * later must provide every key (missing or extra keys fail `astro check`).
 * Components read the current table from `Astro.locals.copy`; code that
 * already has a locale in hand (views, `getStaticPaths`) can call
 * `getCopy(locale)`.
 */
export type Copy = typeof zhTw;

const tables: Record<MarketingLocale, Copy> = { 'zh-tw': zhTw };

export function getCopy(locale: MarketingLocale): Copy {
  return tables[locale];
}
