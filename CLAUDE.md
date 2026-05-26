[CLAUDE.md](https://github.com/user-attachments/files/28286028/CLAUDE.md)
# Kiara Insights — Project Instructions for Claude

## Git Workflow

After committing article changes on any development branch, **always merge and push directly to `main` immediately** — no confirmation needed.

The sequence for every publishing run:
1. Commit on the dev branch (e.g. `claude/...`)
2. `git checkout main && git pull origin main`
3. `git merge <dev-branch> --no-edit`
4. `git push -u origin main`

This ensures articles go live on the site without any manual PR step.

## Publishing Rules

- Publish 2–3 articles per day, only about topics genuinely trending in the last 24–48h
- Validate topics against: recency, multiple sources, investment angle, non-obvious take
- Never remove existing articles — all published articles must stay
- New articles always go AT THE TOP of the grid
- Update the `<section class="featured">` with the most compelling article of the day
- Add full article body to the `ARTICLES` JS object for modal reading

## Voice & Style

See `TONE_GUIDE.md` for full editorial guidelines.
Short version: take a stance, be specific, find the overlooked angle, connect to structural shifts.
Never use: game-changer, landscape, leverage (verb), cutting-edge, robust, seamless, revolutionary, disruptive.
