# SYC Consultant Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a dark-premium single-page static website for SYC Consultant to Firebase Hosting (project: sycweb-5d4cd).

**Architecture:** Pure static site — one HTML file, one CSS file, one JS file — served from `syc_web/public/`. No build tools, no npm, no frameworks. Firebase Hosting serves the files directly. Scroll animations via `IntersectionObserver`, nav blur via scroll event listener, hero animation via CSS `@keyframes`.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS (ES6+), Google Fonts (Inter), Firebase CLI for deployment.

---

## File Map

| File | Responsibility |
|---|---|
| `syc_web/firebase.json` | Firebase Hosting config — public dir, cache headers, rewrite rule |
| `syc_web/.firebaserc` | Firebase project alias → sycweb-5d4cd |
| `syc_web/public/index.html` | Full page markup — all 8 sections |
| `syc_web/public/css/style.css` | All styles — reset, tokens, layout, components, animations, responsive |
| `syc_web/public/js/main.js` | Nav scroll behaviour, IntersectionObserver fade-ins, hero word animation |

---

## Task 1: Firebase Config

**Files:**
- Create: `syc_web/firebase.json`
- Create: `syc_web/.firebaserc`

- [ ] **Step 1: Create `syc_web/firebase.json`**

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**/*.@(css|js|svg|woff2)",
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

- [ ] **Step 2: Create `syc_web/.firebaserc`**

```json
{
  "projects": {
    "default": "sycweb-5d4cd"
  }
}
```

- [ ] **Step 3: Create public directory structure**

```bash
mkdir -p syc_web/public/css syc_web/public/js
```

- [ ] **Step 4: Verify Firebase CLI can see the project**

```bash
cd syc_web && firebase projects:list
```
Expected: `sycweb-5d4cd` appears in the list. If not authenticated, run `firebase login` first.

- [ ] **Step 5: Commit**

```bash
git add syc_web/firebase.json syc_web/.firebaserc
git commit -m "feat: add Firebase config for sycweb-5d4cd"
```

---

## Task 2: CSS Foundation — Reset, Tokens, Typography

**Files:**
- Create: `syc_web/public/css/style.css`

- [ ] **Step 1: Write CSS reset + custom property tokens**

Create `syc_web/public/css/style.css`:

```css
/* ============================================
   RESET
   ============================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { cursor: pointer; border: none; background: none; font: inherit; }

/* ============================================
   DESIGN TOKENS
   ============================================ */
:root {
  --bg:             #0a0a0f;
  --surface:        #111118;
  --border:         #1e1e2e;
  --accent:         #3b82f6;
  --accent-light:   #60a5fa;
  --text-primary:   #f1f5f9;
  --text-secondary: #94a3b8;

  --radius: 12px;
  --transition: 0.25s ease;

  --max-width: 1200px;
  --section-pad: clamp(4rem, 8vw, 8rem);
}

/* ============================================
   TYPOGRAPHY SCALE
   ============================================ */
h1 { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.2; }
h3 { font-size: 1.125rem; font-weight: 600; }
p  { color: var(--text-secondary); font-size: 1.0625rem; line-height: 1.75; }

/* ============================================
   LAYOUT UTILITIES
   ============================================ */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 5vw, 2.5rem);
}

section {
  padding-block: var(--section-pad);
}
```

- [ ] **Step 2: Open `syc_web/public/index.html` in browser to confirm blank dark page loads (no errors)**

Create a minimal `syc_web/public/index.html` to test:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SYC Consultant</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <p style="padding:2rem;color:white">CSS test</p>
  <script src="js/main.js" defer></script>
</body>
</html>
```

Open in browser: the page background should be `#0a0a0f` (near-black). Text should be white Inter font.

- [ ] **Step 3: Commit CSS foundation**

```bash
git add syc_web/public/css/style.css syc_web/public/index.html
git commit -m "feat: add CSS reset, tokens, typography"
```

---

## Task 3: Navigation Component

