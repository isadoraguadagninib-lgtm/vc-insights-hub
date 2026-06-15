# Maintenance & deploy

## Folder layout (this handoff)
- **`kiara-site/`** — the live site. **This, and only this, goes to the web.**
  Contains no .md files and no build script.
- **`kiara-project/`** (this folder) — build script, docs, the paginated homepage
  alternative, the SEO audit and the email. **Never deployed.**

## Deploy
Upload **only the contents of `kiara-site/`** to the repo / GitHub Pages root.
Do not upload any `.md`, `generate.js`, or `index-paginated.html`.

## Adding or editing an article
1. Edit `kiara-site/index.html` (card + the `ARTICLES` object) as before.
2. From this folder, regenerate the SEO assets against the live folder:
   ```bash
   node generate.js ../kiara-site
   ```
   This rebuilds `kiara-site/articles/*`, `sitemap.xml`, and `llms.txt`.
3. Commit/push the `kiara-site` contents.

## Daily auto-publishing agent
The agent (see `CLAUDE.md`) needs `generate.js` and `CLAUDE.md` available where it
runs. Two clean ways to keep the live site free of those files:
- **Recommended:** in the repo, keep `generate.js` + the `.md` files at the root and
  serve GitHub Pages from a `/docs` subfolder that holds the `kiara-site` contents.
  The served site stays clean; the agent still has its tools at the root.
- Or run the agent from a working copy that has the tools, and publish only the
  `kiara-site` output to the Pages source.

(Ask and we can wire the `/docs` setup for you.)
