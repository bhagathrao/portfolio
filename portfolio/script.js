/* ========================================================
   script.js  –  Bhagath Rao Portfolio
   ======================================================== */

'use strict';

/* ── 1. NAVBAR: scroll shrink + active link ─────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const toggle    = document.getElementById('navToggle');
  const linksMenu = document.getElementById('navLinks');

  // Scroll-based sticky effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveLink();
  };

  // Highlight nav link for visible section
  function highlightActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      const target = link.dataset.nav;
      link.classList.toggle('active', target === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger toggle
  toggle.addEventListener('click', () => {
    const isOpen = linksMenu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      linksMenu.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
})();


/* ── 2. SCROLL-REVEAL ANIMATIONS ────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-animate]');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();


/* ── 3. HERO ENTRANCE (staggered on load) ───────────────── */
(function initHeroEntrance() {
  const animated = document.querySelectorAll('.hero [data-animate]');

  animated.forEach(el => {
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('is-visible'), 200 + delay);
  });
})();


/* ── 4. 3D TILT on project cards (mouse-tracked) ────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });

  function handleTilt(e) {
    const card   = e.currentTarget;
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);   // -1 → 1
    const dy     = (e.clientY - cy) / (rect.height / 2);   // -1 → 1

    const rotX   =  dy * -5;   // degrees
    const rotY   =  dx *  6;
    const transY = -8;

    card.style.transform =
      `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${transY}px) scale(1.015)`;
    card.style.transition = 'transform 0.08s linear';

    // Move the glow highlight toward cursor
    const glow = card.querySelector('.card-glow');
    if (glow) {
      const glowX = ((e.clientX - rect.left) / rect.width)  * 100;
      const glowY = ((e.clientY - rect.top)  / rect.height) * 100;
      glow.style.background =
        `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0,255,136,0.08) 0%, transparent 55%)`;
    }
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform  = '';

    const glow = card.querySelector('.card-glow');
    if (glow) glow.style.background = '';
  }
})();


/* ── 5. SMOOTH CURSOR GLOW (subtle ambient effect) ─────── */
(function initCursorGlow() {
  const heroGlow = document.querySelector('.hero-glow');
  if (!heroGlow) return;

  let raf = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!raf) raf = requestAnimationFrame(animateGlow);
  });

  function animateGlow() {
    const ease = 0.06;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    heroGlow.style.left = currentX + 'px';
    heroGlow.style.top  = currentY + 'px';
    heroGlow.style.transform = 'translate(-50%, -50%)';

    raf = requestAnimationFrame(animateGlow);
  }
})();


/* ── 6. TYPED TAGLINE EFFECT ─────────────────────────────── */
(function initTypedEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const phrases = [
    'I build <span class="accent">scalable</span>, real-world backend systems.',
    'I craft <span class="accent">REST APIs</span> that power real products.',
    'I turn complex problems into <span class="accent">clean code</span>.',
  ];

  let phraseIndex = 0;
  let isFirstRun  = true;

  function cyclePhrases() {
    if (isFirstRun) { isFirstRun = false; scheduleNext(); return; }

    phraseIndex = (phraseIndex + 1) % phrases.length;

    // Fade out
    tagline.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    tagline.style.opacity    = '0';
    tagline.style.transform  = 'translateY(-8px)';

    setTimeout(() => {
      tagline.innerHTML = phrases[phraseIndex];
      tagline.style.transform = 'translateY(8px)';

      requestAnimationFrame(() => {
        tagline.style.opacity   = '1';
        tagline.style.transform = 'translateY(0)';
      });

      scheduleNext();
    }, 450);
  }

  function scheduleNext() {
    setTimeout(cyclePhrases, 3800);
  }

  scheduleNext();
})();


/* ── 7. ACTIVE SECTION HIGHLIGHT in Navbar ───────────────── */
// Already handled inside initNavbar()


/* ── 8. RIPPLE on primary buttons ───────────────────────── */
(function initRipple() {
  const targets = document.querySelectorAll('.btn-primary, .card-btn-primary, .contact-btn--email');

  targets.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position:absolute;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY  - rect.top  - size/2}px;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:rgba(0,0,0,0.25);
        transform:scale(0);
        animation:rippleAnim 0.55s ease-out forwards;
        pointer-events:none;
      `;

      // Ensure button has position:relative
      const pos = window.getComputedStyle(this).position;
      if (pos === 'static') this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject keyframes once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ── 9. SCROLL PROGRESS BAR ──────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2px; z-index:9999;
    background: linear-gradient(90deg, #00ff88, #00ccaa);
    width:0%; transition:width 0.1s linear;
    box-shadow: 0 0 8px rgba(0,255,136,0.6);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = progress + '%';
  }, { passive: true });
})();
