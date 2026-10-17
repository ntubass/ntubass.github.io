# AI Guide

For AI assistants: project structure, conventions, and where to find or add code. See [CONTEXT.md](CONTEXT.md) for the names of the main modules.

## Project Overview

A student-club website built with Astro 7, Tailwind CSS v4 (via `@tailwindcss/vite`), Preline (accordions, collapse) and Lenis (smooth scroll). Published in Traditional Chinese only (`zh-tw`, unprefixed URLs), but every page still reads its locale and copy through `Astro.locals`, so a language can be added later (see below).

Routes (nav order): `/` (home), `/activities` (timeline from `src/data_files/activities.ts`), `/career` (interviews, career talks, mentorship, job resources, internship-experience link; interview pages at `/interviews/[id]`), `/resources` (field tabs + separate 考古題 block; cards from `src/content/resources/zh-tw/*.md`, link-out or article pages at `/resources/[id]`), `/partners`, `/venues` (weekly booking schedule rendered client-side from `src/data_files/venues.ts`), `/about-us` (story, team, contact, then recruitment at `#recruit`), `/404`. `/interviews` redirects into `/career#interviews` and `/recruit` into `/about-us#recruit` (see `redirects` in `astro.config.mjs`).

## Path Aliases

| Alias           | Resolves to            |
| --------------- | ---------------------- |
| `@/*`           | `src/*`                |
| `@components/*` | `src/components/*`     |
| `@content/*`    | `src/content/*`        |
| `@data/*`       | `src/data_files/*`     |
| `@images/*`     | `src/images/*`         |
| `@scripts/*`    | `src/assets/scripts/*` |
| `@styles/*`     | `src/assets/styles/*`  |
| `@utils/*`      | `src/utils/*`          |
| `@views/*`      | `src/views/*`          |

## Where things live

| Purpose                 | Path                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| All page text           | [src/copy/zh-tw.ts](src/copy/zh-tw.ts) (defines the `Copy` shape)                                      |
| Site name, email, URL   | [src/data_files/constants.ts](src/data_files/constants.ts)                                             |
| Nav links, social links | [src/data_files/navigation.ts](src/data_files/navigation.ts)                                           |
| Officer roster          | [src/data_files/team.ts](src/data_files/team.ts); photos in `src/images/team/`                         |
| Partner logo wall       | [src/data_files/partners.ts](src/data_files/partners.ts); logos in `src/images/partners/`              |
| Recruiting on/off, form | [src/data_files/recruit.ts](src/data_files/recruit.ts)                                                 |
| Page banner photos      | `src/images/heroes/*.jpg` (one per page, see `CREDITS.md` there); rendered by `PageHero`               |
| Venues & bookings       | [src/data_files/venues.ts](src/data_files/venues.ts) (venues, bookings, form URL)                      |
| Activity timeline       | [src/data_files/activities.ts](src/data_files/activities.ts) (name, time, intro, website, photos)      |
| Interviews / resources  | `src/content/{interviews,resources}/zh-tw/*.md`, schemas in [content.config.ts](src/content.config.ts) |
| Views (one per route)   | [src/views/](src/views/); `src/pages/` files are one-line shells                                       |
| Layout                  | [src/layouts/MainLayout.astro](src/layouts/MainLayout.astro) builds `<head>` via `buildPageMetadata()` |
| Shared section pieces   | `components/ui/blocks/` (Section, SectionHeader, FeatureGrid, Timeline), `components/sections/`        |

## Conventions

- **Copy:** no user-facing strings in components or views; add keys to `src/copy/zh-tw.ts`. Structure (paths, ids, URLs, rosters) lives in `src/data_files/`.
- **Content URLs:** `pathFor(entry)` / `entriesFor()` / `staticPathsFor()` from `@utils/content`; never parse `entry.id`.
- **Locale:** `Astro.locals.locale` / `Astro.locals.copy` (set by `src/middleware.ts`). Build links with `localePath(locale, '/career')`.
- **Styling:** Tailwind v4 syntax only. Palette is limited to the colours in `global.css` (`neutral`, `yellow`, `orange`, `zinc`, `gray`, `indigo`, `red`).
- **Icons:** `<Icon name="…" class="…" />`; geometry in `components/ui/icons/icons.ts`.

## Adding a language later

Extend `MARKETING_LOCALES` and `LOCALE_INFO` in `src/utils/locale.ts`, add `src/copy/<locale>.ts` typed as `Copy`, add `src/pages/<locale>/` shells, and add content under `src/content/*/<locale>/`.

## Commands

- `npm run dev`: dev server
- `npm run build`: `astro check` + build + HTML minify
- `npm run test:smoke`: serve `dist/` and check every route

## Deploy (GitHub Pages)

- `.github/workflows/deploy.yml` builds and publishes on every push to `main`/`master`. Repo Settings → Pages → Source must be **GitHub Actions**.
- The workflow passes `SITE_URL` and `BASE_PATH` from `actions/configure-pages`, so the site works both at `https://<user>.github.io/` and at `https://<user>.github.io/<repo>/`.
- Internal links must go through `localePath()` (pages) or `withBase()` (files in `public/`); never hard-code `/something` in `href`/`src`, or it breaks under a subpath.
- Local subpath test (Git Bash): `MSYS_NO_PATHCONV=1 BASE_PATH=/babasite npm run build && npx astro preview`.
