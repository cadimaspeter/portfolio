/* ==========================================================================
   carousel.js — pillars carousel (index.html). Markup contract:
   [data-carousel] > .carousel-track > .slide…  (last .slide may be an
   aria-hidden clone of the first for a seamless loop) + .dot buttons.
   ========================================================================== */
(function () {
  var PC = window.PC;

  PC.carousel = {
    init: function () {
      var root = PC.qs('[data-carousel]');
      if (!root) return;
      var track = PC.qs('.carousel-track', root);
      var dots = PC.qsa('.dot', root);
      var slides = PC.qsa('.slide', track);
      var real = slides.filter(function (s) { return s.getAttribute('aria-hidden') !== 'true'; }).length;
      var index = 0, timer = null, visible = true;
      var MS = 4500, T = 700;

      function render(animate) {
        track.style.transition = animate ? 'transform ' + T + 'ms var(--ease-soft)' : 'none';
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        dots.forEach(function (d, i) {
          var on = i === (index % real);
          d.classList.toggle('active', on);
          d.setAttribute('aria-current', on ? 'true' : 'false');
        });
      }
      function next() { index++; render(true); }
      function prev() {
        if (index === 0) { index = real; render(false); void track.offsetWidth; }
        index--; render(true);
      }
      track.addEventListener('transitionend', function (e) {
        if (e.target !== track || e.propertyName !== 'transform') return;
        if (index >= real) { index = 0; render(false); }
      });

      function start() { stop(); if (!PC.reduced && visible && !document.hidden) timer = setInterval(next, MS); }
      function stop() { clearInterval(timer); timer = null; }

      dots.forEach(function (d) {
        d.addEventListener('click', function () { index = parseInt(d.dataset.i, 10); render(true); start(); });
      });
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) { visible = en[0].isIntersecting; visible ? start() : stop(); }, { threshold: .2 }).observe(root);
      }

      /* swipe / drag */
      var sx = null;
      root.addEventListener('pointerdown', function (e) { sx = e.clientX; root.classList.add('is-dragging'); stop(); });
      window.addEventListener('pointerup', function (e) {
        if (sx === null) return;
        var dx = e.clientX - sx; sx = null;
        root.classList.remove('is-dragging');
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
        start();
      });
      root.addEventListener('dragstart', function (e) { e.preventDefault(); });

      render(false);
      start();
    }
  };
})();
