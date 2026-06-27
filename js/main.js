/* ============================================================
   IGRP Performance & Industrial — main.js
   Versión: 4.0 | Extraído de index.html
   Módulos:
     · Navegación (scroll, hamburger, dropdown)
     · Scroll Reveal (IntersectionObserver)
     · Contador Regresivo (lanzamiento Oct 2026)
     · Galería de Producto (fade, miniaturas)
     · Lightbox (pantalla completa, flechas, swipe, Escape)
     · Selector de Tallas
     · Newsletter
     · Performance: lazy-load
   NO modificar funciones — comportamiento idéntico al original
   ============================================================ */

/* ─── NAVEGACIÓN ─── */
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
    closeLightbox();
  }
});

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── CONTADOR REGRESIVO ─── */
// Fecha de lanzamiento: 21 de Octubre 2026, medianoche hora CDMX (UTC-6)
const LAUNCH_DATE = new Date('2026-10-21T00:00:00-06:00');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now  = new Date();
  const diff = LAUNCH_DATE - now;

  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });

    const ctaText = document.getElementById('heroCTAText');
    const cta     = document.getElementById('heroCTA');
    if (ctaText) ctaText.textContent = 'Comprar en Amazon';
    if (cta)     cta.setAttribute('aria-label', 'Comprar en Amazon');

    const wrap = document.getElementById('countdownWrap');
    if (wrap) wrap.style.display = 'none';
    return;
  }

  document.getElementById('cd-days').textContent  = pad(Math.floor(diff / 86400000));
  document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
  document.getElementById('cd-mins').textContent  = pad(Math.floor((diff % 3600000)  / 60000));
  document.getElementById('cd-secs').textContent  = pad(Math.floor((diff % 60000)    / 1000));
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ─── TALLAS ─── */
function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ─── NEWSLETTER ─── */
function handleNewsletter(e) {
  e.preventDefault();
  document.getElementById('newsletterForm').style.display    = 'none';
  document.getElementById('newsletter-success').style.display = 'block';
}

/* ============================================================
   GALERÍA DE PRODUCTO
   - Miniaturas clickeables con fade
   - Cambio de imagen principal
   - Integración con lightbox
   ============================================================ */
(function initProductGallery() {
  const slides = document.querySelectorAll('.product-gallery__slide');
  const thumbs = document.querySelectorAll('.product-gallery__thumb');
  const main   = document.getElementById('pgMain');
  const expand = document.getElementById('pgExpand');

  if (!slides.length) return; // sin galería en esta página

  let currentIndex = 0;

  // Activa un slide por índice
  function goTo(idx) {
    if (idx < 0) idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;
    currentIndex = idx;

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === idx);
      t.setAttribute('aria-selected', String(i === idx));
    });
  }

  // Clicks en miniaturas
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      goTo(parseInt(thumb.dataset.thumb, 10));
    });
  });

  // Click en imagen principal → abrir lightbox
  main.addEventListener('click', (e) => {
    if (!e.target.closest('.product-gallery__expand')) {
      openLightbox(currentIndex);
    }
  });

  // Botón expandir → lightbox
  if (expand) {
    expand.addEventListener('click', () => openLightbox(currentIndex));
  }

  // Exponer goTo globalmente para el lightbox
  window._pgGoTo = goTo;
  window._pgSlides = slides;
  window._pgCurrentIndex = () => currentIndex;
})();

/* ============================================================
   LIGHTBOX
   - Fade open/close
   - Flechas prev/next
   - Swipe en móviles (touch)
   - Escape para cerrar
   - Focus trap para accesibilidad
   ============================================================ */
(function initLightbox() {
  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCap    = document.getElementById('lbCaption');
  const lbClose  = document.getElementById('lbClose');
  const lbPrev   = document.getElementById('lbPrev');
  const lbNext   = document.getElementById('lbNext');
  const lbDots   = document.getElementById('lbDots');

  if (!lb || !lbImg) return;

  // Recopilar datos de las imágenes del producto
  const slides    = document.querySelectorAll('.product-gallery__slide');
  const lbSources = [];

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) {
      lbSources.push({
        src:   img.src,
        alt:   img.alt,
        label: slide.dataset.label || ''
      });
    }
  });

  let currentLbIdx = 0;
  let prevFocus    = null; // elemento que tenía foco antes de abrir

  // Crear dots
  function buildDots() {
    if (!lbDots) return;
    lbDots.innerHTML = '';
    lbSources.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'lightbox__dot' + (i === 0 ? ' active' : '');
      lbDots.appendChild(d);
    });
  }
  buildDots();

  // Actualizar dot activo
  function updateDots(idx) {
    if (!lbDots) return;
    lbDots.querySelectorAll('.lightbox__dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  // Mostrar imagen en lightbox
  function showLbImage(idx) {
    if (!lbSources.length) return;
    if (idx < 0) idx = lbSources.length - 1;
    if (idx >= lbSources.length) idx = 0;
    currentLbIdx = idx;

    lbImg.src = lbSources[idx].src;
    lbImg.alt = lbSources[idx].alt;
    if (lbCap) lbCap.textContent = lbSources[idx].label;
    updateDots(idx);

    // Sincronizar la galería de producto
    if (window._pgGoTo) window._pgGoTo(idx);
  }

  // Abrir lightbox
  window.openLightbox = function(idx) {
    prevFocus = document.activeElement;
    showLbImage(idx);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Enfocar el botón cerrar
    setTimeout(() => lbClose && lbClose.focus(), 50);
  };

  // Cerrar lightbox
  window.closeLightbox = function() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Devolver foco al elemento que lo tenía antes
    if (prevFocus) prevFocus.focus();
  };

  // Fondo → cerrar
  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => showLbImage(currentLbIdx - 1));
  if (lbNext)  lbNext.addEventListener('click', () => showLbImage(currentLbIdx + 1));

  // Teclado: flechas + Escape
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); showLbImage(currentLbIdx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showLbImage(currentLbIdx + 1); }
    // Escape ya manejado arriba
  });

  // ── Swipe táctil ──
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50; // px mínimos para considerar swipe

  lb.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Solo registrar como swipe horizontal si predomina sobre el vertical
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) showLbImage(currentLbIdx + 1); // swipe izquierda → siguiente
      else        showLbImage(currentLbIdx - 1); // swipe derecha  → anterior
    }
    // Swipe vertical hacia abajo cierra
    if (dy > 100 && Math.abs(dx) < 50) closeLightbox();
  }, { passive: true });

  // Focus trap: Tab dentro del lightbox
  lb.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !lb.classList.contains('open')) return;
    const focusable = lb.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
})();

/* ─── PERFORMANCE: lazy-load images ─── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
}