**Files:**
- Modify: `syc_web/public/css/style.css` (append nav styles)
- Modify: `syc_web/public/index.html` (add nav markup)
- Modify: `syc_web/public/js/main.js` (add scroll handler)

- [ ] **Step 1: Add nav markup to `index.html` inside `<body>`**

Replace body content with:

```html
<body>
  <!-- NAV -->
  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a href="#" class="nav__logo">SYC<span>.</span></a>
      <nav class="nav__links">
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <button class="nav__burger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main id="main-content">
    <!-- sections go here -->
  </main>

  <script src="js/main.js" defer></script>
</body>
```

- [ ] **Step 2: Append nav styles to `style.css`**

```css
/* ============================================
   NAV
   ============================================ */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background var(--transition), border-color var(--transition), backdrop-filter var(--transition);
  border-bottom: 1px solid transparent;
}

.nav.scrolled {
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom-color: var(--border);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
}

.nav__logo {
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.nav__logo span {
  color: var(--accent);
}

.nav__links {
  display: flex;
  gap: 2.5rem;
}

.nav__links a {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition);
}

.nav__links a:hover {
  color: var(--text-primary);
}

/* Burger — hidden on desktop */
.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}

.nav__burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: transform var(--transition), opacity var(--transition);
}

/* Mobile nav */
@media (max-width: 640px) {
  .nav__links {
    display: none;
    position: fixed;
    inset: 4.5rem 0 0;
    background: var(--bg);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    font-size: 1.25rem;
  }

  .nav__links.open {
    display: flex;
  }

  .nav__burger {
    display: flex;
  }
}
```

- [ ] **Step 3: Create `syc_web/public/js/main.js`**

```js
// ============================================
// NAV — scroll blur + mobile toggle
// ============================================
const nav = document.getElementById('nav');
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  });
});
```

- [ ] **Step 4: Verify in browser — scroll down, nav gains blur; on mobile, burger opens menu**

- [ ] **Step 5: Commit**

```bash
git add syc_web/public/index.html syc_web/public/css/style.css syc_web/public/js/main.js
git commit -m "feat: add sticky nav with scroll blur and mobile toggle"
```

---

## Task 4: Hero Section

**Files:**
- Modify: `syc_web/public/index.html` (add hero markup inside `<main>`)
- Modify: `syc_web/public/css/style.css` (append hero styles)
- Modify: `syc_web/public/js/main.js` (append hero word animation)

- [ ] **Step 1: Add hero markup inside `<main id="main-content">`**

```html
<!-- HERO -->
<section class="hero" id="home">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="container hero__content">
    <h1 class="hero__headline">
      <span class="word">Transformation,</span>
      <span class="word">from</span>
      <span class="word">Idea</span>
      <span class="word">to</span>
      <span class="word">Result.</span>
    </h1>
    <p class="hero__sub">
      We partner with ambitious organisations to build digital products that
      combine strategic thinking with flawless execution.
    </p>
    <a href="#contact" class="btn btn--primary">Get in touch</a>
  </div>
</section>
```

- [ ] **Step 2: Append hero + button styles to `style.css`**

```css
/* ============================================
   HERO
   ============================================ */
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* Animated dot-grid background */
.hero__bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(59,130,246,0.15) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: drift 20s linear infinite;
  opacity: 0.6;
}

@keyframes drift {
  0%   { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}

.hero__content {
  position: relative;
  z-index: 1;
  padding-top: 6rem; /* clear fixed nav */
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 860px;
}

.hero__headline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
}

/* Each word starts hidden; JS adds .visible with staggered delay */
.hero__headline .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.hero__headline .word.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__sub {
  font-size: clamp(1rem, 2vw, 1.25rem);
  max-width: 600px;
  color: var(--text-secondary);
}

/* ============================================
   BUTTONS
   ============================================ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-radius: var(--radius);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
  width: fit-content;
}

.btn--primary {
  background: var(--accent);
  color: #fff;
}

.btn--primary:hover {
  background: var(--accent-light);
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.btn--outline {
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.btn--outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}
```

- [ ] **Step 3: Append hero word animation to `main.js`**

