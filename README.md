# Kiara Capital — Insights Blog

> Venture capital intelligence, startup ecosystem analysis, financial innovation and AI — in Brazil and across the globe.

**Live:** [insights.kiara.capital](https://insights.kiara.capital)

---

## What this is

A static HTML blog for [Kiara Capital](https://kiaracapital.com.br), a venture capital firm focused on AI-native financial services, fintech, and innovation in Brazil and Latin America.

The blog covers:
- **Venture Capital** — deal flow, fund strategy, LP updates
- **Artificial Intelligence** — agentic finance, LLMs at the application layer, AI-native startups
- **Fintech** — Open Finance, Pix, Drex, neobanks, payment infrastructure
- **Deep Tech** — quantum, biotech, climate tech
- **Regulation** — CVM, Banco Central, SEC, AI legislation
- **ESG & Impact** — sustainable investing, impact funds

---

## How it works

### Stack
- Pure HTML + CSS — no framework, no build step, no dependencies
- Hosted on **GitHub Pages** (free, automatic deploys on push)
- Fonts: [Sora](https://fonts.google.com/specimen/Sora) + [Raleway](https://fonts.google.com/specimen/Raleway) via Google Fonts
- Icons: [Remix Icon](https://remixicon.com/)

### Brand
Colors and identity follow the **Kiara Brand Style Guide 2023**:
- Primary: `#7664FA` (purple)
- Secondary: `#49FADE` (cyan)
- Background: `#000B33` (deep navy)

### Automated content
A **Claude Code remote agent** runs every day at 6pm (Brasília time) and:

1. Searches for trending topics in VC, AI, fintech, and startups (last 48h)
2. Writes 2–3 articles in Kiara's voice — analytical, direct, contrarian
3. Injects them into `index.html` (newest articles on top, capped at 6 cards)
4. Updates the featured article
5. Commits and pushes automatically

The agent is calibrated on Kiara's LP Letters (Q3 2025 – Q1 2026) and Michael Esrubilsky's LinkedIn posts to match the firm's tone of voice.

---

## Local development

No build process needed. Just open the file:

```bash
# Clone
git clone https://github.com/isadoraguadagninib-lgtm/blogkiara.git
cd blogkiara

# Open in browser (macOS / Linux)
open index.html

# Or on Windows
start index.html
```

To pull the latest articles after the daily agent runs:

```bash
git pull origin main
```

---

## Repo structure

```
blogkiara/
├── index.html          # Main blog page (auto-updated daily)
└── README.md           # This file
```

---

## Content guidelines

All articles follow Kiara's editorial voice:

- **Specific** — real companies, real data, real events. No vague generalities.
- **Contrarian** — find the angle others aren't covering.
- **Thesis-driven** — every piece connects to a clear investment or strategic insight.
- **No jargon** — avoid "game-changer", "leverage", "seamless", "cutting-edge".
- **Short paragraphs** — 2–4 sentences. Line breaks. No walls of text.

---

## Automated agent

Managed via [Claude Code Routines](https://claude.ai/code/routines).

| Setting | Value |
|---|---|
| Schedule | Daily at 21:00 UTC (18:00 BRT) |
| Model | Claude Sonnet 4.6 |
| Routine ID | `trig_01JNGgNbcMRAvpKoog48cyTW` |

---

## About Kiara Capital

Kiara Capital is a venture capital firm backing exceptional founders building at the intersection of AI and financial services. We focus on the application and data layer — not infrastructure — where we believe the most defensible fintech companies will be built.

**Thesis pillars:**
- Data Moat Categories — proprietary data as competitive advantage
- Intelligent Workflows — AI transforming SMB finance, accounting, fiduciary services
- Accessible Finance — making complex processes scalable and inclusive

Portfolio companies include Astride, Payana, Nexa Finance, Rinne, Lugui, BOND, and W (stealth).

---

*Content is for informational purposes only and does not constitute an offer of securities or investment advice. © 2026 Kiara Capital.*
