/* ==========================================================================
   text-reveal.js — masked line-by-line headline/paragraph reveals.
   Which elements animate is controlled by PC.config.lines (config.js),
   or opt in/out per element with data-reveal="lines" / data-reveal="none".
   ========================================================================== */
(function () {
  var PC = window.PC;

  PC.text = {
    init: function () {
      var sel = PC.config.lines + ',[data-reveal="lines"]';
      PC.qsa(sel).forEach(function (el) {
        if (!PC.visible(el) || el.dataset.reveal === 'none' || el._pcSplit) return;
        el._pcSplit = true;

        SplitText.create(el, {
          type: 'lines',
          linesClass: 'line',
          autoSplit: true,            /* re-splits on resize / font load */
          onSplit: function (self) {
            self.lines.forEach(function (line) {
              if (line.parentNode.classList.contains('line-mask')) return;
              var mask = document.createElement('span');
              mask.className = 'line-mask';
              line.parentNode.insertBefore(mask, line);
              mask.appendChild(line);
            });
            if (el._done) return;     /* already revealed: leave text visible */
            el._lines = self.lines;
            gsap.set(self.lines, { yPercent: 115 });
          }
        });

        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: function () { PC.whenIntro(function (d) { PC.text.play(el, d); }, el); }
        });
      });
    },

    play: function (el, delay) {
      if (!el._lines) return;
      gsap.to(el._lines, {
        yPercent: 0,
        duration: PC.config.lineDuration,
        stagger: PC.config.lineStagger,
        delay: delay || 0,
        ease: 'pc',
        onComplete: function () {
          el._done = true;
          el.classList.add('is-done');
          gsap.set(el._lines, { clearProps: 'all' });
        }
      });
    }
  };
})();
