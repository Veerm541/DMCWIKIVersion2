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

  /* =========================================================
   MOBILE MENU
   ========================================================= */

/* Create the dark background automatically.
   This means you DON'T need to add it to every HTML page. */
const navBackdrop = document.createElement('button');

navBackdrop.type = 'button';
navBackdrop.className = 'mobile-nav-backdrop';
navBackdrop.setAttribute('aria-label', 'Close navigation menu');

document.body.appendChild(navBackdrop);


const setMenuState = (open) => {

    if (!nav || !menuButton) return;

    nav.classList.toggle('open', open);

    menuButton.setAttribute(
        'aria-expanded',
        String(open)
    );

    menuButton.setAttribute(
        'aria-label',
        open ? 'Close menu' : 'Open menu'
    );

    document.body.classList.toggle(
        'menu-open',
        open
    );
};


const closeMenu = () => {
    setMenuState(false);
};


const openMenu = () => {
    setMenuState(true);
};


menuButton?.addEventListener('click', () => {

    const isOpen = nav?.classList.contains('open');

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }

});


/* Clicking dark background closes menu */
navBackdrop.addEventListener('click', closeMenu);


/* Clicking a navigation link closes the drawer */
$$('.nav-link').forEach(link => {

    link.addEventListener('click', () => {
        closeMenu();
    });

});


/* ESC closes it */
document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {
        closeMenu();
    }

});


/* If screen becomes desktop-sized, reset mobile state */
window.addEventListener('resize', () => {

    if (window.innerWidth > 980) {
        closeMenu();
    }

});

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

 /* =========================================================
   DEVIL HUNTER DISPATCH NEWSLETTER
   ========================================================= */

const NEWSLETTER_ENDPOINT =
  'https://formspree.io/f/xeaognor';


document
  .querySelectorAll('.newsletter-form')
  .forEach(form => {

    const emailInput =
      form.querySelector(
        'input[type="email"]'
      );

    const button =
      form.querySelector(
        'button[type="submit"]'
      );

    const status =
      form.parentElement.querySelector(
        '.newsletter-status'
      );


    if (
      !emailInput ||
      !button ||
      !status
    ) {
      return;
    }


    form.addEventListener(
      'submit',
      async event => {

        event.preventDefault();


        const email =
          emailInput.value.trim();


        /* -----------------------------------------
           Validate email
           ----------------------------------------- */

        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

          status.textContent =
            'Enter a valid email address.';

          status.style.color =
            'var(--danger)';

          emailInput.focus();

          return;
        }


        /* -----------------------------------------
           Loading state
           ----------------------------------------- */

        button.disabled = true;


        const originalButtonHTML =
          button.innerHTML;


        button.innerHTML = `
          <i class="fa-solid fa-spinner fa-spin"></i>
        `;


        status.textContent =
          'Joining the dispatch...';


        status.style.color =
          'var(--muted)';


        try {

          const formData =
            new FormData(form);


          const response =
            await fetch(
              NEWSLETTER_ENDPOINT,
              {
                method: 'POST',

                body: formData,

                headers: {
                  Accept:
                    'application/json'
                }
              }
            );


          const result =
            await response
              .json()
              .catch(() => null);


          if (!response.ok) {

            let message =
              'Unable to subscribe. Please try again.';


            if (
              result &&
              Array.isArray(result.errors) &&
              result.errors.length
            ) {

              message =
                result.errors
                  .map(error =>
                    error.message
                  )
                  .join(' ');

            }


            throw new Error(
              message
            );

          }


          /* -----------------------------------------
             Success
             ----------------------------------------- */

          status.textContent =
            'Welcome to the Devil Hunter Dispatch!';


          status.style.color =
            'var(--success)';


          form.reset();


        } catch (error) {

          console.error(
            'Newsletter error:',
            error
          );


          status.textContent =
            error.message ||
            'Something went wrong. Please try again.';


          status.style.color =
            'var(--danger)';


        } finally {

          button.disabled = false;

          button.innerHTML =
            originalButtonHTML;

        }

      }
    );

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
