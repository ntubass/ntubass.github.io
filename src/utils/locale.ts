/**
 * Site locale module.
 *
 * The site is published in Traditional Chinese only, but every page still
 * reads its locale and copy table through this module (via `Astro.locals`),
 * so a second language can be added later without touching the views:
 * extend `MARKETING_LOCALES` and `LOCALE_INFO`, add `src/copy/<locale>.ts`,
 * and add `src/pages/<locale>/` route shells. Nothing else in the codebase
 * should parse a locale prefix out of a pathname.
 *
 * Every function here is pure so it can be unit-tested without Astro.
 */

export const MARKETING_LOCALES = ['zh-tw'] as const;
export type MarketingLocale = (typeof MARKETING_LOCALES)[number];

export const DEFAULT_LOCALE: MarketingLocale = 'zh-tw';

/** Locales that carry a URL prefix (every locale except the default). */
const PREFIXED_LOCALES: readonly MarketingLocale[] = MARKETING_LOCALES.filter(
  locale => locale !== DEFAULT_LOCALE
);

/** Per-locale constants: language tags and Intl tag. */
export const LOCALE_INFO: Record<
  MarketingLocale,
  {
    /** `<html lang>` and `hreflang` value. */
    lang: string;
    /** `og:locale` value. */
    ogLocale: string;
    /** schema.org `inLanguage` value. */
    inLanguage: string;
    /** BCP 47 tag for `Intl` formatting. */
    intl: string;
  }
> = {
  'zh-tw': {
    lang: 'zh-TW',
    ogLocale: 'zh_TW',
    inLanguage: 'zh-TW',
    intl: 'zh-TW',
  },
};

export function isMarketingLocale(value: unknown): value is MarketingLocale {
  return (
    typeof value === 'string' &&
    (MARKETING_LOCALES as readonly string[]).includes(value)
  );
}

/**
 * The site's base path without a trailing slash: '' when the site is served
 * from the domain root, '/repo' on a GitHub Pages project site. Comes from
 * `base` in astro.config.mjs.
 */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

/** Prefix a site-relative path with the base path: withBase('/x') -> '/repo/x'. */
export function withBase(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** Remove the base path from a pathname: '/repo/x' -> '/x'. */
function stripBase(pathname: string): string {
  if (!BASE) return pathname;
  if (pathname === BASE) return '/';
  return pathname.startsWith(`${BASE}/`)
    ? pathname.slice(BASE.length)
    : pathname;
}

/**
 * Split a pathname into the locale it is prefixed with and the rest of the
 * path. The default locale has no prefix. The base path is ignored.
 */
export function splitLocale(pathname: string): {
  locale: MarketingLocale;
  path: string;
} {
  const stripped = stripBase(pathname);
  const normalized = stripped.startsWith('/') ? stripped : `/${stripped}`;
  for (const locale of PREFIXED_LOCALES) {
    const prefix = `/${locale}`;
    if (normalized === prefix) return { locale, path: '/' };
    if (normalized.startsWith(`${prefix}/`)) {
      return { locale, path: normalized.slice(prefix.length) };
    }
  }
  return { locale: DEFAULT_LOCALE, path: normalized };
}

/** Resolve the locale of the current request from its pathname. */
export function resolveLocale(pathname: string): MarketingLocale {
  return splitLocale(pathname).locale;
}

/**
 * Build a site-relative path for a locale, including the base path.
 * Fragments and absolute URLs pass through unchanged.
 *
 *   localePath('zh-tw', '/career') -> '/career'      (or '/repo/career')
 *   localePath('zh-tw', '#faq')      -> '#faq'
 */
export function localePath(locale: MarketingLocale, path = '/'): string {
  if (path.startsWith('#') || /^[a-z]+:/i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return withBase(clean);
  if (clean === '/') return withBase(`/${locale}`);
  return withBase(`/${locale}${clean}`);
}

/** The same page in every locale, for hreflang links. */
export function alternatePaths(
  pathname: string
): Record<MarketingLocale, string> {
  const { path } = splitLocale(pathname);
  return Object.fromEntries(
    MARKETING_LOCALES.map(locale => [locale, localePath(locale, path)])
  ) as Record<MarketingLocale, string>;
}
