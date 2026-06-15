/* Kiara Insights — SEO page generator
   Generates one indexable page per article at /articles/{slug}/index.html,
   rewrites homepage card links, and regenerates sitemap.xml + llms.txt.

   Usage:
     node generate.js            # runs against the folder generate.js lives in
     node generate.js ../kiara-seo   # runs against another site folder
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;
const SITE = 'https://insights.kiara.capital';
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* 1. Extract the ARTICLES data object */
const objMatch = html.match(/const ARTICLES = (\{[\s\S]*?\n  \});/);
if (!objMatch) { console.error('Could not locate ARTICLES object'); process.exit(1); }
const ARTICLES = eval('(' + objMatch[1] + ')');

/* 2. Extract per-card excerpt + alt + thumbnail by slug */
const cards = {};
const cardRe = /<article class="card">([\s\S]*?)<\/article>/g;
let m;
while ((m = cardRe.exec(html)) !== null) {
  const block = m[1];
  const slug = (block.match(/data-article="([^"]+)"/) || [])[1];
  if (!slug) continue;
  const excerpt = (block.match(/<p class="card-excerpt">([\s\S]*?)<\/p>/) || [])[1] || '';
  const alt = (block.match(/alt="([^"]*)"/) || [])[1] || '';
  const thumb = (block.match(/src="([^"]+)"/) || [])[1] || '';
  cards[slug] = {
    excerpt: excerpt.replace(/\s+/g, ' ').trim(),
    alt: alt.replace(/\s+/g, ' ').trim(),
    thumb,
  };
}

const MONTHS = { January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',
  July:'07',August:'08',September:'09',October:'10',November:'11',December:'12' };

