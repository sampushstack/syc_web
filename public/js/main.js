// ============================================
// THEME TOGGLE — persists to localStorage
// ============================================
const root         = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const savedTheme   = localStorage.getItem('theme');

if (savedTheme === 'light') root.classList.add('light');

themeToggle?.addEventListener('click', () => {
  const isLight = root.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ============================================
// CURSOR GLOW
// ============================================
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
}, { passive: true });

// ============================================
// NAV — scroll blur + mobile toggle
// ============================================
const nav      = document.getElementById('nav');
const burger   = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ============================================
// HERO — staggered word reveal
// ============================================
document.querySelectorAll('.hero__headline .word').forEach((word, i) => {
  setTimeout(() => word.classList.add('visible'), 250 + i * 160);
});

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
}, { threshold: 0.08 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
  revealObserver.observe(el);
});

// ============================================
// STATS — animated counter
// ============================================
function animateCounter(el, target, suffix, duration = 1600) {
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num[data-count]').forEach(el => {
  counterObserver.observe(el);
});