```js
// ============================================
// HERO — staggered word reveal
// ============================================
const words = document.querySelectorAll('.hero__headline .word');
words.forEach((word, i) => {
  setTimeout(() => word.classList.add('visible'), 100 + i * 120);
});
```

- [ ] **Step 4: Verify in browser — words animate in on load, dot grid drifts, CTA button glows on hover**

- [ ] **Step 5: Commit**

```bash
git add syc_web/public/index.html syc_web/public/css/style.css syc_web/public/js/main.js
git commit -m "feat: add hero section with animated headline and dot-grid background"
```

---

## Task 5: Scroll Reveal Animation (shared utility)

**Files:**
- Modify: `syc_web/public/css/style.css` (append reveal animation)
- Modify: `syc_web/public/js/main.js` (append IntersectionObserver)

- [ ] **Step 1: Append scroll-reveal styles to `style.css`**

```css
/* ============================================
   SCROLL REVEAL
   ============================================ */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children inside a reveal parent */
.reveal-stagger > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal-stagger.revealed > *:nth-child(1) { transition-delay: 0.05s; opacity: 1; transform: none; }
.reveal-stagger.revealed > *:nth-child(2) { transition-delay: 0.1s;  opacity: 1; transform: none; }
.reveal-stagger.revealed > *:nth-child(3) { transition-delay: 0.15s; opacity: 1; transform: none; }
.reveal-stagger.revealed > *:nth-child(4) { transition-delay: 0.2s;  opacity: 1; transform: none; }
.reveal-stagger.revealed > *:nth-child(5) { transition-delay: 0.25s; opacity: 1; transform: none; }
.reveal-stagger.revealed > *:nth-child(6) { transition-delay: 0.3s;  opacity: 1; transform: none; }

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-stagger > * {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 2: Append IntersectionObserver to `main.js`**

```js
// ============================================
// SCROLL REVEAL — IntersectionObserver
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
  revealObserver.observe(el);
});
```

- [ ] **Step 3: Commit**

```bash
git add syc_web/public/css/style.css syc_web/public/js/main.js
git commit -m "feat: add scroll reveal IntersectionObserver utility"
```

---

## Task 6: Services Section

**Files:**
- Modify: `syc_web/public/index.html` (add services markup after hero)
- Modify: `syc_web/public/css/style.css` (append services styles)

- [ ] **Step 1: Add services markup after `</section>` (hero) in `index.html`**

```html
<!-- SERVICES -->
<section class="services" id="services">
  <div class="container">
    <div class="section-header reveal">
      <span class="label">What we do</span>
      <h2>Services built for ambitious teams</h2>
    </div>
    <div class="services__grid reveal-stagger">
      <div class="service-card">
        <span class="service-card__num">01</span>
        <h3>UI/UX Design</h3>
        <p>Intuitive, beautiful interfaces built on user research and iteration.</p>
      </div>
      <div class="service-card">
        <span class="service-card__num">02</span>
        <h3>Product Development</h3>
        <p>Scalable applications from prototype to production.</p>
      </div>
      <div class="service-card">
        <span class="service-card__num">03</span>
        <h3>Product Strategy</h3>
        <p>Guidance from concept to market entry.</p>
      </div>
      <div class="service-card">
        <span class="service-card__num">04</span>
        <h3>System Integration</h3>
        <p>Connecting platforms and tools seamlessly.</p>
      </div>
      <div class="service-card">
        <span class="service-card__num">05</span>
        <h3>AI &amp; Automation</h3>
        <p>Intelligent systems and process automation.</p>
      </div>
      <div class="service-card">
        <span class="service-card__num">06</span>
        <h3>Digital Transformation</h3>
        <p>Modernising operations and enhancing customer experiences.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append services styles to `style.css`**

