# Peter Cadimas — Portfolio

Open `index.html` (double-click works; no build step, no server needed).

## Where to edit
| I want to change…                         | Edit this                                   |
|-------------------------------------------|---------------------------------------------|
| Colors, fonts, spacing, easing            | `css/tokens.css`                            |
| Header, buttons, CTA card, footer         | `css/components.css`                        |
| Any animation style (hovers, cursor…)     | `css/motion.css`                            |
| Home page layout                          | `css/home.css` + `index.html`               |
| Case-study layout (all 4 pages at once)   | `css/case-study.css`                        |
| WHAT animates, speeds, distances          | `js/config.js`                              |
| Preloader name / tagline                  | `js/config.js` → `preloader`                |
| Carousel behaviour                        | `js/carousel.js`                            |

## Animation attributes (optional, in HTML)
- `data-reveal="lines"` / `"fade"` / `"clip"` — opt an element in; `data-reveal="none"` — opt out
- `data-parallax="10"` — drift ±10% on scroll
- `data-cursor="VIEW"` — label bubble on the custom cursor

## Notes
- Unused placeholder blocks (e.g. "Suggested Visual") are kept but hidden with the `hidden` attribute; delete the attribute to show one.
- Libraries live in `js/vendor/` (GSAP 3.13, Lenis 1.3.1) so the site works offline.
- Respects `prefers-reduced-motion`; if scripts fail the page shows normally.
