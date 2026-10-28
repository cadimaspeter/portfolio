/* ==========================================================================
   main.js — boots everything, in order. Edit js/config.js to tune; edit
   this file only to add or remove whole features.
   ========================================================================== */
(function () {
  var PC = window.PC;
  var root = PC.root;

  function plain() {            /* no animation: show the page as-is */
    root.classList.add(PC.reduced ? 'reduced' : 'no-gsap', 'ready');
    PC.interactions.roll();
    PC.interactions.menu();
    PC.carousel.init();
  }

  function boot() {
    if (!PC.canAnimate) { plain(); return; }
    try {
      PC.setupGsap();
      PC.interactions.roll();
      PC.smooth.init();
      PC.transition.build();
      PC.transition.bind();
      root.classList.add('ready');          /* lifts the CSS cover; overlay now covers */

      PC.text.init();
      PC.scroll.init();
      PC.interactions.menu();
      PC.interactions.cursor();
      PC.carousel.init();

      ScrollTrigger.refresh();
      if (location.hash) PC.goToAnchor(location.hash, true);   /* arrive at #section after layout settled */

      PC.preloader.play();
    } catch (err) {
      console.error('[PC] animation boot failed, showing static page:', err);
      PC.state.introPlayed = true;
      if (window.gsap) gsap.killTweensOf('*');
      var pt = PC.qs('.pt'); if (pt) pt.remove();
      PC.qsa('.line-mask').forEach(function (m) { m.style.overflow = 'visible'; });
      root.classList.add('no-gsap', 'ready');
      PC.qsa(PC.config.fade).forEach(function (el) { el.style.opacity = ''; el.style.visibility = ''; el.style.transform = ''; });
      PC.qsa('.line').forEach(function (l) { l.style.transform = ''; });
    }
  }

  /* wait (briefly) for web fonts so lines split at their final width */
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1500); })]).then(boot);
})();
