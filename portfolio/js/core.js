/* ==========================================================================
   core.js — feature detection, GSAP setup, Lenis smooth scroll, intro queue
   ========================================================================== */
(function () {
  var PC = window.PC;
  var root = document.documentElement;

  PC.root = root;
  PC.qs = function (s, c) { return (c || document).querySelector(s); };
  PC.qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  /* elements inside [hidden] (e.g. unused placeholder blocks) are skipped */
  PC.visible = function (el) { return !el.closest('[hidden]'); };

  PC.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  PC.finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  PC.hasGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText && window.CustomEase);
  PC.canAnimate = PC.hasGsap && !PC.reduced;

  /* ---- intro queue: reveals that are already on screen wait for the
          preloader / page transition, then play top-to-bottom ---- */
  PC.state = { introPlayed: false, queue: [] };

  PC.whenIntro = function (fn, el) {
    if (PC.state.introPlayed) { fn(0); return; }
    PC.state.queue.push({ fn: fn, el: el });
  };

  PC.flushIntro = function () {
    if (PC.state.introPlayed) return;
    PC.state.introPlayed = true;
    var q = PC.state.queue.splice(0);
    q.forEach(function (item) {
      var r = item.el && item.el.getBoundingClientRect ? item.el.getBoundingClientRect() : { top: 0, left: 0 };
      item.top = r.top; item.left = r.left;
    });
    q.sort(function (a, b) { return (a.top - b.top) || (a.left - b.left); });
    q.forEach(function (item, i) { item.fn(Math.min(i * 0.07, 0.7)); });
    if (PC.smooth) PC.smooth.start();
  };

  /* ---- GSAP ---- */
  PC.setupGsap = function () {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
    CustomEase.create('pc', PC.config.ease);
    gsap.defaults({ ease: 'pc' });
  };

  /* ---- Lenis smooth scroll wired into GSAP's ticker ---- */
  PC.smooth = {
    lenis: null,
    init: function () {
      if (!PC.canAnimate || !window.Lenis) return;
      var lenis = new Lenis({
        duration: 1.1,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.stop();                 /* locked until the intro finishes */
      PC.smooth.lenis = lenis;
    },
    start: function () { if (this.lenis) this.lenis.start(); },
    stop: function () { if (this.lenis) this.lenis.stop(); },
    to: function (target, opts) {
      opts = opts || {};
      if (this.lenis) { this.lenis.scrollTo(target, opts); return; }
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) el.scrollIntoView({ behavior: opts.immediate || PC.reduced ? 'auto' : 'smooth' });
      else if (target === 0) window.scrollTo(0, 0);
    }
  };

  /* jump to #hash (same page) */
  PC.goToAnchor = function (hash, immediate) {
    if (!hash || hash === '#') { PC.smooth.to(0, { immediate: immediate }); return; }
    var el = null;
    try { el = document.querySelector(hash); } catch (e) {}
    if (el) PC.smooth.to(el, { immediate: immediate, duration: 1.4 });
  };
})();
