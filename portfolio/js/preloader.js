/* ==========================================================================
   preloader.js — decides how the page opens:
   · first page of a browser session  → name + 0-100 counter, then reveal
   · any later page / navigation      → quick overlay reveal
   ========================================================================== */
(function () {
  var PC = window.PC;

  PC.preloader = {
    first: function () {
      try {
        if (sessionStorage.getItem('pc-visited')) return false;
        sessionStorage.setItem('pc-visited', '1');
      } catch (e) {}
      return true;
    },

    /* returns a promise-like: calls done() when the overlay starts lifting */
    play: function () {
      var t = PC.transition, el = t.el;
      var inner = el.querySelector('.pt-inner');
      var nameEl = el.querySelector('.pt-name .pt-mask > span');
      var tagEl = el.querySelector('.pt-tagline');
      var countEl = el.querySelector('.pt-count');
      var tl = gsap.timeline();

      function lift() {
        gsap.delayedCall(0.45, PC.flushIntro);   /* page content starts as the overlay moves */
        t.reveal();
      }

      if (!this.first()) {
        tl.add(function () { lift(); }, 0.15);
        return tl;
      }

      nameEl.textContent = PC.config.preloader.name;
      tagEl.textContent = PC.config.preloader.tagline;
      var counter = { v: 0 };
      gsap.set(inner, { opacity: 1 });
      gsap.set(nameEl, { yPercent: 110 });
      gsap.set(tagEl, { opacity: 0, y: 12 });
      gsap.set(countEl, { opacity: 1 });

      tl.to(nameEl, { yPercent: 0, duration: 1.1 }, 0.1)
        .to(tagEl, { opacity: 1, y: 0, duration: .9 }, 0.45)
        .to(counter, {
          v: 100, duration: 1.5, ease: 'power2.inOut',
          onUpdate: function () { countEl.textContent = Math.round(counter.v); }
        }, 0.1)
        .to([nameEl, tagEl], { yPercent: -110, opacity: 0, duration: .7, stagger: .06, ease: 'power3.in' }, '+=.1')
        .to(countEl, { opacity: 0, duration: .4 }, '<')
        .add(function () { lift(); });
      return tl;
    }
  };
})();
