# Project Memory — Kiara Insights SEO

_Last updated: June 2026. This file records the premises and decisions behind
the site's SEO/GEO architecture so future edits (human or agent) stay consistent._

## Goal
Make every article on `insights.kiara.capital` independently discoverable by
search engines and answer engines (GEO), without changing the existing design.

## Core premise — single source of truth
`index.html` holds two things that define the site:
1. The homepage **cards** in `#articles-grid` (one per article, with `data-article="<slug>"`).
2. The **`ARTICLES`** JS object — the full text of every article (the canonical content).

Everything else is **generated** from `index.html` by `generate.js`:
`articles/<slug>/index.html`, `sitemap.xml`, and `llms.txt`. Never hand-edit
generated files; edit `index.html` and re-run `node generate.js ../kiara-site`.

## Decisions that must not change
- **Design is frozen.** Article pages reuse the exact site CSS, header and footer,
  and the modal's classes — no new look, no redesign.
- **One H1 per page.** On article pages the only H1 is the article title.
- **Modal stays as progressive enhancement.** Card links point to the real
  `/articles/<slug>/` URL; JS opens the modal on click. Crawlers/no-JS get the page.
- **English content.** `lang="en"`, English titles/descriptions, audience is the
  global VC/AI/fintech reader.
- **All published articles are kept** — never delete an article.

## SEO/GEO checklist baked into generation
- Unique `<title>` and a written `<meta name="description">` summary per page
- `<link rel="canonical">` to the article's own URL
- `robots` meta: `index, follow, max-image-preview:large, max-snippet:-1`
- Open Graph (`og:type=article`, article image) + Twitter `summary_large_image`
- JSON-LD: `Article` (headline, description, image, datePublished, author,
  publisher) + `BreadcrumbList`
- `sitemap.xml`: homepage + all articles, with `lastmod`
- `robots.txt`: allows search engines **and** AI/answer-engine crawlers (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, etc.)
- `llms.txt`: site summary + links to every article, grouped by category (GEO)
- Homepage social image: `og-cover.png` (1200×630, branded) — not the SVG logo
- `.nojekyll`: GitHub Pages serves `/articles/` as-is (no Jekyll processing)

## Repository layout & hygiene
- The deliverable is split into **`kiara-site/`** (everything that goes live — no
  `.md`, no build script) and **`kiara-project/`** (docs, `generate.js`, the audit,
  the email, and the paginated homepage alternative). Deploy only `kiara-site`.
- **One homepage only.** `index.html` is the single-scroll version; a paginated
  variant lives in `kiara-project/index-paginated.html` and *replaces* `index.html`
  if chosen. Never ship both — duplicate content (`/` vs `/index-paginated.html`).
- Recommended repo setup to keep both the clean live site and the daily agent:
  serve GitHub Pages from `/docs` (the site) and keep `generate.js` + `CLAUDE.md` at
  the repo root.

## Maintenance
- The daily auto-publishing agent (see `README.md` / `CLAUDE.md`) MUST run
  `node generate.js <site-folder>` after injecting articles, and commit the regenerated
  `articles/`, `sitemap.xml`, and `llms.txt` together with `index.html`.
- To add/edit an article by hand: edit `index.html`, run `node generate.js ../kiara-site`,
  commit, push.

## After-deploy actions (one-time)
1. Submit `https://insights.kiara.capital/sitemap.xml` in Google Search Console.
2. Validate an article URL in the Rich Results Test.
3. Re-share an article on LinkedIn/X to confirm the new preview image.
