(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Scroll Reveal ───────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.scroll-reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* ─── Parallax ────────────────────────────────────── */
  function initParallax() {
    if (prefersReducedMotion) return;

    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    let ticking = false;

    function update() {
      const vh = window.innerHeight;
      for (const el of els) {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.speed) || 0.12;
        const offset = ((rect.top + rect.height / 2) - vh / 2) * -speed;
        el.style.transform = `translate3d(0,${offset.toFixed(1)}px,0)`;
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ─── Navbar scroll state ─────────────────────────── */
  function initNavbar() {
    const bar = document.querySelector('.topbar');
    if (!bar) return;

    function check() {
      bar.classList.toggle('scrolled', window.scrollY > 80);
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ─── Gallery tilt ────────────────────────────────── */
  function initGalleryTilt() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.gallery-media').forEach(media => {
      media.addEventListener('mousemove', (e) => {
        const r = media.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        media.style.transform =
          `perspective(800px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 3}deg)`;
      });

      media.addEventListener('mouseleave', () => {
        media.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ─── Dust particles ──────────────────────────────── */
  function initDust() {
    if (prefersReducedMotion) return;

    const canvas = document.querySelector('.dust-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let running = true;
    let raf = null;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.12 + 0.02),
      o: Math.random() * 0.3 + 0.05,
      od: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.002 + 0.0008),
    }));

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.o += p.od;
        if (p.o < 0.03 || p.o > 0.38) p.od *= -1;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,175,110,${p.o})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    const obs = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) draw();
      else if (raf) { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: 0 });
    obs.observe(hero);

    draw();
  }

  /* ─── Smooth scroll ───────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* ─── Init ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initParallax();
    initNavbar();
    initGalleryTilt();
    initDust();
    initSmoothScroll();
  });
})();
