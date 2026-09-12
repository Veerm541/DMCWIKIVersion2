(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const characterFocus = (name = '') => ({
    Dante: '8%', Vergil: '7%', V: '7%', Nero: '7%', Lady: '6%', Trish: '5%', Nico: '5%',
    Mundus: '44%', Urizen: '42%', Sparda: '8%'
  }[name] || '10%');

  window.DMC = { $, $$, escapeHTML, characterFocus };

  const root = document.documentElement;
  const savedTheme = localStorage.getItem('dmc-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  else root.dataset.theme = 'dark';

  const header = $('.site-header');
  const menuButton = $('#menuButton');
  const nav = $('#siteNav');
  const themeButton = $('#themeToggle');
  const backTop = $('#backTop');
  const progress = $('#scrollProgress');

  const syncThemeIcon = () => {
    if (!themeButton) return;
    const light = root.dataset.theme === 'light';
    themeButton.innerHTML = light ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    themeButton.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    themeButton.title = light ? 'Dark mode' : 'Light mode';
  };
  syncThemeIcon();

  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('dmc-theme', root.dataset.theme);
    syncThemeIcon();
  });

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });

  $$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (innerWidth > 980) closeMenu(); });

  // Smooth in-page navigation with fixed-header offset.
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = $(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 30);
    backTop?.classList.toggle('show', y > 700);
    const max = document.documentElement.scrollHeight - innerHeight;
    const percent = max > 0 ? Math.min(100, (y / max) * 100) : 0;
    progress?.style.setProperty('--scroll', `${percent}%`);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  backTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Scroll reveal system.
  const revealNodes = $$('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    revealNodes.forEach(node => observer.observe(node));
    window.DMC.observeReveal = (rootNode = document) => {
      $$('.reveal, .reveal-stagger', rootNode).forEach(node => {
        if (!node.classList.contains('is-visible')) observer.observe(node);
      });
    };
  } else {
    revealNodes.forEach(node => node.classList.add('is-visible'));
    window.DMC.observeReveal = () => {};
  }

  // Lightweight pointer-based card tilt and sheen.
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const wireTilt = (card) => {
    if (!finePointer || prefersReduced || card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';
    card.addEventListener('pointermove', event => {
      const r = card.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width;
      const y = (event.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      card.style.setProperty('--ry', `${(x - .5) * 2.4}deg`);
      card.style.setProperty('--rx', `${(.5 - y) * 2}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  };
  $$('.card').forEach(wireTilt);
  window.DMC.wireTilt = (rootNode = document) => $$('.card', rootNode).forEach(wireTilt);

  // Accessible lightbox. Add data-lightbox to any image or clickable wrapper.
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  const closeLightbox = $('#lightboxClose');
  let lastFocus = null;

  const openLightbox = (src, caption = '') => {
    if (!lightbox || !lightboxImage) return;
    lastFocus = document.activeElement;
    lightboxImage.src = src;
    lightboxImage.alt = caption || 'Expanded gallery image';
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    closeLightbox?.focus();
    document.body.style.overflow = 'hidden';
  };
  const hideLightbox = () => {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImage) lightboxImage.src = '';
    lastFocus?.focus?.();
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-lightbox]');
    if (!trigger) return;
    event.preventDefault();
    const image = trigger.matches('img') ? trigger : $('img', trigger);
    const src = trigger.dataset.lightbox || image?.src;
    const caption = trigger.dataset.caption || image?.alt || '';
    if (src) openLightbox(src, caption);
  });
  closeLightbox?.addEventListener('click', hideLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) hideLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { hideLightbox(); closeMenu(); } });

  // Footer newsletter is a front-end demo; validates and remembers the address locally.
  $$('.newsletter-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const email = $('input[type="email"]', form);
      const status = $('.newsletter-status', form.parentElement);
      const valid = email?.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!valid) {
        if (status) { status.textContent = 'Enter a valid email first.'; status.style.color = 'var(--danger)'; }
        email?.focus();
        return;
      }
      localStorage.setItem('dmc-newsletter-email', email.value.trim());
      if (status) { status.textContent = 'Subscribed — welcome to the Devil May Cry archive.'; status.style.color = 'var(--success)'; }
      form.reset();
    });
  });

  // Custom cursor on devices with a fine pointer only.
  if (finePointer && !prefersReduced) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    if (dot && ring) {
      let mx = -100, my = -100, rx = -100, ry = -100;
      document.body.classList.add('cursor-ready');
      addEventListener('pointermove', event => { mx = event.clientX; my = event.clientY; }, { passive: true });
      const loop = () => {
        rx += (mx - rx) * .16;
        ry += (my - ry) * .16;
        dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
        ring.style.transform = `translate(${rx - 15}px, ${ry - 15}px)`;
        requestAnimationFrame(loop);
      };
      loop();
      document.addEventListener('pointerover', event => {
        ring.classList.toggle('is-hover', Boolean(event.target.closest('a,button,input,select,textarea,[data-lightbox]')));
      });
    }
  }

  // Update copyright year automatically.
  $$('[data-current-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
