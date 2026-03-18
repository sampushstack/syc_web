# SYC Consultant Website — Design Spec
**Date:** 2026-03-18
**Project:** syc_web
**Firebase Project:** sycweb-5d4cd

---

## Overview

A fresh reimagining of sycconsultant.co.nz — a single-page static website for SYC Consultant, a design-to-product consultancy. The new site keeps the existing copy and brand message but delivers a high-impact Dark & Premium aesthetic with electric blue accents and smooth scroll animations. Deployed to Firebase Hosting under project `sycweb-5d4cd`.

---

## Goals

- Establish SYC Consultant as a premium digital consultancy
- Convert visitors into enquiries via a clear CTA
- Load fast, work on all devices, require zero maintenance
- Deploy effortlessly to Firebase Hosting

---

## Technical Stack

- **Pure static:** HTML, CSS, vanilla JS — no build tools, no npm, no frameworks
- **Hosting:** Firebase Hosting, project `sycweb-5d4cd`
- **Directory:** `syc_web/public/` → served as Firebase public root
- **Deploy:** `firebase deploy --only hosting` (user confirms before running)
- **Fonts:** Inter via Google Fonts CDN

---

## File Structure

```
syc_web/
├── firebase.json
├── .firebaserc
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

---

## Page Sections

### 1. Navigation
- Sticky top bar, transparent on load
- Gains `backdrop-filter: blur(12px)` + subtle border on scroll
- Left: SYC logo/wordmark in white
- Right: anchor links — Services, About, Contact
- Mobile: hamburger menu (CSS-only toggle or minimal JS)

### 2. Hero
- Full viewport height (`100dvh`)
- Animated headline: *"Transformation, from Idea to Result."* — words fade up sequentially on load
- Subheadline: *"We partner with ambitious organisations to build digital products that combine strategic thinking with flawless execution."*
- CTA button: *"Get in touch"* → smooth scrolls to Contact section
- Background: animated CSS dot-grid pattern with slow drift (pure CSS `@keyframes`, no canvas)

### 3. Services
- Section heading: *"What we do"*
- 6 cards in a responsive 3×2 grid (collapses to 1 col on mobile)
- Each card: numbered (01–06), title, short description
- Card style: `#111118` background, `#1e1e2e` border, blue left-border accent on hover + subtle glow
- Services:
  1. UI/UX Design — Intuitive, beautiful interfaces built on user research and iteration
  2. Product Development — Scalable applications from prototype to production
  3. Product Strategy — Guidance from concept to market entry
  4. System Integration — Connecting platforms and tools seamlessly
  5. AI & Automation — Intelligent systems and process automation
  6. Digital Transformation — Modernising operations and enhancing customer experiences

### 4. Stats Band
- Full-width dark strip (`#111118`)
- Three stats centered horizontally:
  - **100%** Client Satisfaction
  - **30+** Projects Completed
  - **20+** Years Combined Experience
- Large number in electric blue, label in secondary text color

### 5. About
- Two-column layout on desktop, stacked on mobile
- Left: bold statement — *"We're a design-to-product consultancy built on accountability and measurable outcomes."*
- Right: supporting copy — *"We combine strategic thinking with deep technical expertise to deliver outcomes that matter. Every engagement is built on transparency, clear communication, and a relentless focus on results."* (placeholder — confirm or revise with client)

### 6. Clients
- Section heading: *"Trusted by"*
- Horizontal strip of client names styled as subtle pill/badge elements
- Clients: Swimming NZ · 2degrees · Pushstack

### 7. Contact
- Centered layout
- Heading: *"Let's build something together"*
- Email link: sycconsultant@gmail.com
- LinkedIn CTA button (URL: https://www.linkedin.com/in/iijanchan/)
- Simple, no form — direct email contact

### 8. Footer
- Single line: © 2026 SYC Consultant. All rights reserved.
- Same dark background, secondary text color

---

## Visual Design

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0a0a0f` | Page background |
| `--surface` | `#111118` | Cards, nav, stats band |
| `--border` | `#1e1e2e` | Card borders, dividers |
| `--accent` | `#3b82f6` | Primary blue accent |
| `--accent-light` | `#60a5fa` | Hover states, glows |
| `--text-primary` | `#f1f5f9` | Headlines, body |
| `--text-secondary` | `#94a3b8` | Labels, captions |

### Typography
- Font family: `Inter` (Google Fonts)
- Hero headline: 600–800 weight, large (clamp 2.5rem → 5rem)
- Section headings: 700 weight
- Body: 400 weight, 1.6 line-height

### Motion
- **Hero headline:** words fade up with staggered delay on page load (CSS animation)
- **Scroll sections:** `IntersectionObserver` triggers `fade-up` class → opacity 0→1, translateY 20px→0
- **Nav:** `scroll` event adds `.scrolled` class → backdrop blur transitions in
- **Service cards:** `box-shadow` glow on `:hover` using `--accent` color
- All animations respect `prefers-reduced-motion`

---

## Firebase Configuration

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**/*.@(css|js|svg)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      },
      {
        "source": "**/*.html",
        "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
      }
    ]
  }
}
```

`.firebaserc`:
```json
{
  "projects": {
    "default": "sycweb-5d4cd"
  }
}
```

---

## Constraints & Non-Goals

- No CMS, no backend, no contact form (direct email link only)
- No npm or build pipeline
- No analytics (can be added later)
- Deploy only after explicit user confirmation
- Dark mode only (no light mode toggle needed in the new design)
