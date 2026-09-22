/* ==========================================================================
   COD THEME — Componentes de conversión
   Web components independientes, sin dependencias externas.
   Cargado con `defer` desde layout/theme.liquid.
   ========================================================================== */

(function () {
  'use strict';

  var REDUCED_MOTION =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------------ */

  function pad(value) {
    return value < 10 ? '0' + value : String(value);
  }

  function safeStorage(action, key, value) {
    try {
      if (action === 'get') return window.localStorage.getItem(key);
      if (action === 'set') return window.localStorage.setItem(key, value);
      if (action === 'remove') return window.localStorage.removeItem(key);
    } catch (e) {
      /* modo incógnito o cookies bloqueadas: seguimos sin persistencia */
    }
    return null;
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* ------------------------------------------------------------------
     <cod-countdown> — contador de urgencia
     Modos:
       fixed     → cuenta hasta data-deadline (ISO)
       daily     → se reinicia cada día a data-reset-hour
       evergreen → data-minutes por visitante, guardado en localStorage
     ------------------------------------------------------------------ */

  var CodCountdown = (function () {
    function CodCountdown() {
      return Reflect.construct(HTMLElement, [], CodCountdown);
    }

    CodCountdown.prototype = Object.create(HTMLElement.prototype);
    CodCountdown.prototype.constructor = CodCountdown;
    Object.setPrototypeOf(CodCountdown, HTMLElement);

    CodCountdown.prototype.connectedCallback = function () {
      this.mode = this.dataset.mode || 'daily';
      this.outputs = {
        days: this.querySelector('[data-days]'),
        hours: this.querySelector('[data-hours]'),
        minutes: this.querySelector('[data-minutes]'),
        seconds: this.querySelector('[data-seconds]'),
      };
      this.onExpire = this.dataset.onExpire || 'restart';
      this.target = this.resolveTarget();
      this.tick();
      this.timer = window.setInterval(this.tick.bind(this), 1000);
    };

    CodCountdown.prototype.disconnectedCallback = function () {
      window.clearInterval(this.timer);
    };

    CodCountdown.prototype.resolveTarget = function () {
      var now = Date.now();

      if (this.mode === 'fixed') {
        var parsed = Date.parse(this.dataset.deadline || '');
        return isNaN(parsed) ? now + 86400000 : parsed;
      }

      if (this.mode === 'evergreen') {
        var minutes = parseInt(this.dataset.minutes, 10) || 30;
        var key = 'cod:countdown:' + (this.dataset.key || this.id || 'default');
        var stored = parseInt(safeStorage('get', key), 10);

        if (!stored || isNaN(stored) || stored < now) {
          stored = now + minutes * 60000;
          safeStorage('set', key, String(stored));
        }
        return stored;
      }

      // daily: próxima ocurrencia de la hora de reinicio
      var resetHour = parseInt(this.dataset.resetHour, 10);
      if (isNaN(resetHour)) resetHour = 0;

      var next = new Date();
      next.setHours(resetHour, 0, 0, 0);
      if (next.getTime() <= now) next.setDate(next.getDate() + 1);
      return next.getTime();
    };

    CodCountdown.prototype.tick = function () {
      var remaining = this.target - Date.now();

      if (remaining <= 0) {
        if (this.onExpire === 'hide') {
          window.clearInterval(this.timer);
          var section = this.closest('[data-cod-countdown-section]') || this;
          section.setAttribute('hidden', '');
          return;
        }
        // Por defecto reiniciamos el ciclo
        if (this.mode === 'evergreen') {
          safeStorage('remove', 'cod:countdown:' + (this.dataset.key || this.id || 'default'));
        }
        this.target = this.resolveTarget();
        remaining = Math.max(this.target - Date.now(), 0);
      }

      var totalSeconds = Math.floor(remaining / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      // Sin bloque de días visible, acumulamos las horas
      if (!this.outputs.days) hours += days * 24;

      if (this.outputs.days) this.outputs.days.textContent = pad(days);
      if (this.outputs.hours) this.outputs.hours.textContent = pad(hours);
      if (this.outputs.minutes) this.outputs.minutes.textContent = pad(minutes);
      if (this.outputs.seconds) this.outputs.seconds.textContent = pad(seconds);
    };

    return CodCountdown;
  })();

  /* ------------------------------------------------------------------
     <cod-sticky-bar> — barra fija de compra
     Aparece cuando el botón principal sale de la pantalla.
     ------------------------------------------------------------------ */

  var CodStickyBar = (function () {
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

      this.watchTarget();
      this.bindCta();
    };

    CodStickyBar.prototype.disconnectedCallback = function () {
      if (this.observer) this.observer.disconnect();
      document.body.classList.remove('cod-has-sticky-bar', 'cod-sticky-visible');
    };

    CodStickyBar.prototype.watchTarget = function () {
      var selector = this.dataset.watch || '.product-form__submit, [data-cod-primary-cta]';
      var target = document.querySelector(selector);

      // Sin referencia visible mostramos la barra tras un poco de scroll
      if (!target || !('IntersectionObserver' in window)) {
        this.fallbackScroll();
        return;
      }

      var self = this;
      this.observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            self.toggle(!entry.isIntersecting && entry.boundingClientRect.top < 0);
          });
        },
        { threshold: 0, rootMargin: '0px 0px -40px 0px' }
      );
      this.observer.observe(target);
    };

    CodStickyBar.prototype.fallbackScroll = function () {
      var self = this;
      var onScroll = function () {
        self.toggle(window.scrollY > 600);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    };

    CodStickyBar.prototype.toggle = function (visible) {
      this.bar.classList.toggle('is-visible', visible);
      document.body.classList.toggle('cod-sticky-visible', visible);
    };

    // El CTA de la barra reenvía al formulario real de compra
    CodStickyBar.prototype.bindCta = function () {
      var cta = this.querySelector('[data-cod-sticky-cta]');
      if (!cta) return;

      cta.addEventListener('click', function (event) {
        var targetSelector = cta.dataset.codStickyCta;
        if (!targetSelector) return;

        var destination = document.querySelector(targetSelector);
        if (!destination) return;

        event.preventDefault();
        destination.scrollIntoView({
          behavior: REDUCED_MOTION ? 'auto' : 'smooth',
          block: 'center',
        });

        // Si apunta al botón de agregar, lo pulsamos tras el desplazamiento
        if (cta.dataset.codStickySubmit === 'true') {
          window.setTimeout(function () {
            var submit = document.querySelector('.product-form__submit');
            if (submit && !submit.disabled) submit.click();
          }, REDUCED_MOTION ? 0 : 450);
        }
      });
    };

    return CodStickyBar;
  })();

  /* ------------------------------------------------------------------
     <cod-live-count> — prueba social "N personas viendo esto"
     El número fluctúa dentro del rango configurado por el comerciante.
     ------------------------------------------------------------------ */

  var CodLiveCount = (function () {
    function CodLiveCount() {
      return Reflect.construct(HTMLElement, [], CodLiveCount);
    }

    CodLiveCount.prototype = Object.create(HTMLElement.prototype);
    CodLiveCount.prototype.constructor = CodLiveCount;
    Object.setPrototypeOf(CodLiveCount, HTMLElement);

    CodLiveCount.prototype.connectedCallback = function () {
      this.output = this.querySelector('[data-count]');
      if (!this.output) return;

      this.min = parseInt(this.dataset.min, 10) || 8;
      this.max = parseInt(this.dataset.max, 10) || 40;
      if (this.max < this.min) this.max = this.min;

      this.current = randomBetween(this.min, this.max);
      this.render();

      var interval = (parseInt(this.dataset.interval, 10) || 7) * 1000;
      this.timer = window.setInterval(this.drift.bind(this), interval);
    };

    CodLiveCount.prototype.disconnectedCallback = function () {
      window.clearInterval(this.timer);
    };

    // Variación suave: ±3 sobre el valor anterior, siempre dentro del rango
    CodLiveCount.prototype.drift = function () {
      var delta = randomBetween(-3, 3);
      this.current = Math.min(Math.max(this.current + delta, this.min), this.max);
      this.render();
    };

    CodLiveCount.prototype.render = function () {
      this.output.textContent = String(this.current);
    };

    return CodLiveCount;
  })();

  /* ------------------------------------------------------------------
     <cod-stock-bar> — barra de existencias
     Anima el ancho al entrar en pantalla.
     ------------------------------------------------------------------ */

  var CodStockBar = (function () {
    function CodStockBar() {
      return Reflect.construct(HTMLElement, [], CodStockBar);
    }

    CodStockBar.prototype = Object.create(HTMLElement.prototype);
    CodStockBar.prototype.constructor = CodStockBar;
    Object.setPrototypeOf(CodStockBar, HTMLElement);

    CodStockBar.prototype.connectedCallback = function () {
      var fill = this.querySelector('.cod-stock__fill');
      if (!fill) return;

      var percent = Math.min(Math.max(parseInt(this.dataset.percent, 10) || 0, 3), 100);

      if (!('IntersectionObserver' in window) || REDUCED_MOTION) {
        fill.style.width = percent + '%';
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            fill.style.width = percent + '%';
            observer.disconnect();
          });
        },
        { threshold: 0.3 }
      );

      fill.style.width = '0%';
      observer.observe(this);
    };

    return CodStockBar;
  })();

  /* ------------------------------------------------------------------
     Desplazamiento suave hacia el formulario COD
     Uso: <a data-cod-scroll="#CodForm">…</a>
     ------------------------------------------------------------------ */

  function bindScrollLinks() {
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-cod-scroll]');
      if (!trigger) return;

      var destination = document.querySelector(trigger.dataset.codScroll);
      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({
        behavior: REDUCED_MOTION ? 'auto' : 'smooth',
        block: 'start',
      });

      // Enfocamos el primer campo para acelerar el llenado en móvil
      var firstField = destination.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstField) {
        window.setTimeout(function () {
          firstField.focus({ preventScroll: true });
        }, REDUCED_MOTION ? 0 : 600);
      }
    });
  }

  /* ------------------------------------------------------------------
     Registro de componentes
     ------------------------------------------------------------------ */

  function define(name, constructor) {
    if (!window.customElements || window.customElements.get(name)) return;
    window.customElements.define(name, constructor);
  }

  define('cod-countdown', CodCountdown);
  define('cod-sticky-bar', CodStickyBar);
  define('cod-live-count', CodLiveCount);
  define('cod-stock-bar', CodStockBar);

  bindScrollLinks();
})();