```css
/* ============================================
   SECTION HEADER
   ============================================ */
.section-header {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

/* ============================================
   SERVICES
   ============================================ */
.services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.service-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: border-color var(--transition), box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent);
  opacity: 0;
  transition: opacity var(--transition);
}

.service-card:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 32px rgba(59, 130, 246, 0.08);
}

.service-card:hover::before {
  opacity: 1;
}

.service-card__num {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 900px) {
  .services__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .services__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify in browser — 3×2 grid appears, cards have hover glow + left blue border reveal**

- [ ] **Step 4: Commit**

```bash
git add syc_web/public/index.html syc_web/public/css/style.css
git commit -m "feat: add services section with 6-card grid"
```

---

## Task 7: Stats Band

**Files:**
- Modify: `syc_web/public/index.html` (add stats markup after services)
- Modify: `syc_web/public/css/style.css` (append stats styles)

- [ ] **Step 1: Add stats markup after services section**

```html
<!-- STATS -->
<div class="stats" aria-label="Key statistics">
  <div class="container stats__inner reveal-stagger">
    <div class="stat">
      <span class="stat__num">100%</span>
      <span class="stat__label">Client Satisfaction</span>
    </div>
    <div class="stat">
      <span class="stat__num">30+</span>
      <span class="stat__label">Projects Completed</span>
    </div>
    <div class="stat">
      <span class="stat__num">20+</span>
      <span class="stat__label">Years Combined Experience</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Append stats styles to `style.css`**

```css
/* ============================================
   STATS BAND
   ============================================ */
.stats {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding-block: clamp(3rem, 5vw, 5rem);
}

.stats__inner {
  display: flex;
  justify-content: center;
  gap: clamp(3rem, 8vw, 8rem);
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.stat__num {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.02em;
  line-height: 1;
}

.stat__label {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  font-weight: 500;
}
```

- [ ] **Step 3: Verify stats band appears full-width between services and next section**

- [ ] **Step 4: Commit**

```bash
git add syc_web/public/index.html syc_web/public/css/style.css
git commit -m "feat: add stats band with key metrics"
```

---

## Task 8: About Section

**Files:**
- Modify: `syc_web/public/index.html` (add about markup after stats)
- Modify: `syc_web/public/css/style.css` (append about styles)

- [ ] **Step 1: Add about markup after stats band**

```html
<!-- ABOUT -->
<section class="about" id="about">
  <div class="container about__inner">
    <div class="about__left reveal">
      <span class="label">About us</span>
      <h2>A design-to-product consultancy built on accountability and measurable outcomes.</h2>
    </div>
    <div class="about__right reveal">
      <p>We combine strategic thinking with deep technical expertise to deliver outcomes that matter. Every engagement is built on transparency, clear communication, and a relentless focus on results.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append about styles to `style.css`**

```css
/* ============================================
   ABOUT
   ============================================ */
.about__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(3rem, 6vw, 6rem);
  align-items: center;
}

.about__left h2 {
  margin-top: 0.75rem;
  color: var(--text-primary);
}

.about__right p {
  font-size: 1.0625rem;
  line-height: 1.8;
}

