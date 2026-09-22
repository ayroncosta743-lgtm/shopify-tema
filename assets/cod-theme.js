/* ==========================================================================
   COD THEME — Componentes de conversión
   Dos comportamientos y nada más: la barra fija de compra y el
   desplazamiento al formulario. Sin dependencias.
   ========================================================================== */

(function () {
  'use strict';

  var SMOOTH = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ------------------------------------------------------------------
     <cod-sticky-bar> — aparece cuando el botón de compra sale de pantalla
     ------------------------------------------------------------------ */

  function CodStickyBar() {
    return Reflect.construct(HTMLElement, [], CodStickyBar);
  }

  CodStickyBar.prototype = Object.create(HTMLElement.prototype);
  CodStickyBar.prototype.constructor = CodStickyBar;
  Object.setPrototypeOf(CodStickyBar, HTMLElement);

  CodStickyBar.prototype.connectedCallback = function () {
    this.bar = this.querySelector('.cod-sticky-bar');
    if (!this.bar) return;

    document.body.classList.add('cod-has-sticky-bar');
    if (this.bar.classList.contains('cod-sticky-bar--mobile-only')) {
      document.body.classList.add('cod-has-sticky-bar--mobile-only');
    }

    var target = document.querySelector(this.dataset.watch || '.product-form__submit');
    var self = this;

    if (target && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            self.toggle(!entry.isIntersecting && entry.boundingClientRect.top < 0);
          });
        },
        { threshold: 0, rootMargin: '0px 0px -40px 0px' }
      );
      this.observer.observe(target);
    } else {
      // Sin referencia visible, mostramos tras un poco de scroll
      var onScroll = function () {
        self.toggle(window.scrollY > 600);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  };

  CodStickyBar.prototype.disconnectedCallback = function () {
    if (this.observer) this.observer.disconnect();
    document.body.classList.remove('cod-has-sticky-bar', 'cod-sticky-visible');
  };

  CodStickyBar.prototype.toggle = function (visible) {
    this.bar.classList.toggle('is-visible', visible);
    document.body.classList.toggle('cod-sticky-visible', visible);
  };

  if (window.customElements && !window.customElements.get('cod-sticky-bar')) {
    window.customElements.define('cod-sticky-bar', CodStickyBar);
  }

  /* ------------------------------------------------------------------
     Desplazamiento al formulario de contra entrega
     Uso: <a data-cod-scroll="#CodOrderForm">…</a>
     ------------------------------------------------------------------ */

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-cod-scroll]');
    if (!trigger) return;

    var destination = document.querySelector(trigger.dataset.codScroll);
    if (!destination) return;

    event.preventDefault();
    destination.scrollIntoView({ behavior: SMOOTH ? 'smooth' : 'auto', block: 'start' });

    // Enfocamos el primer campo para acelerar el llenado en móvil
    var field = destination.querySelector('input:not([type="hidden"]), select, textarea');
    if (field) {
      window.setTimeout(function () {
        field.focus({ preventScroll: true });
      }, SMOOTH ? 600 : 0);
    }
  });
})();