function toISO(dateStr) {
  const mm = dateStr.match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
  if (!mm) return new Date().toISOString().slice(0, 10);
  return mm[3] + '-' + (MONTHS[mm[1]] || '01') + '-' + String(mm[2]).padStart(2, '0');
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function metaDescription(article, card) {
  let text = (card && card.excerpt) ? card.excerpt : '';
  if (!text) {
    const p = (article.body.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '';
    text = p.replace(/<[^>]+>/g, '');
  }
  text = text.replace(/\s+/g, ' ').trim();
  if (text.length <= 160) return text;
  let cut = text.slice(0, 157);
  cut = cut.slice(0, cut.lastIndexOf(' '));
  return cut + '…';
}

/* 3. Shared chrome */
const styleBlock = html.match(/<style>[\s\S]*?<\/style>/)[0];
const headerBlock = html.match(/<header>[\s\S]*?<\/header>/)[0];
const footerBlock = html.match(/<footer>[\s\S]*?<\/footer>/)[0];
const fontLinks = [
  '  <link rel="preconnect" href="https://fonts.googleapis.com" />',
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
  '  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />',
  '  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />'
].join('\n');

const articleCss = [
  '  <style>',
  '    .article-wrap { max-width: 760px; margin: 0 auto; padding: 48px 20px 72px; }',
  '    .breadcrumb { display:flex; flex-wrap:wrap; align-items:center; gap:8px;',
  "      font-family:'Sora',sans-serif; font-size:12px; font-weight:600;",
  '      color:var(--gray-400); margin-bottom:24px; }',
  '    .breadcrumb a { color:var(--kiara-purple); text-decoration:none; }',
  '    .breadcrumb a:hover { text-decoration:underline; }',
  '    .breadcrumb .sep { color:var(--gray-300); }',
  '    .article-panel { background:var(--bg-card); border-radius:var(--radius-lg);',
  '      overflow:hidden; box-shadow:var(--shadow-md); }',
  '    .article-back { display:inline-flex; align-items:center; gap:8px;',
  "      margin-top:32px; font-family:'Sora',sans-serif; font-size:14px;",
  '      font-weight:600; color:var(--kiara-purple); text-decoration:none; }',
  '    .article-back:hover { text-decoration:underline; }',
  '    @media (max-width: 768px) { .article-wrap { padding: 24px 12px 48px; } }',
  '  </style>'
].join('\n');

/* 4. Build each article page */
const slugs = Object.keys(ARTICLES);
const sitemapUrls = [{ loc: SITE + '/', lastmod: null, priority: '1.0', freq: 'daily' }];
const meta = [];   // collected for llms.txt
let latest = '0000-00-00';

slugs.forEach(slug => {
  const a = ARTICLES[slug];
  const card = cards[slug];
  const url = SITE + '/articles/' + slug + '/';
  const iso = toISO(a.date);
  if (iso > latest) latest = iso;
  const desc = metaDescription(a, card);
  const img = a.img || (card && card.thumb) || (SITE + '/logo-blue.svg');
  const fullTitle = a.title + ' | Kiara Capital Insights';
  meta.push({ slug, url, title: a.title, tag: a.tag, iso, date: a.date, desc });

  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": url + "#article",
        "headline": a.title,
        "description": desc,
        "image": [img],
        "datePublished": iso,
        "dateModified": iso,
        "articleSection": a.tag,
        "inLanguage": "en",
        "url": url,
        "mainEntityOfPage": { "@type": "WebPage", "@id": url },
        "author": { "@type": "Organization", "name": "Kiara Capital", "url": "https://www.kiara.capital/" },
        "publisher": {
          "@type": "Organization",
          "@id": "https://www.kiara.capital/#organization",
          "name": "Kiara Capital",
          "logo": { "@type": "ImageObject", "url": SITE + "/logo-blue.svg" }
        },
        "isPartOf": { "@type": "Blog", "@id": SITE + "/#blog" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Insights", "item": SITE + "/" },
          { "@type": "ListItem", "position": 2, "name": a.tag },
          { "@type": "ListItem", "position": 3, "name": a.title, "item": url }
        ]
      }
    ]
  };

  const page =
'<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'  <meta charset="UTF-8" />\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
'  <title>' + esc(fullTitle) + '</title>\n' +
'  <meta name="description" content="' + esc(desc) + '" />\n' +
'  <link rel="canonical" href="' + url + '" />\n' +
'  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />\n\n' +
'  <!-- Open Graph -->\n' +
'  <meta property="og:type" content="article" />\n' +
'  <meta property="og:site_name" content="Kiara Capital Insights" />\n' +
'  <meta property="og:title" content="' + esc(a.title) + '" />\n' +
'  <meta property="og:description" content="' + esc(desc) + '" />\n' +
'  <meta property="og:url" content="' + url + '" />\n' +
'  <meta property="og:image" content="' + esc(img) + '" />\n' +
'  <meta property="og:locale" content="en_US" />\n' +
'  <meta property="article:published_time" content="' + iso + '" />\n' +
'  <meta property="article:section" content="' + esc(a.tag) + '" />\n' +
'  <meta property="article:publisher" content="https://www.kiara.capital/" />\n\n' +
'  <!-- Twitter / X Card -->\n' +
'  <meta name="twitter:card" content="summary_large_image" />\n' +
'  <meta name="twitter:title" content="' + esc(a.title) + '" />\n' +
'  <meta name="twitter:description" content="' + esc(desc) + '" />\n' +
'  <meta name="twitter:image" content="' + esc(img) + '" />\n\n' +
'  <!-- JSON-LD: Article + Breadcrumb (SEO + GEO) -->\n' +
'  <script type="application/ld+json">\n' +
JSON.stringify(jsonld, null, 2) + '\n' +
'  </script>\n' +
fontLinks + '\n\n' +
styleBlock + '\n' +
articleCss + '\n' +
'</head>\n' +
'<body>\n\n' +
headerBlock + '\n\n' +
'<main class="article-wrap">\n\n' +
'  <nav class="breadcrumb" aria-label="Breadcrumb">\n' +
'    <a href="/">Insights</a>\n' +
'    <span class="sep">/</span>\n' +
'    <span>' + esc(a.tag) + '</span>\n' +
'  </nav>\n\n' +
'  <article class="article-panel">\n' +
'    <div class="modal-hero-img">\n' +
'      <img src="' + esc(img) + '" alt="' + esc((card && card.alt) || a.title) + '" />\n' +
'    </div>\n' +
'    <div class="modal-content">\n' +
'      <div class="modal-meta">\n' +
'        <span class="modal-tag">' + esc(a.tag) + '</span>\n' +
'        <span class="dot">·</span>\n' +
'        <time datetime="' + iso + '">' + esc(a.date) + '</time>\n' +
'        <span class="dot">·</span>\n' +
'        <span>' + esc(a.readtime) + '</span>\n' +
'      </div>\n' +
'      <h1 class="modal-title">' + esc(a.title) + '</h1>\n' +
'      <div class="modal-body">\n' +
a.body.trim() + '\n' +
'      </div>\n' +
'    </div>\n' +
'  </article>\n\n' +
'  <a href="/" class="article-back"><i class="ri-arrow-left-line"></i> All articles</a>\n\n' +
'</main>\n\n' +
footerBlock + '\n\n' +
'</body>\n' +
'</html>\n';

  const dir = path.join(ROOT, 'articles', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page, 'utf8');
  sitemapUrls.push({ loc: url, lastmod: iso, priority: '0.8', freq: 'monthly' });
});

