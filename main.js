/* ============================================================
   UNA HUELLA QUE SIGUE — interacciones y animaciones
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

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

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

  /* ---------- Cabecera fija, progreso, volver arriba y parallax ---------- */
  function initScrollUI() {
    var header = doc.getElementById('siteHeader');
    var bar = doc.getElementById('progressBar');
    var toTop = doc.getElementById('toTop');
    var parallax = doc.querySelectorAll('[data-par]');
    var lines = doc.querySelectorAll('.tl');
    var ticking = false;

    function update() {
      var y = window.pageYOffset || doc.documentElement.scrollTop;
      var vh = window.innerHeight;
      var h = doc.documentElement.scrollHeight - vh;
      var ratio = h > 0 ? clamp(y / h, 0, 1) : 0;

      if (header) header.classList.toggle('is-stuck', y > 24);
      if (bar) bar.style.width = (ratio * 100).toFixed(2) + '%';
      if (toTop) toTop.classList.toggle('is-visible', y > vh * 0.85);

      if (!reduceMotion.matches) {
        Array.prototype.forEach.call(parallax, function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > vh + 200) return;
          var speed = parseFloat(el.getAttribute('data-par')) || 0.08;
          // El desplazamiento queda acotado al 6 % de la altura: con scale(1.15)
          // la imagen siempre cubre el marco y nunca asoma el fondo.
          var max = rect.height * 0.06;
          var raw = (rect.top + rect.height / 2 - vh / 2) * speed;
          var offset = Math.max(-max, Math.min(max, raw));
          el.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0) scale(1.15)';
        });

        Array.prototype.forEach.call(lines, function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;
          var p = clamp((vh * 0.78 - rect.top) / (rect.height * 0.85), 0, 1);
          el.style.setProperty('--line-p', p.toFixed(3));
        });
      }

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

  /* ---------- Aparición progresiva ---------- */
  function initReveal() {
    var items = doc.querySelectorAll('[data-r]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) {
      // Ya visible o ya superada (enlaces profundos, scroll rápido): se muestra sin esperar.
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-in');
      } else {
        io.observe(el);
      }
    });
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

  /* ---------- Navegación suave ---------- */
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

  /* ---------- Galería de memoria ---------- */
  function initGallery() {
    var img = doc.getElementById('galImg');
    var caption = doc.getElementById('galCaption');
    if (!img || !caption) return;

    var data = [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pocho.jpg/1280px-Pocho.jpg',
        alt: 'Grafiti en una pared de Rosario con la leyenda «Pocho vive» y un esténcil de un ángel que pedalea una bicicleta.',
        title: 'Esténcil «Pocho vive»',
        desc: 'Rosario, 2007. Foto: Pruxo · <a href="https://commons.wikimedia.org/wiki/File:Pocho.jpg" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · CC BY-SA 4.0'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Pocho2.jpg/1280px-Pocho2.jpg',
        alt: 'Pintura mural en una pared de Rosario con la frase «Seguimos su camino» junto a un rostro estilizado.',
        title: '«Seguimos su camino»',
        desc: 'Rosario, 2007. Foto: Pruxo · <a href="https://commons.wikimedia.org/wiki/File:Pocho2.jpg" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · CC BY-SA 4.0'
      },
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/POCHO_VIVE.jpeg',
        alt: 'Mural con la leyenda «Pocho vive» pintado en la pared del Hospital Alvear, en el barrio de La Paternal, Buenos Aires.',
        title: 'Mural «Pocho vive», Hospital Alvear',
        desc: 'Buenos Aires, 2015. Foto: Jppochettino · <a href="https://commons.wikimedia.org/wiki/File:POCHO_VIVE.jpeg" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · CC BY-SA 4.0'
      }
    ];

    var count = doc.getElementById('galCount');
    var title = doc.getElementById('galTitle');
    var desc = doc.getElementById('galDesc');
    var thumbs = doc.querySelectorAll('.gal__thumb');
    var stage = doc.querySelector('.gal__stage');
    var i = 0;
    var busy = false;

    function render(next) {
      if (busy || next === i) return;
      busy = true;
      i = (next + data.length) % data.length;
      var item = data[i];

      function swap() {
        img.src = item.src;
        img.alt = item.alt;
        if (count) count.textContent = (i + 1) + ' / ' + data.length;
        if (title) title.textContent = item.title;
        if (desc) desc.innerHTML = item.desc;
        Array.prototype.forEach.call(thumbs, function (t, n) {
          var on = n === i;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-current', on ? 'true' : 'false');
        });
        img.addEventListener('load', function () {
          img.classList.remove('is-fading');
          busy = false;
        }, { once: true });
        window.setTimeout(function () {
          img.classList.remove('is-fading');
          busy = false;
        }, 900);
      }

      if (reduceMotion.matches) { swap(); } else { img.classList.add('is-fading'); window.setTimeout(swap, 260); }
    }

    var prev = doc.getElementById('galPrev');
    var next = doc.getElementById('galNext');
    if (prev) prev.addEventListener('click', function () { render(i - 1); });
    if (next) next.addEventListener('click', function () { render(i + 1); });

    Array.prototype.forEach.call(thumbs, function (t) {
      t.addEventListener('click', function () {
        render(parseInt(t.getAttribute('data-i'), 10) || 0);
      });
    });

    if (stage) {
      stage.setAttribute('tabindex', '0');
      stage.setAttribute('role', 'group');
      stage.setAttribute('aria-label', 'Galería de fotografías de la memoria');
      stage.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); render(i - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); render(i + 1); }
      });
    }
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
        var frame = img.closest('.fig__frame, .band__frame, .gal__figure, .hero__media');
        if (frame) frame.classList.add('has-image-error');
      }, { once: true });
    });
  }

  ready(function () {
    initMenu();
    initScrollUI();
    initReveal();
    initActiveNav();
    initAnchors();
    initGallery();
    initImages();
    doc.documentElement.setAttribute('data-ready', 'true');
  });
})();
