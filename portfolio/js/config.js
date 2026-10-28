/* ==========================================================================
   config.js — the ONE place to tune animations & choose what animates.
   Loaded first; everything else reads window.PC.config.
   ========================================================================== */
window.PC = window.PC || {};
PC.config = {
  /* signature easing: same curve as --ease in css/tokens.css */
  ease: '0.625,0.05,0,1',

  /* text that reveals line-by-line in a mask (any CSS selector list) */
  lines: [
    '.hero h1', '.hero-lede',
    '.cs-hero h1', '.cs-hero .lede',
    '.section-head h2', '.section-head .desc',
    '.cs-section h2',
    '.cta-card h2', '.cta-card p',
    '.about-copy p'
  ].join(','),

  /* blocks that fade up when scrolled into view */
  fade: [
    '.hero .eyebrow', '.hero-actions',
    '.cs-hero .eyebrow', '.cs-tags', '.nda-note', '.snapshot',
    '.section-head .eyebrow',
    '.carousel',
    '.card', '.skill-block', '.stat-row', '.about-photo-wrap',
    '.cs-section .num',
    '.cs-section .content > p', '.cs-section .content > ul', '.cs-section .content > h3',
    '.cs-section .content > blockquote',
    '.audit-card', '.pillar-item', '.flow', '.result-card', '.ba-card',
    '.takeaway', '.visual-slot', '.strategy-quote', '.skills-tags',
    '.content > .kpi-row',
    '.cta-card .eyebrow', '.cta-actions'
  ].join(','),

  /* numbers that count up (only plain numbers like 18,349 · 62% · 3.5x) */
  counters: '.k-val, .big-number, .r-val',

  /* shown by the first-visit preloader */
  preloader: { name: 'PETER CADIMAS', tagline: 'Digital Marketing & Content' },

  /* tweakable numbers */
  fadeDistance: 36,
  fadeDuration: 1.1,
  lineDuration: 1.2,
  lineStagger: 0.09,
  headerHideAfter: 240
};
