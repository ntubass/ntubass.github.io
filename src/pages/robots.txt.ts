// https://docs.astro.build/en/guides/integrations-guide/sitemap/#usage
import type { APIRoute } from 'astro';
import { SITE } from '@data/constants';
import { withBase } from '@utils/locale';

const robotsTxt = `
User-agent: Googlebot
Allow: /
Crawl-delay: 10

User-agent: Yandex
Allow: /
Crawl-delay: 2

User-agent: archive.org_bot
Allow: /
Crawl-delay: 2

User-agent: *
Allow: /
Disallow: ${withBase('/admin')}
Disallow: ${withBase('/profile')}

Sitemap: ${SITE.url}${withBase('/sitemap-index.xml')}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
