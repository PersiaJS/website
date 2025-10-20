document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const menuButton = document.getElementById('menu-button');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  console.log('[menu.js] initializing');

  // defensive fallback selectors in case the expected ids/classes change
  let button = menuButton;
  let navEl = nav;
  if (!button) {
    button = document.querySelector('.hamburger') || document.querySelector('#menu-button');
    console.warn('[menu.js] menu-button not found by id; tried fallbacks', !!button);
  }
  if (!navEl) {
    navEl = document.querySelector('nav') || document.querySelector('.nav');
    console.warn('[menu.js] nav element not found by .nav; tried fallbacks', !!navEl);
  }

  // ensure we have elements before continuing
  if (!button || !navEl) {
    console.error('[menu.js] critical elements missing: menu button or nav — aborting menu setup');
    return;
  }

  // Icons are stored as strings and injected into the button to keep DOM small
  const ICON_MENU =
    '<svg class="icon-menu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" aria-hidden="true"><path d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"/></svg>';

  const ICON_CLOSE =
    '<svg class="icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" aria-hidden="true"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>';

  // normalized references we use from here on
  const btn = button;
  const navNode = navEl;

  if (!btn || !navNode) return;

  // Constants
  const SCROLL_THRESHOLD = 10; // px scrolled before header gets scrolled state

  // ensure the element behaves like a button even if attribute missing
  try { btn.type = btn.type || 'button'; } catch (e) { /* ignore for non-button elements */ }
  // initialize button icon (this will replace the fallback SVG if present)
  btn.innerHTML = ICON_MENU;

  // Open the mobile nav: set ARIA, swap icon and ensure header appears scrolled
  function openMenu() {
    navNode.classList.add('open');
    navNode.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    btn.classList.add('is-active');
    btn.innerHTML = ICON_CLOSE;
    if (header) header.classList.add('scrolled');
    // add body class so content is not hidden behind fixed header
    document.body.classList.add('nav-scrolled');
    console.log('[menu.js] menu opened');
  }

  // Close the mobile nav and reset ARIA/icon. Header scrolled state will only be
  // removed if the page is at the top.
  function closeMenu() {
    navNode.classList.remove('open');
    navNode.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    btn.classList.remove('is-active');
    btn.innerHTML = ICON_MENU;
    document.body.classList.remove('nav-scrolled');
    if (header && window.pageYOffset < SCROLL_THRESHOLD) {
      header.classList.remove('scrolled');
    }
    console.log('[menu.js] menu closed');
  }

  // Toggle on click
  // Attach click handler (use normalized btn/navNode)
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (navNode.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when resizing to desktop breakpoint
  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) {
      closeMenu();
    }
  });

  // Efficient scroll handler using rAF to limit work on each frame
  let ticking = false;
  function handleScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      const scrolled = window.pageYOffset > SCROLL_THRESHOLD;
      if (header) {
        if (scrolled) {
          header.classList.add('scrolled');
          document.body.classList.add('nav-scrolled');
        } else {
          header.classList.remove('scrolled');
          // Only remove body offset if nav isn't open
          if (!navNode.classList.contains('open')) document.body.classList.remove('nav-scrolled');
        }
      }
      ticking = false;
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
});