@media (max-width: 720px) {
  .about__inner { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Commit**

```bash
git add syc_web/public/index.html syc_web/public/css/style.css
git commit -m "feat: add about section with two-column layout"
```

---

## Task 9: Clients Section

**Files:**
- Modify: `syc_web/public/index.html` (add clients markup after about)
- Modify: `syc_web/public/css/style.css` (append clients styles)

- [ ] **Step 1: Add clients markup after about section**

```html
<!-- CLIENTS -->
<section class="clients">
  <div class="container">
    <div class="section-header reveal" style="text-align:center">
      <span class="label">Trusted by</span>
    </div>
    <div class="clients__strip reveal-stagger">
      <span class="client-badge">Swimming NZ</span>
      <span class="client-badge">2degrees</span>
      <span class="client-badge">Pushstack</span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append clients styles to `style.css`**

```css
/* ============================================
   CLIENTS
   ============================================ */
.clients__strip {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.client-badge {
  padding: 0.625rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface);
  transition: border-color var(--transition), color var(--transition);
}

.client-badge:hover {
  border-color: var(--accent);
  color: var(--text-primary);
}
```

- [ ] **Step 3: Commit**

```bash
git add syc_web/public/index.html syc_web/public/css/style.css
git commit -m "feat: add clients section with pill badges"
```

---

## Task 10: Contact Section + Footer

**Files:**
- Modify: `syc_web/public/index.html` (add contact + footer markup)
- Modify: `syc_web/public/css/style.css` (append contact + footer styles)

- [ ] **Step 1: Add contact section + footer markup after clients section, before closing `</main>`**

```html
<!-- CONTACT -->
<section class="contact" id="contact">
  <div class="container contact__inner reveal">
    <span class="label">Get in touch</span>
    <h2>Let's build something together</h2>
    <p>Have a project in mind? We'd love to hear about it.</p>
    <div class="contact__actions">
      <a href="mailto:sycconsultant@gmail.com" class="btn btn--primary">sycconsultant@gmail.com</a>
      <a href="https://www.linkedin.com/in/iijanchan/" target="_blank" rel="noopener noreferrer" class="btn btn--outline">LinkedIn</a>
    </div>
  </div>
</section>
```

Close `</main>` then add:

```html
<!-- FOOTER -->
<footer class="footer">
  <div class="container footer__inner">
    <span>© 2026 SYC Consultant. All rights reserved.</span>
  </div>
</footer>
```

- [ ] **Step 2: Append contact + footer styles to `style.css`**

```css
/* ============================================
   CONTACT
   ============================================ */
.contact {
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.contact__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.contact__inner h2 {
  margin-top: 0.5rem;
}

.contact__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

/* ============================================
   FOOTER
   ============================================ */
.footer {
  background: var(--bg);
  border-top: 1px solid var(--border);
  padding-block: 2rem;
}

.footer__inner {
  display: flex;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}
```

- [ ] **Step 3: Verify full page in browser — scroll through all sections, check all links work**

- [ ] **Step 4: Commit**

```bash
git add syc_web/public/index.html syc_web/public/css/style.css
git commit -m "feat: add contact section and footer"
```

---

## Task 11: Meta, Favicon, Polish

**Files:**
- Modify: `syc_web/public/index.html` (complete `<head>`)
- Modify: `syc_web/public/css/style.css` (any final polish)

- [ ] **Step 1: Update `<head>` in `index.html` with full meta tags**

Replace the existing `<head>` with:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="SYC Consultant — a design-to-product consultancy combining strategic thinking with flawless execution.">
  <meta property="og:title" content="SYC Consultant">
  <meta property="og:description" content="Transformation, from Idea to Result.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://sycconsultant.co.nz">
  <title>SYC Consultant — Transformation, from Idea to Result</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
```

- [ ] **Step 2: Check page on mobile viewport (375px) — all sections should be readable and usable**

Use browser DevTools device emulation. Specifically check:
- Nav burger opens/closes
- Hero text is not clipped
- Service cards stack to single column
- Contact buttons stack vertically if needed

- [ ] **Step 3: Check `prefers-reduced-motion` — disable animations in OS accessibility settings and verify page is still fully readable**

- [ ] **Step 4: Commit**

```bash
git add syc_web/public/index.html
git commit -m "feat: add SEO meta tags and complete page head"
```

---

## Task 12: Deploy to Firebase (CONFIRM WITH USER FIRST)

**Files:**
- None changed — this is a deployment step only

- [ ] **Step 1: Confirm with user before running any deploy command**

Ask: *"Ready to deploy to Firebase project sycweb-5d4cd? I'll run `firebase deploy --only hosting` from the `syc_web/` directory."*

Do NOT proceed until the user explicitly confirms.

- [ ] **Step 2: Run deploy (only after user confirms)**

```bash
cd /Users/sam.chan/Documents/codex/syc_web && firebase deploy --only hosting
```

Expected output includes:
```
✔  Deploy complete!
Hosting URL: https://sycweb-5d4cd.web.app
```

- [ ] **Step 3: Open the live URL and verify the page loads correctly**

- [ ] **Step 4: Share the live URL with the user**
