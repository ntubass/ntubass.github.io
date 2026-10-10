// https://docs.astro.build/en/guides/content-collections/#defining-collections

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * 職涯訪談：每篇訪談一個 Markdown 檔，放在 `src/content/interviews/zh-tw/`。
 * 檔名就是網址，例如 `2026-wang.md` → `/interviews/2026-wang/`。
 * 內文用 `### 問題` 當作提問，下面的段落就是回答。
 */
const interviewsCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/interviews',
  }),
  schema: ({ image }) =>
    z.object({
      /** 文章標題，建議用受訪者的一句話或主題 */
      title: z.string(),
      /** 一兩句摘要，顯示在列表上 */
      summary: z.string(),
      /** 訪談（或刊出）日期 */
      date: z.date(),
      interviewee: z.object({
        name: z.string(),
        /** 現職，例如「Google 產品經理」 */
        position: z.string(),
        /** 背景，例如「工管系 2020 級校友」（選填） */
        background: z.string().optional(),
      }),
      /** 產業，例如「科技」「顧問」（選填） */
      industry: z.string().optional(),
      /** 文章開頭的金句（選填） */
      quote: z.string().optional(),
      /** 受訪者照片（選填，建議正方形） */
      photo: image().optional(),
      photoAlt: z.string().optional(),
      /** 訪談 / 撰文的幹部（選填） */
      writers: z.string().optional(),
    }),
});

/**
 * 學習資源：每張資源卡片一個 Markdown 檔，放在 `src/content/resources/zh-tw/`。
 * - 有填 `url`：卡片連到外部網站（新分頁開啟）
 * - 沒填 `url`、但 `---` 下面有寫內文：網站會產生一篇文章頁，網址是 /resources/檔名/
 * - 兩個都沒有：卡片顯示「即將推出」
 */
const resourcesCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/resources',
  }),
  schema: z.object({
    title: z.string(),
    /** 屬於哪個領域分頁，要和 `copy.resources.sections` 的 id 一致 */
    field: z.enum(['consulting', 'finance', 'fmcg', 'tech', 'startup']),
    /** 卡片左上角的小標籤，例如「Casebook」「講座筆記」 */
    tag: z.string(),
    /** 卡片上的一兩句說明 */
    description: z.string(),
    /** 外部連結（選填） */
    url: z.url().optional(),
    /** 同一個領域裡的排序，數字小的排前面 */
    order: z.number().default(0),
    /** 文章日期（選填，寫文章時可以填） */
    date: z.date().optional(),
  }),
});

export const collections = {
  interviews: interviewsCollection,
  resources: resourcesCollection,
};
