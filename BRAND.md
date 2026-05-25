# Kiara Capital — Brand Reference

Quick reference for colors, fonts, and design tokens used in the blog. Source: Kiara Brand Style Guide 2023.

---

## Colors

### Primary
| Name | Hex | Use |
|---|---|---|
| Kiara Purple | `#7664FA` | Buttons, links, tags, accents, active states |
| Kiara Cyan | `#49FADE` | Secondary accents, badges, hover highlights |

### Purple Scale
| Token | Hex |
|---|---|
| purple-100 | `#DEA6FF` |
| purple-200 | `#D080FF` |
| purple-300 | `#C259FF` |
| purple-400 | `#B433FF` |
| purple-500 | `#9700FF` |
| purple-700 | `#6A00B2` |
| purple-900 | `#2E004C` |

### Blue Scale
| Token | Hex |
|---|---|
| blue-100 | `#6B8BFF` |
| blue-300 | `#073CFF` |
| blue-500 | `#012199` |
| blue-700 | `#011667` |
| blue-900 | `#000B33` |

### Grays
| Token | Hex |
|---|---|
| gray-100 | `#F1F1F1` |
| gray-200 | `#E6E6E6` |
| gray-300 | `#CCCCCC` |
| gray-400 | `#A6A6A6` |
| gray-500 | `#808080` |
| gray-700 | `#404040` |

---

## Typography

### Primary Font — Sora
Use for: headlines, titles, UI labels, buttons, navigation, the logo.

```css
font-family: 'Sora', sans-serif;
```

Weights used: 400 (Regular) · 600 (SemiBold) · 700 (Bold) · 800 (ExtraBold)

Google Fonts: https://fonts.google.com/specimen/Sora

> Developed by Soramitsu, a Japanese blockchain tech company. Designed for digital interfaces — low-resolution aesthetic without being nostalgic.

### Secondary Font — Raleway
Use for: body text, excerpts, descriptions, navigation links.

```css
font-family: 'Raleway', sans-serif;
```

Weights used: 400 (Regular) · 500 (Medium) · 600 (SemiBold) · 700 (Bold)

Google Fonts: https://fonts.google.com/specimen/Raleway

> Geometric, clean, modern. No serifs. Open license, pre-installed on most operating systems.

---

## Icons

**Remix Icon** — open-source icon system.

```html
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
```

Library: https://remixicon.com/  
Style: Outline + Filled, 24×24 grid. 2,500+ icons.

---

## Logo

The Kiara wordmark is the primary logo. Use always from original vector files.

**Rules:**
- Do not distort, rotate, or shadow the logo
- Minimum digital size: 12px height
- Use white version on dark backgrounds
- Use purple/full-color version on light backgrounds
- Maintain a clear zone equal to the size of the central circle element

In the blog, the logo is represented by the `K` icon mark + "Kiara Capital" wordmark in Sora Bold.

---

## Background Types

Per the style guide, Kiara pieces can use:

| Background | When to use |
|---|---|
| White `#FFFFFF` | Cards, content areas, light sections |
| Light gray `#F1F1F1` | Page background, subtle separators |
| Purple `#7664FA` | CTAs, highlights, accent sections |
| Deep navy `#000B33` | Hero, footer, dark feature sections |
| Illustrative | Photography/imagery as full bleed |

---

## CSS Variables (as used in index.html)

```css
:root {
  --kiara-purple:  #7664FA;
  --kiara-blue:    #49FADE;
  --blue-900:      #000B33;
  --gray-50:       #F8F8FC;
  --white:         #FFFFFF;
  --radius-sm:     8px;
  --radius-md:     14px;
  --radius-lg:     20px;
  --shadow-sm:     0 4px 16px rgba(118,100,250,.10);
  --shadow-md:     0 8px 32px rgba(118,100,250,.15);
  --shadow-lg:     0 20px 60px rgba(118,100,250,.20);
}
```

---

*Source: Kiara Brand Style Guide 2023.*
