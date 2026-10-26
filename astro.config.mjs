import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// 子路徑（例如 GitHub Pages 的 /repo名稱），沒有子路徑時是空字串
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

// https://astro.build/config
export default defineConfig({
  // 網站網址與子路徑。部署到 GitHub Pages 時，由 .github/workflows/deploy.yml 自動帶入
  // （例如 https://帳號.github.io 與 /repo名稱）；在自己電腦上開發時用預設值。
  site: process.env.SITE_URL || 'https://example.com',
  base: process.env.BASE_PATH || '/',
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  image: {
    domains: ['images.unsplash.com'],
  },
  // 沒有獨立頁面的網址，轉到對應的區塊（目的地要加上子路徑）
  redirects: {
    '/interviews': `${BASE}/career#interviews`,
  },
  prefetch: true,
  // 管理後台不放進 sitemap
  integrations: [sitemap({ filter: page => !page.includes('/admin') }), mdx()],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
