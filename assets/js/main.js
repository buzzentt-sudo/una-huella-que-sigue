/* ============================================================
   UNA HUELLA QUE SIGUE — interacciones
   Vanilla JS, sin dependencias. Compatible con file:// y HTTP.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function ready(fn) {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /* ---------- Menú móvil ---------- */
  function initMenu() {
    var toggle = doc.getElementById('navToggle');
    var menu = doc.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    var links = menu.querySelectorAll('a');

    function open() {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
      doc.body.classList.add('menu-open');
      if (links.length) links[0].focus({ preventScroll: true });
    }

    function close(returnFocus) {
      if (menu.hidden) return;
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
      doc.body.classList.remove('menu-open');
      if (returnFocus) toggle.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', function () {
      if (menu.hidden) { open(); } else { close(true); }
    });

    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('click', function () { close(false); });
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) close(true);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) close(false);
    });
  }

  /* ---------- Cabecera fija + barra de progreso + volver arriba ---------- */
  function initScrollUI() {
    var header = doc.getElementById('siteHeader');
    var bar = doc.getElementById('progressBar');
    var toTop = doc.getElementById('toTop');
    var ticking = false;

    function update() {
      var y = window.pageYOffset || doc.documentElement.scrollTop;
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var ratio = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;

      if (header) header.classList.toggle('is-stuck', y > 24);
      if (bar) bar.style.width = (ratio * 100).toFixed(2) + '%';
      if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 0.85);

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        var brand = doc.querySelector('.brand');
        if (brand) brand.focus({ preventScroll: true });
      });
    }
  }

  /* ---------- Aparición progresiva de las secciones ---------- */
  function initReveal() {
    var items = doc.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------- Sección activa en la navegación ---------- */
  function initActiveNav() {
    var navLinks = doc.querySelectorAll('.nav__list a');
    if (!navLinks.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var targets = [];
    Array.prototype.forEach.call(navLinks, function (a) {
      var id = a.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var section = doc.querySelector(id);
      if (section) { map[section.id] = a; targets.push(section); }
    });

    function clear() {
      Array.prototype.forEach.call(navLinks, function (a) { a.classList.remove('is-current'); });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          clear();
          var link = map[entry.target.id];
          if (link) link.classList.add('is-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Navegación suave (respeta movimiento reducido) ---------- */
  function initAnchors() {
    doc.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;

      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var target = doc.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var header = doc.getElementById('siteHeader');
      var offset = header ? header.offsetHeight + 12 : 0;
      var top = target.getBoundingClientRect().top + (window.pageYOffset || 0) - offset;

      window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion.matches ? 'auto' : 'smooth' });

      if (history.replaceState) history.replaceState(null, '', id);
      target.setAttribute('tabindex', '-1');
      window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduceMotion.matches ? 0 : 500);
    });
  }

  /* ---------- Imágenes: estado de carga y respaldo ---------- */
  function initImages() {
    Array.prototype.forEach.call(doc.images, function (img) {
      if (img.complete && img.naturalWidth > 0) {
        img.setAttribute('data-loaded', 'true');
        return;
      }
      img.addEventListener('load', function () { img.setAttribute('data-loaded', 'true'); }, { once: true });
      img.addEventListener('error', function () {
        img.setAttribute('data-failed', 'true');
        var fig = img.closest('figure');
        if (fig) fig.classList.add('has-image-error');
      }, { once: true });
    });
  }

  /* ---------- Recuento de integrantes (control de calidad) ---------- */
  function initCreditCount() {
    var grid = doc.querySelector('.credits__grid');
    if (!grid) return;
    grid.setAttribute('data-count', String(grid.children.length));
  }

  ready(function () {
    initMenu();
    initScrollUI();
    initReveal();
    initActiveNav();
    initAnchors();
    initImages();
    initCreditCount();
    doc.documentElement.setAttribute('data-ready', 'true');
  });
})();
