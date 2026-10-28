/* ==========================================================================
   interactions.js — things that work with or without GSAP:
   button text-roll, mobile menu. Plus the custom cursor (GSAP only).
   ========================================================================== */
(function () {
  var PC = window.PC;

  PC.interactions = {
    /* wrap button/link text so it can "roll" on hover (styles in motion.css) */
    roll: function () {
      PC.qsa('.btn, .nav-cta').forEach(function (el) {
        if (el.children.length) return;
        var text = el.textContent.trim();
        if (!text) return;
        el.innerHTML = '<span class="roll"><span>' + text + '</span><span aria-hidden="true">' + text + '</span></span>';
        el.setAttribute('aria-label', text);
      });
    },

    menu: function () {
      var btn = PC.qs('.nav-toggle');
      var links = PC.qs('.nav-links');
      if (!btn || !links) return;

      function set(open) {
        PC.root.classList.toggle('menu-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.textContent = open ? 'CLOSE' : 'MENU';
        if (open) PC.smooth.stop(); else if (PC.state.introPlayed || !PC.canAnimate) PC.smooth.start();
        document.body.style.overflow = (open && !PC.smooth.lenis) ? 'hidden' : '';
      }
      PC.closeMenu = function () { if (PC.root.classList.contains('menu-open')) set(false); };

      btn.addEventListener('click', function () { set(!PC.root.classList.contains('menu-open')); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') PC.closeMenu(); });
      window.addEventListener('resize', function () { if (window.innerWidth > 860) PC.closeMenu(); });
    },

    cursor: function () {
      if (!PC.canAnimate || !PC.finePointer) return;
      var c = document.createElement('div');
      c.className = 'cursor';
      c.setAttribute('aria-hidden', 'true');
      c.innerHTML = '<span class="cursor-label"></span>';
      document.body.appendChild(c);
      var label = c.firstChild;

      var xTo = gsap.quickTo(c, 'x', { duration: .5, ease: 'power3' });
      var yTo = gsap.quickTo(c, 'y', { duration: .5, ease: 'power3' });
      var mx = 0, my = 0, shown = false, labelOn = false, R = 42;

      function position() {
        /* edge-flip: keep the label bubble fully inside the viewport */
        var x = mx, y = my;
        if (labelOn) {
          x = Math.min(Math.max(x, R), window.innerWidth - R);
          y = Math.min(Math.max(y, R), window.innerHeight - R);
        }
        xTo(x); yTo(y);
      }
      function state(scale, isLabel, text) {
        labelOn = isLabel;
        c.classList.toggle('is-label', isLabel);
        label.textContent = text || '';
        gsap.to(c, { scale: scale, duration: .5, ease: 'pc', overwrite: 'auto' });
        position();
      }

      window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (!shown) {
          shown = true;
          gsap.set(c, { x: mx, y: my });
          gsap.to(c, { opacity: 1, duration: .3 });
          state(.12, false);
        }
        position();
      }, { passive: true });
      document.addEventListener('mouseleave', function () { gsap.to(c, { opacity: 0, duration: .3 }); shown = false; });

      document.addEventListener('mouseover', function (e) {
        var t = e.target.closest ? e.target.closest('[data-cursor],a,button') : null;
        if (!t) { state(.12, false); return; }
        if (t.dataset.cursor) { state(1, true, t.dataset.cursor); return; }
        state(.5, false);
      });
    }
  };
})();
