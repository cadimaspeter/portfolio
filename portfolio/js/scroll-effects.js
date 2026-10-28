/* ==========================================================================
   scroll-effects.js — fade-ups, parallax, image reveals, counters,
   header hide/show. Targets come from PC.config (config.js) or attributes:
     data-reveal="fade"   fade a custom element up
     data-reveal="clip"   wipe-reveal an image frame
     data-parallax="10"   drift ±10% while scrolling
   ========================================================================== */
(function () {
  var PC = window.PC;

  PC.scroll = {
    init: function () {
      this.fade();
      this.clip();
      this.parallax();
      this.counters();
      this.header();
    },

    fade: function () {
      var cfg = PC.config;
      var els = PC.qsa(cfg.fade + ',[data-reveal="fade"]').filter(function (el) {
        return PC.visible(el) && el.dataset.reveal !== 'none';
      });
      if (!els.length) return;
      gsap.set(els, { autoAlpha: 0, y: cfg.fadeDistance });
      ScrollTrigger.batch(els, {
        start: 'top 92%',
        once: true,
        interval: 0.1,
        batchMax: 6,
        onEnter: function (batch) {
          PC.whenIntro(function (d) {
            gsap.to(batch, {
              autoAlpha: 1, y: 0,
              duration: cfg.fadeDuration, stagger: 0.09, delay: d, ease: 'pc',
              /* clear inline styles so CSS hover transforms keep working */
              clearProps: 'opacity,visibility,transform'
            });
          }, batch[0]);
        }
      });
    },

    clip: function () {
      PC.qsa('[data-reveal="clip"]').forEach(function (el) {
        if (!PC.visible(el)) return;
        var img = el.querySelector('img');
        gsap.set(el, { clipPath: 'inset(100% 0% 0% 0% round 20px)' });
        if (img) gsap.set(img, { scale: 1.25 });
        ScrollTrigger.create({
          trigger: el, start: 'top 88%', once: true,
          onEnter: function () {
            PC.whenIntro(function (d) {
              gsap.to(el, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.4, delay: d, ease: 'pc', clearProps: 'clipPath' });
              if (img) gsap.to(img, { scale: 1, duration: 1.8, delay: d, ease: 'pc' });
            }, el);
          }
        });
      });
    },

    parallax: function () {
      PC.qsa('[data-parallax]').forEach(function (el) {
        var amp = parseFloat(el.dataset.parallax) || 10;
        gsap.fromTo(el, { yPercent: -amp }, {
          yPercent: amp, ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true
          }
        });
      });
    },

    counters: function () {
      var re = /^([+$~]?)(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?([%x+kKmM]?)$/;
      PC.qsa(PC.config.counters).forEach(function (el) {
        if (!PC.visible(el)) return;
        var text = el.textContent.trim();
        var m = text.match(re);
        if (!m) return;                               /* placeholders, ranges, words → untouched */
        var hasComma = m[2].indexOf(',') > -1;
        var dec = m[3] ? m[3].length - 1 : 0;
        var target = parseFloat(m[2].replace(/,/g, '') + (m[3] || ''));
        if (!hasComma && !dec && !m[4] && target >= 1900 && target <= 2100) return; /* looks like a year */
        function fmt(n) {
          return hasComma
            ? n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
            : n.toFixed(dec);
        }
        el.setAttribute('aria-label', text);
        el.textContent = m[1] + fmt(0) + m[4];
        var o = { v: 0 };
        ScrollTrigger.create({
          trigger: el, start: 'top 94%', once: true,
          onEnter: function () {
            PC.whenIntro(function (d) {
              gsap.to(o, {
                v: target, duration: 1.8, delay: d + 0.15, ease: 'power3.out',
                onUpdate: function () { el.textContent = m[1] + fmt(o.v) + m[4]; },
                onComplete: function () { el.textContent = text; }
              });
            }, el);
          }
        });
      });
    },

    header: function () {
      var header = PC.qs('.site-header');
      if (!header) return;
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) {
          var y = self.scroll();
          header.classList.toggle('is-scrolled', y > 10);
          var hide = self.direction === 1 && y > PC.config.headerHideAfter && !PC.root.classList.contains('menu-open');
          header.classList.toggle('is-hidden', hide);
        }
      });
    }
  };
})();