sitemapUrls[0].lastmod = latest;

/* 5. Regenerate sitemap.xml */
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
sitemapUrls.map(u =>
'  <url>\n' +
'    <loc>' + u.loc + '</loc>\n' +
'    <lastmod>' + u.lastmod + '</lastmod>\n' +
'    <changefreq>' + u.freq + '</changefreq>\n' +
'    <priority>' + u.priority + '</priority>\n' +
'  </url>').join('\n') + '\n' +
'</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

/* 6. Regenerate llms.txt (llmstxt.org format) with all article links */
const SECTIONS = ['Venture Capital', 'Artificial Intelligence', 'Financial Innovation', 'Startups', 'Regulation'];
meta.sort((a, b) => b.iso.localeCompare(a.iso));
let articleBlocks = '';
SECTIONS.forEach(sec => {
  const items = meta.filter(x => x.tag === sec);
  if (!items.length) return;
  articleBlocks += '\n### ' + sec + '\n\n';
  items.forEach(x => {
    articleBlocks += '- [' + x.title + '](' + x.url + '): ' + x.desc + '\n';
  });
});
// any tags not in the canonical section list
const other = meta.filter(x => !SECTIONS.includes(x.tag));
if (other.length) {
  articleBlocks += '\n### Other\n\n';
  other.forEach(x => { articleBlocks += '- [' + x.title + '](' + x.url + '): ' + x.desc + '\n'; });
}

const llms = `# Kiara Capital — Insights

> Venture capital intelligence, startup ecosystem analysis, financial innovation and AI — in Brazil and across the globe.

## About

Kiara Capital is a venture capital firm backing exceptional founders building at the intersection of AI and financial services in Brazil and Latin America. We focus on the application and data layer — not infrastructure — where we believe the most defensible fintech companies will be built.

**Website:** https://www.kiara.capital/
**Insights blog:** https://insights.kiara.capital/

## Investment Thesis

- AI at the application and data layer — not infrastructure, not LLMs
- Agentic finance — credit, fraud, compliance, wealth management rebuilt from scratch
- Data moats — proprietary data as defensible competitive advantage
- Intelligent workflows — AI transforming SMB ERPs, accounting, fiduciary services, KYC
- Accessible finance — making complex financial processes scalable
- Brazil and Latin America as structural opportunity

## Portfolio

Astride, Payana, Nexa Finance, Rinne, Lugui, BOND, W (stealth)

## Articles

Kiara Insights publishes analysis on venture capital, artificial intelligence, financial innovation, startups, and regulation — written in the analytical, contrarian voice of Kiara's investment team. Content is for informational purposes only and does not constitute investment advice.
${articleBlocks}`;
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llms, 'utf8');

/* 7. Rewrite homepage card links to real URLs (modal kept as enhancement) */
const homepage = html.replace(
  /<a href="#" class="read-more" data-article="([^"]+)">/g,
  (full, slug) => '<a href="/articles/' + slug + '/" class="read-more" data-article="' + slug + '">'
);
fs.writeFileSync(path.join(ROOT, 'index.html'), homepage, 'utf8');

console.log('Generated ' + slugs.length + ' article pages.');
console.log('Sitemap entries: ' + sitemapUrls.length + ' (1 home + ' + slugs.length + ' articles).');
console.log('llms.txt: ' + meta.length + ' article links across ' + SECTIONS.length + ' sections.');
console.log('Most recent article: ' + latest);
