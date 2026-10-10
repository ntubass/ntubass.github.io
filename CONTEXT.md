# Domain glossary

Names for the concepts this codebase is built around.

## Locale

The language a page is published in. Currently only `zh-tw` (no URL prefix). Owned by `src/utils/locale.ts`; exposed per request as `Astro.locals.locale`.

## Copy Table

The typed table of every user-facing string (`src/copy/zh-tw.ts`). Its shape is `Copy`; any future locale must satisfy it. Exposed per request as `Astro.locals.copy`. Logic keys on stable ids (e.g. nav link ids, resource section ids such as `finance`), never on display labels.

## View

The implementation of one route (`src/views/*View.astro`). Route files in `src/pages/` are one-line shells that render a view for a locale.

## Content Entry

A Markdown document in a localised collection, stored as `src/content/<collection>/<locale>/<slug>.md`. Currently only:

- **Interview** (`interviews`): a 職涯訪談 article, listed on `/career` newest first, with its own page at `/interviews/<slug>/`.

`src/utils/content.ts` owns the id rule, each collection's route and default ordering.

## Department

A group of officers in `src/data_files/team.ts`, rendered by `TeamGrid` (compact on the home page, full on `/about-us`).

## Page Metadata

Everything a page's `<head>` needs, derived by `src/utils/metadata.ts` from locale, path, title, description and page kind. Rendered by `Meta.astro`.
