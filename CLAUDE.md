# Kiara Insights — Project Instructions for Claude

## Git Workflow

After committing article changes on any development branch, **always merge and push directly to `main` immediately** — no confirmation needed.

The sequence for every publishing run:
1. Inject the new articles into `index.html` (cards + `ARTICLES` object)
2. **Regenerate SEO assets** (see below) — this is mandatory
3. Commit on the dev branch (e.g. `claude/...`) — include `index.html`, `articles/`, `sitemap.xml`, `llms.txt`
4. `git checkout main && git pull origin main`
5. `git merge <dev-branch> --no-edit`
6. `git push -u origin main`

## Publishing Rules

- Publish 2–3 articles per day, only about topics genuinely trending in the last 24–48h
- Validate topics against: recency, multiple sources, investment angle, non-obvious take
- Never remove existing articles — all published articles must stay
- New articles always go AT THE TOP of the grid
- Add the full article body to the `ARTICLES` JS object (this is the source of truth)
- Each card MUST have a `data-article="<slug>"` matching its `ARTICLES` key

## SEO regeneration — MANDATORY after every publish

`index.html` (in the live site folder) is the single source of truth. After
injecting articles, run the generator against that folder, e.g.:

```bash
node generate.js ../kiara-site      # or: node generate.js ./docs
```

This regenerates, for every article:
- `articles/<slug>/index.html` — a standalone, indexable page (unique title,
  meta description, single H1, canonical, Open Graph + Twitter, and
  Article + BreadcrumbList JSON-LD for SEO **and** GEO/answer engines)

…and rebuilds:
- `sitemap.xml` — homepage + every article
- `llms.txt` — site summary + links to every article, grouped by category

**Never hand-edit files under `articles/`, `sitemap.xml`, or `llms.txt`** — they
are generated. Edit `index.html`, then run `generate.js`. Commit the regenerated
files alongside `index.html`.

The homepage modal is kept as a progressive enhancement: card links point to the
real `/articles/<slug>/` URLs, and JS opens the modal for visitors who have it.
Crawlers and shared links always resolve to the real page.

## Repository hygiene

- The **live site folder must contain only served files** — no `.md`, no
  `generate.js`. Docs and tooling live outside it (the `kiara-project` folder, or the
  repo root when serving Pages from `/docs`).
- **Only one homepage** ships. A paginated alternative exists in `kiara-project/`
  (`index-paginated.html`); to use it, it *replaces* `index.html`. Never deploy both —
  `/` and `/index-paginated.html` would be duplicate content. The paginated file is
  never added to `sitemap.xml`.

## Voice & Style

See `TONE_GUIDE.md` for full editorial guidelines.
Short version: take a stance, be specific, find the overlooked angle, connect to structural shifts.
Never use: game-changer, landscape, leverage (verb), cutting-edge, robust, seamless, revolutionary, disruptive.

## Project premises & decisions

See `PROJECT-MEMORY.md` for the SEO architecture premises and the decisions
behind this structure (what must not change, and why).
