/* ==========================================================================
   page-transition.js — curved navy overlay used for page-to-page navigation
   and (together with preloader.js) the opening reveal.
   ========================================================================== */
(function () {
  var PC = window.PC;

  PC.transition = {
    el: null,

    build: function () {
      var el = document.createElement('div');
      el.className = 'pt is-active';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML =
        '<div class="pt-curve top"></div><div class="pt-curve bottom"></div>' +
        '<div class="pt-inner">' +
          '<div class="pt-name"><span class="pt-mask"><span></span></span></div>' +
          '<div class="pt-tagline"></div>' +
        '</div>' +
        '<div class="pt-count">0</div>';
      document.body.appendChild(el);
      this.el = el;
      gsap.set(el, { yPercent: 0 });   /* starts fully covering the page */
    },

    /* slide up to uncover the page */
    reveal: function () {
      var el = this.el;
      return gsap.to(el, {
        yPercent: -120, duration: 1.1, ease: 'pc',
        onComplete: function () { el.classList.remove('is-active'); gsap.set(el, { yPercent: 120 }); }
      });
    },

    /* slide up from the bottom to cover the page, then run cb */
    cover: function (cb) {
      var el = this.el;
      var inner = el.querySelector('.pt-inner');
      var count = el.querySelector('.pt-count');
      gsap.set([inner, count], { opacity: 0 });
      el.classList.add('is-active');
      if (PC.smooth) PC.smooth.stop();
      gsap.fromTo(el, { yPercent: 120 }, { yPercent: 0, duration: .8, ease: 'pc', onComplete: cb });
    },

    reset: function () {
      if (!this.el) return;
      this.el.classList.remove('is-active');
      gsap.set(this.el, { yPercent: 120 });
      if (PC.smooth) PC.smooth.start();
    },

    bind: function () {
      var self = this;

      /* back/forward cache: page restored with the overlay still covering */
      window.addEventListener('pageshow', function (e) { if (e.persisted) self.reset(); });

      document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest('a[href]');
        if (!a) return;
        if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;

        var url;
        try { url = new URL(a.href, location.href); } catch (err) { return; }
        if (!/^(https?|file):$/.test(url.protocol)) return;              /* skip mailto:, tel: … */
        if (url.protocol !== 'file:' && url.origin !== location.origin) return; /* external */

        var samePage = url.pathname === location.pathname;
        if (samePage) {
          if (!url.hash) return;
          e.preventDefault();
          PC.closeMenu && PC.closeMenu();
          PC.goToAnchor(url.hash);
          history.pushState(null, '', url.hash);
          return;
        }
        e.preventDefault();
        PC.closeMenu && PC.closeMenu();
        self.cover(function () { location.href = url.href; });
      });
    }
  };
})();
