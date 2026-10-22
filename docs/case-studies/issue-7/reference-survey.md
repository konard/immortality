# Issue #7 — reference survey (Arwes, thegridcn, Soul Extract, glitchy.website, ZKN)

Issue: https://github.com/konard/immortality/issues/7

This survey compares the five references from the issue with what the app in `./app` already ships. It then picks the ideas that are still missing and gives an implementation sketch for each, followed by a short library survey.

Research date: 2026-10-22. Sources were read straight from GitHub (raw files and trees), from npm or bundlephobia, and from a live Playwright render where one was reachable. Anything I could not check directly is listed in "Unverified" at the end.

Status legend:

- **done**: already recreated.
- **partial**: something similar exists but is noticeably weaker.
- **missing**: not in the app.

---

## 0. What the app already has

Taken from `app/src/settings.ts` and `app/src/components/*` at commit `ddca4d7`. The working tree also has an in-progress `app/src/components/Select.tsx`.

- **Palettes:** mission, glitchy, amber, monochrome, tron, ares, clu, athena, aphrodite, poseidon, soulextract, matrix.
- **Canvas backgrounds** (`Starfield.tsx`): stars, square-grid, perspective-grid, galaxy, planet-orbit, star-orbit, asteroids, dots, moving-lines, puffs, circuit, data-rain, nebula.
  - `dots` is a box lattice lit by a radial wave from the centre.
  - `circuit` draws traces, endpoint rings and a travelling pulse.
- **Glow:** none, light, medium, heavy.
- **Frames:** corners, octagon, kranox, nefrex, lines, underline, hud, plain. These are measured SVGs drawn by `FrameShape.tsx`, with a corner-size slider.
- **Surfaces:** gradient, glass (`backdrop-filter: blur(10px) saturate(1.3)`), solid, transparent. There is no opacity control and no materials.
- **Density.**
- **Meters:** bar, segmented, ring.
- **Fonts:** system, mono, orbitron, chakra, electrolize, terminal.
- **Heading case.**
- **Text effects:** none, decipher, sequence, glitch.
- **Scanlines:** off, light, medium, heavy.
- **Toggles:** scan sweep, vignette, flicker, grain noise, global pointer illuminator, HUD status bar (system, sector, data year, UTC clock).
- **Intros:** none, boot, transmission. Transmission is the user-gesture gate, the equivalent of Soul Extract's "ENTER".
- **Charts:** line, area, glow, step. Grids: solid, dashed, dots, none. LineChart includes a scanner.
- **Entrances:** assemble, fade, scan, flicker, none. There is a stagger toggle and a speed control.
- **Sound:** a Web Audio synth (`sound.ts`).
  - Presets: spark, confirm, transmit, scanner, soft, pulse, typing, deploy, expand, static, silent.
  - Events: hover, activate, select, scan, open, type, intro.
  - Master volume control.
- **Presets and share links:** `#ui=` share hash.
- **Gaps relevant to the issue:**
  - Native `<select>` at `App.tsx:254` and `SettingsPanel.tsx:148/366`. Its popup cannot be themed. `Select.tsx` is being added to replace it.
  - `DataTable` and `Methodology` sections contain nothing but a `<details>`.
  - No `scrollbar-color` or `::-webkit-scrollbar` rule anywhere in `styles.css`.
  - `StatTile` shows only label, value, unit and hint.

---

## 1. Arwes — https://github.com/arwes/arwes (default branch `next`, MIT)

arwes.dev timed out from this sandbox, so everything below comes from the source in the GitHub repository.

| Element | Status | Notes | Source |
|---|---|---|---|
| FrameCorners / Octagon / Kranox / Nefrex / Lines / Underline | done | Already measured SVG frames | https://github.com/arwes/arwes/tree/next/packages/frames/src |
| **FrameNero** | missing | Filled background rect plus small filled corner squares (`cornerLength` 24, `cornerWidth` 2). On enter it flickers opacity `[0, 1, .5, 1]` | https://github.com/arwes/arwes/tree/next/packages/frames/src/createFrameNeroSettings |
| **FrameHeader** | missing | A header rule with a deco bar (`decoWidth` 4, `align`, `contentLength`, horizontal or vertical). Good for section titles | https://github.com/arwes/arwes/tree/next/packages/frames/src/createFrameHeaderSettings |
| **FrameCircle** | missing | A ring with side gaps (`sideWidth` 24, `separation`). Could frame the ring meter or avatars | https://github.com/arwes/arwes/tree/next/packages/frames/src/createFrameCircleSettings |
| styleFrameClipOctagon / Kranox | partial | The app draws the shapes but does not use clip-path to clip content or effects | https://github.com/arwes/arwes/tree/next/packages/frames/src |
| BG Dots (`type: box \| circle \| cross`, `origin`, `originInverted`) | partial | The app's dots are boxes only, with a centre wave. Missing: cross and circle types, and the one-shot reveal outward from a chosen origin | https://github.com/arwes/arwes/tree/next/packages/bgs/src/createBackgroundDots |
| **BG GridLines** (dashed) | missing | Canvas grid with `distance` 30, `lineWidth` 1, `horizontalLineDash [4]`, `verticalLineDash []`. The app's square grid is solid | https://github.com/arwes/arwes/tree/next/packages/bgs/src/createBackgroundGridLines |
| BG MovingLines / Puffs | done | | https://github.com/arwes/arwes/tree/next/packages/bgs/src |
| Text decipher / sequence | done | | https://github.com/arwes/arwes/tree/next/packages/text/src |
| **Text `blink` cursor** | missing | The React `Text` component shows a blinking cursor at the end of the text while the sequence runs (`blink`, `blinkDuration`) | https://github.com/arwes/arwes/tree/next/packages/react-text/src |
| Animator managers (parallel, stagger, staggerReverse, sequence, sequenceReverse, switch) | partial | The app only has stagger | https://github.com/arwes/arwes/tree/next/packages/animator/src |
| Illuminator (global) | done | | https://github.com/arwes/arwes/tree/next/packages/effects/src |
| **Illuminator clipped to a frame** | missing | The docs Button nests `Illuminator` inside `styleFrameClipOctagon`, so the glow stays inside the button shape | https://github.com/arwes/arwes/tree/next/apps/play/src (docs Button) |
| **styleSeparator** | missing | A gradient rule with bright end segments (`.5rem` wide, `.25rem` gap, direction left, right or both) | https://github.com/arwes/arwes/tree/next/packages/styles/src |
| **styleSteps / styleStrip** | missing | Stepped stripes and a repeating-linear-gradient hazard strip | https://github.com/arwes/arwes/tree/next/packages/styles/src |
| MenuItem underline scale-x on hover | missing | A bottom line that scales from `scaleX(0)` to `1` on hover and stays at 1 when active | https://github.com/arwes/arwes/tree/next/apps/docs |
| Docs background | partial | Blurred photo, radial gradient `#04252B → #001515`, Dots (`hsla(180,50%,70%,.15)`, size 2, distance 40, `originInverted`), Puffs ×20. The app has no layered photo or gradient behind its canvas | https://github.com/arwes/arwes/tree/next/apps/docs |
| Bleeps categories | missing | Categories: background, transition, interaction, notification, voice. Docs volumes: master .5, background .25, transition .5, interaction .75, notification 1. Uses `muteOnWindowBlur` | https://github.com/arwes/arwes/tree/next/packages/bleeps/src |
| Bleeps names | partial | click, open, close, error, info, intro, content, type (looped), hover, assemble. The app has no close, error/info, content or assemble sounds, and its typing sound does not loop | https://github.com/arwes/arwes/tree/next/apps/docs/public/assets/sounds |

## 2. thegridcn — https://github.com/educlopez/thegridcn-ui (branch `main`)

**License unknown:** there is no LICENSE file and the GitHub API reports license `null`. Use it only as visual inspiration and do not copy code.

| Element | Status | Notes | Source |
|---|---|---|---|
| **Select** | missing (in progress) | Button trigger in mono 10px uppercase with wide letter-spacing. Border at primary/20, rising to primary/40 plus a glow when open. Rotating chevron. Panel uses `bg-card/95`, `backdrop-blur-md` and a scanline overlay `repeating-linear-gradient(0deg, transparent 2px, rgba(0,0,0,.02) 2px 4px)`. At medium/heavy intensity, corner brackets come from `::before`. **It has no keyboard or ARIA support**, so copy only the look | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/select.tsx |
| **Scrollbar** | missing | `scrollbar-color: color-mix(in oklch, var(--primary) 55%, transparent) transparent; scrollbar-width: thin`. WebKit: width 10px; track tinted `color-mix(background 92%, primary 8%)` with a left border; thumb at primary 55% with `background-clip: padding-box`, a 2px transparent border and an inset glow; outer glow on hover/active | https://github.com/educlopez/thegridcn-ui/blob/main/src/app/globals.css (approx. lines 691-735) |
| **Data table** | partial | Header background primary 10%; header text 10px, weight 600, primary colour, uppercase, letter-spaced; row borders primary 20%; row hover primary 8%; cells coloured by threshold (green, amber, red) | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/data-table.tsx |
| **Slider** | missing | Track `h-1` at primary/10; filled part primary/40 with glow; ticks at 0/25/50/75/100; the native range input is invisible and a ring thumb is drawn on top | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/slider.tsx |
| Intensity levels none / light / medium / heavy | done | Same idea as the app's glow levels | https://github.com/educlopez/thegridcn-ui/blob/main/src/app/tron-style.css |
| **Stat card** (icon box, ▲/▼ delta, sparkline) | missing | The app's StatTile has none of these | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/stat-card.tsx |
| **StatsCounter** (rAF count-up) | missing | | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/stats-counter.tsx |
| **Radar** | missing | SVG with a rAF sweep. Targets fade over 120° after the sweep passes them | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/radar.tsx |
| **Reticle** (default / locked / scanning) | missing | | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/reticle.tsx |
| **DataStream log** (info / warn / error / success dots) | missing | | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/data-stream.tsx |
| **SignalIndicator bars** | missing | | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/signal-indicator.tsx |
| **Heatmap** with staggered reveal | missing | | https://github.com/educlopez/thegridcn-ui/blob/main/src/components/thegridcn/heatmap.tsx |
| Gauge / progress ring | done | | https://github.com/educlopez/thegridcn-ui/tree/main/src/components/thegridcn |
| Boot sequence, CRT effect, grid floor | done | The app has the boot intro, scanlines with flicker, and the perspective grid | same tree |
| Status bar / uplink header | done | The app's HudBar | same tree |
| Scanline overlay on every panel | partial | The app's scanlines are global only, not per panel | `tron-style.css` |
| Countdown / derez timer, timeline, stepper, kbd, tabs, tooltip, toast | missing | Lower priority | same tree |

## 3. Soul Extract — https://github.com/soulextract/soulextract.com (GPL-3.0, Gatsby, anime.js, Howler)

**GPL-3.0:** re-implement the ideas, do not copy the code.

| Element | Status | Notes | Source |
|---|---|---|---|
| Palette | done | `soulextract` | https://soulextract.com |
| ENTER / "uses sounds" gate | done | The app's transmission intro | https://github.com/soulextract/soulextract.com/tree/master/src/components |
| **Background line rows** | missing | 1px horizontal lines every 10px over a radial light (secondary at .1 alpha, 25% radius) | https://github.com/soulextract/soulextract.com/tree/master/src/components/Background |
| **Dotted rails** | missing | One random dotted vertical line per 100px column and one dotted horizontal line per 200px row, with `stroke-dasharray: 3 7` | same |
| Circuit lines with travelling light | partial | Source polylines are scaled from a 1000×600 design, with end dots and a light that moves along them on standby. The app has a circuit background but neither the dotted rails nor the line rows | same |
| **Rail end ticks "//"** | missing | Yellow slanted double ticks at the four ends of the content rails (seen on the live site) | https://soulextract.com |
| Header slide-down with stroke-draw | partial | `translateY(-100% → 0)`, lines animated with `stroke-dashoffset`, plus the deploy sound. The app's assemble entrance is similar but does not draw strokes | https://github.com/soulextract/soulextract.com/tree/master/src/components/Header |
| Menu `scaleY` reveal plus pipe separators | missing | Menu items scale in vertically and are separated by yellow `|`. Plays the expand sound | https://github.com/soulextract/soulextract.com/tree/master/src/components/Menu |
| **Blink-in fader** | partial | Opacity keyframes 1 (t/3) → 0 (t/5) → 1 (t/2) with a "fade" sound. The app's flicker entrance is similar but has no sound and different timing | https://github.com/soulextract/soulextract.com/tree/master/src/components/Fader |
| Popup corner paths (100×40 viewBox, `preserveAspectRatio="none"`, stroke-draw) | partial | The intro modal uses frames but does not draw them in | https://github.com/soulextract/soulextract.com/tree/master/src/components/Popup |
| Button | partial | Background secondary at .125 alpha; frame path with stroke 2 and `vector-effect: non-scaling-stroke`; hover switches to the tertiary colour | https://github.com/soulextract/soulextract.com/tree/master/src/components/Button |
| Text transition / transform | done | The app's sequence and decipher effects. Soul Extract's random character set is `$#%&!()=/*-_.` plus alphanumerics | https://github.com/soulextract/soulextract.com/tree/master/src/components/Text |
| Sounds: logo, start (.15), typing, fade, deploy, expand, hover, click, transmission; master .3 | partial | The app synthesises similar sounds. It has no separate logo, fade or start sounds, and only one sound per event | https://github.com/soulextract/soulextract.com/tree/master/static/sounds |

## 4. glitchy.website — https://glitchy.website

Built on Arwes v1 (puffs keyframes, `arwes-words-blink` at 250ms step-end, rotating loading circles at 750ms). Fonts are Electrolize and Titillium Web. Palette: `#c45cd6`, `#e2aeeb`, `#9129a3`, `#2a2033`. These details come from the HTML and JS bundle fetched with curl.

| Element | Status | Notes | Source |
|---|---|---|---|
| Purple palette | done | `glitchy` | https://glitchy.website |
| "Willkommen." / "Initializing Human Interface…" boot text | done | The boot intro | https://glitchy.website |
| Arwes v1 words-blink cursor | missing | Same idea as the Arwes `blink` cursor above | site CSS bundle |
| Loading circles (two rings rotating over 750ms) | missing | Could replace the "loading" state of the intro | site CSS bundle |
| **Audio-reactive canvas** | missing | Howler plus an `AnalyserNode` with 256 bins.<br>- A large wavy "immortal" circle runs throughout (r = 0.8 × min(w,h), `rgba(210,159,212,.07)`).<br>- `pulselow`: bins 0-2% above 242 spawn an expanding wavy circle from the bottom.<br>- `pulsehigh`: bins 70-100% above 178 spawn 6 particles in hit colour `rgba(230,112,235,.3)`.<br>- `tinkle`: bins 80-100% | site JS bundle |
| Corner frame | done | | |

## 5. ZKN — https://zknet.io/features/app-chain

Rendered with Playwright. The DOM shows Arwes classes: `arwes-bgs-dots`, `arwes-frames`, `arwes-text`, and FrameOctagon "bookmarks". Fonts are Orbitron, Chakra Petch and JetBrains Mono.

| Element | Status | Notes | Source |
|---|---|---|---|
| **Notched header/footer** | missing | `clip-path: polygon(0 0, calc(50% - 80px) 0, calc(50% - 64px) 8px, calc(50% + 64px) 8px, calc(50% + 80px) 0, 100% 0, 100% 100%, 0 100%)` at the top, mirrored at the bottom | live DOM (computed style) |
| Single clipped corner | partial | `polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)`. Close to the app's octagon frame, but the app draws a shape instead of using clip-path | live DOM |
| **Scroll-container fade mask** | missing | `mask-image: linear-gradient(transparent 0%, #000 10%, #000 90%, transparent)` | live DOM |
| Drop-shadow glows | done | `filter: drop-shadow(rgba(55,217,55,.5) 0 0 16px)`, up to 100px | live DOM |
| Nav links with a background that grows on hover | missing | `scaleX` transition over .2s | live DOM |
| **Breadcrumb title** with a vertical accent bar and a chamfered rule | missing | Similar in spirit to the Arwes FrameHeader | live render |
| Corner "▫▫▫" squares and dotted rows as decoration | missing | | live render |
| Dashed vertical side rail | missing | | live render |
| Pager: « » arrows plus FrameOctagon tabs with an active underline | missing | | live render |
| Header sound toggle icon | partial | The app's mute lives in the settings drawer | live render |
| Background: box-dot matrix, large-cell grid, data rain, radial green glow | partial | The app has each layer, but only one background at a time. ZKN stacks them | live render |
| Isometric glowing node-orbit diagram | missing | Optional decoration | live render |

---

## 6. Top 15 missing ideas, with implementation sketches

They are ordered by how directly they answer the issue, then by effort.

1. **Themed, accessible Select** (issue: "styled dropdowns"). `Select.tsx` is in progress.
   - Structure: a WAI-ARIA select-only combobox (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/). A button with `role="combobox"`, `aria-expanded` and `aria-controls` owns a `ul[role=listbox]` of `li[role=option]` with `aria-selected`. Use `aria-activedescendant` to track the active option.
   - Keys: arrow keys, Home/End, typeahead, Enter/Space, Escape, and Tab to close.
   - Look (gridcn): the panel uses the `--surface` background and a 2-4px scanline `repeating-linear-gradient` overlay. Add a corner bracket in `::before`, a chevron with `transform: rotate(180deg)` when open, and an accent glow on the active option.
   - Sound: `sounds.select()` on commit and `hover` on active change.
   - Placement: the panel is `position:absolute`. Flip it upward when `getBoundingClientRect().bottom + h > innerHeight`.
   - Optional progressive enhancement: `@supports (appearance: base-select)` with `::picker(select)`, Chrome 135+ only (https://developer.chrome.com/blog/a-customizable-select). Not enough on its own.

2. **Themed scrollbars**, for the data table and everywhere else.

   ```css
   * { scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--accent) 55%, transparent) transparent; }
   ::-webkit-scrollbar { width: 10px; height: 10px; }
   ::-webkit-scrollbar-track { background: color-mix(in srgb, var(--bg) 92%, var(--accent) 8%); border-left: 1px solid color-mix(in srgb, var(--accent) 20%, transparent); }
   ::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--accent) 55%, transparent) padding-box; border: 2px solid transparent; box-shadow: inset 0 0 6px var(--accent); }
   ::-webkit-scrollbar-thumb:hover { background-color: var(--accent); }
   ```

   - The `::-webkit-scrollbar` rules are ignored in Chrome 121+ wherever the standard `scrollbar-*` properties apply (https://developer.chrome.com/docs/css-ui/scrollbar-styling). They remain useful for Safari before 26.2 and older Chromium.
   - Add the ZKN fade mask on the scroll container, gated on overflow: `mask-image: linear-gradient(transparent, #000 1.5rem, #000 calc(100% - 1.5rem), transparent)`.

3. **Table styling, and no expandable-only sections** (issue).
   - Render the table directly instead of inside `<details>`. Use a sticky `thead` with a 10% accent tint, 10px uppercase letter-spaced headers, row borders at accent 20%, and row hover at accent 8%.
   - Colour cells by threshold using `data-level="ok|warn|bad"`.
   - Give Methodology a FrameHeader-style title and show its text directly. If it is long, split it into two columns or use tabs.

4. **Materials plus a transparency slider** (issue: "transparency, wood, steel"). This is not in any reference, so it has to be designed here.
   - Add a `surfaceOpacity` setting (0.2-1) and set `--surface-alpha` from it.
   - Add surfaces built only from CSS layers:
     - steel: `repeating-linear-gradient(90deg, #fff1 0 1px, #0001 1px 3px), linear-gradient(180deg, #8a9099, #4a4f57)`;
     - carbon: two `repeating-linear-gradient(45deg/-45deg)` checker layers;
     - wood: inline SVG `feTurbulence baseFrequency="0.02 0.4" numOctaves=3` plus `feColorMatrix` to brown, as a data-URI `background-image`, over `linear-gradient` grain;
     - brushed titanium;
     - frosted acrylic: glass plus noise.
   - Mix each with `color-mix(in srgb, <material> calc(var(--surface-alpha)*100%), transparent)`, or put the material on a `::before` layer with `opacity: var(--surface-alpha)`.
   - Lea Verou's CSS3 Patterns (MIT) has ready-made gradient patterns: https://projects.verou.me/css3patterns/

5. **Sound variety: several variants per event, not named after actions** (issue).
   - Make each event map to an array of 3-5 synth recipes. Each play picks one at random, avoiding an immediate repeat, and adds ±3% detune and ±10% gain jitter.
   - Rename the presets to evocative, non-action names (for example "Quartz", "Relay", "Ion", "Halcyon").
   - Higher fidelity:
     - layered partials (FM: a modulator oscillator into `carrier.frequency`);
     - a short `ConvolverNode` reverb from a generated decaying-noise impulse;
     - a `DynamicsCompressorNode` on the master bus;
     - a `WaveShaperNode` for gentle saturation.
   - Arwes Bleeps-style categories (interaction .75, transition .5, notification 1, background .25), each with its own volume slider.
   - Mute when the window loses focus (`muteOnWindowBlur`).
   - New events: close, error, info, content, assemble, plus a looping type sound while text effects run.

6. **Fix glitchy borders and fog** (issue).
   - Borders: give FrameShape strokes `vector-effect: non-scaling-stroke` as Soul Extract does, round SVG coordinates to `.5` for 1px lines, and redraw on `ResizeObserver` instead of on layout guesses.
   - Fog (puffs and nebula): draw radial gradients into an offscreen low-resolution canvas, then upscale with `imageSmoothingQuality = 'high'` to avoid banding. Add a little noise dither. Clamp alpha and cap the number of puffs.

7. **Arwes FrameNero, FrameHeader and FrameCircle** as new frame options in `frameGeometry` / `FrameShape.tsx`.
   - Nero: a background rect plus 4 filled `cornerLength × cornerWidth` L-squares, with a `[0, 1, .5, 1]` opacity flicker on enter.
   - Header: a horizontal line plus a 4px deco block at the aligned end. Use it for panel titles.

8. **Arwes style helpers as CSS classes:**
   - `.sep` (styleSeparator): `linear-gradient(to right, var(--accent) .5rem, transparent .5rem .75rem, color-mix(...) .75rem calc(100% - .75rem), transparent ..., var(--accent) calc(100% - .5rem))`, 1px high;
   - `.steps`: stepped `repeating-linear-gradient` bars;
   - `.strip`: hazard stripes `repeating-linear-gradient(-45deg, var(--warn) 0 6px, transparent 6px 12px)` for warnings.

9. **Blinking cursor for text effects** (Arwes `blink`, glitchy words-blink).
   - While FxText sequence or decipher runs, append `<span class="fx-caret" aria-hidden>▌</span>`.
   - Animate it with `@keyframes blink { 50% { opacity: 0 } }` at 250ms `step-end`, and remove it on completion.

10. **Per-element illuminator clipped to the frame.**
    - On buttons and panels, track the pointer with `--mx`/`--my` from `pointermove` relative to `getBoundingClientRect`.
    - Paint `radial-gradient(120px at var(--mx) var(--my), color-mix(in srgb, var(--accent) 25%, transparent), transparent)` on `::after`.
    - Clip it with `clip-path: polygon(...)` built from the same chamfer as the frame (octagon: `polygon(var(--c) 0, 100% 0, 100% calc(100% - var(--c)), calc(100% - var(--c)) 100%, 0 100%, 0 var(--c))`).

11. **Soul Extract "rails" background:**
    - 1px line rows every 10px at very low alpha;
    - per 100px column, one random dotted vertical rail with `setLineDash([3, 7])`; per 200px row, one horizontal rail;
    - the existing circuit lights travelling along the rails;
    - a radial light at 25%.
    - Also add "//" slanted ticks (two small skewed rects) at the ends of the page-section rails.

12. **Arwes GridLines and richer Dots:**
    - New `grid-lines` background using `setLineDash([4])` for horizontal lines and solid verticals, distance 30.
    - Extend `drawDots` with `type: box | circle | cross` (a cross is two 1px rects) and a one-shot reveal from an origin. A dot's alpha ramps once `time × speed > distance(origin)`, with `originInverted` running the reveal from the edges inward.
    - Optionally stack layers ZKN-style (dots + grid + rain + radial glow).

13. **Richer StatTile** (gridcn stat-card and stats-counter):
    - an icon box;
    - a ▲/▼ delta coloured ok or bad;
    - an inline SVG sparkline polyline under the value;
    - a count-up animation with rAF easing from 0 to the value over about 900ms, skipped under reduced motion or when motion is off.

14. **ZKN and Arwes navigation chrome:**
    - notched header/footer via the clip-path above;
    - a breadcrumb title with a vertical 3px accent bar and a chamfered rule;
    - nav underline `transform: scaleX(0 → 1)` with `transform-origin: left` over .2s;
    - « » pager plus octagon tabs if sections become paged.

15. **Audio-reactive background** (glitchy.website).
    - Route the synth master through an `AnalyserNode` (`fftSize` 512, so 256 bins). Each frame, read `getByteFrequencyData`.
    - Low bins above a threshold spawn an expanding wavy ring (radius r, plus `sin(θ·k + t) × amp` per vertex).
    - High bins spawn short-lived particles.
    - A permanent faint wavy main circle with r = 0.8 × min(w,h).
    - With synthesised UI sound this only reacts to clicks. Pair it with an optional ambient drone in the "background" category at .25 volume, off by default.

Smaller extras:

- Soul Extract blink-in "fader" entrance (1 → 0 → 1 opacity at t/3, t/5, t/2) with a fade sound.
- Arwes `sequence` and `staggerReverse` entrance order options.
- gridcn custom slider (tick marks, glowing fill, ring thumb) for the volume, speed and opacity controls.
- gridcn Radar, Reticle, DataStream log, SignalIndicator and Heatmap widgets.
- Per-panel scanline overlay.
- Better backgrounds and gradients (issue): layer a radial gradient (Arwes docs: `radial-gradient(#04252B, #001515)` adapted per palette) under every canvas mode, and add a slow conic or mesh gradient option made of 3-4 blurred radial blobs drifting over time.

---

## 7. Library survey

The project is React 18 only, with no UI libraries. Versions and licenses come from the npm registry (October 2026). Sizes are bundlephobia figures for the whole package, minified / gzipped, before tree-shaking, unless noted otherwise.

| Category | Library | URL | License | Size (min / gz) | Recommendation |
|---|---|---|---|---|---|
| Select / listbox | @radix-ui/react-select 2.4.1 | https://www.radix-ui.com/primitives/docs/components/select | MIT | 90.7 KB / 30.4 KB | Excellent accessibility, but it pulls in a portal and popper stack. Too heavy for one control |
| Select / listbox | @headlessui/react 2.2.10 (Listbox) | https://headlessui.com/react/listbox | MIT | 209 KB / 63 KB (whole package) | Not worth it for one listbox |
| Select / listbox | downshift 9.4.0 (`useSelect`) | https://github.com/downshift-js/downshift | MIT | 54 KB / 15.5 KB | Lightest headless option. Use it only if the hand-rolled version proves buggy |
| Select / listbox | react-aria 3.53.1 (`@react-aria/select` 3.18.1) | https://react-spectrum.adobe.com/react-aria/useSelect.html | Apache-2.0 | 647 KB / 179 KB (whole package) | Best accessibility, far too heavy here |
| Select / listbox | @ariakit/react 0.4.42 | https://ariakit.org/components/select | MIT | 210 KB / 66 KB | Too heavy |
| Positioning | @floating-ui/react | https://floating-ui.com | MIT | 90 KB / 30.8 KB | Not needed: a simple flip-up check is enough |
| Select / listbox | Native `appearance: base-select` | https://developer.chrome.com/blog/a-customizable-select | n/a | 0 | Chrome 135+ only. At most a progressive enhancement |
| **Select: recommended** | Hand-rolled (~150 lines) following the WAI-ARIA APG select-only combobox | https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/ | n/a | about 2 KB | **Recommended.** Matches the zero-dependency policy and can be fully themed |
| Scrollbar | overlayscrollbars 2.17.0 plus overlayscrollbars-react 0.5.7 | https://kingsora.github.io/OverlayScrollbars/ | MIT | not measured | Fully custom overlay scrollbars. Overkill here |
| Scrollbar | simplebar 6.3.3 / simplebar-react 3.3.2 | https://github.com/Grsmto/simplebar | MIT | about 6 KB min (README claim) | Keeps native scrolling. Optional if the native styles look too plain on macOS overlay scrollbars |
| **Scrollbar: recommended** | Native `scrollbar-color` / `scrollbar-width` plus `::-webkit-scrollbar` | https://developer.chrome.com/docs/css-ui/scrollbar-styling | n/a | 0 | **Recommended.** Chrome/Edge 121+, Firefox 64+, Safari 26.2 (per Chrome docs); `::-webkit-` fallback for older Safari |
| UI sound | howler 2.2.4 | https://howlerjs.com | MIT | 36.5 KB / 9.7 KB | Only useful if switching to sample files. Arwes Bleeps, Soul Extract and glitchy all use Howler |
| UI sound | use-sound 5.0.0 | https://github.com/joshwcomeau/use-sound | MIT | under 1 KB gz plus Howler (~10 KB) loaded async | React wrapper around Howler. Same verdict as Howler |
| UI sound | tone 15.1.22 | https://tonejs.github.io | MIT | 337 KB / 76.6 KB | Rich synths, effects and reverb, but heavy. Plain Web Audio can do the same |
| UI sound | zzfx 1.4.0 | https://github.com/KilledByAPixel/ZzFX | MIT | under 1 KB | **Good fit.** A parametric sound generator for a large variety of non-repeating synthesised blips. It can also be vendored as one function |
| UI sound | jsfxr 1.4.1 | https://github.com/chr15m/jsfxr | Unlicense | small (not measured) | sfxr presets (pickup, laser, blip). Good for generating variants |
| UI sound | @arwes/bleeps 1.0.0-next.25020502 | https://github.com/arwes/arwes/tree/next/packages/bleeps | MIT | not measured | Copy only the category, volume and `muteOnWindowBlur` model. It is a pre-release that expects audio files |
| Frames / backgrounds / text | @arwes/frames, @arwes/bgs, @arwes/text, @arwes/react 1.0.0-next.25020502 | https://github.com/arwes/arwes | MIT | not measured | Pre-release. Keep re-implementing; the code can serve as an MIT reference |
| Materials / textures | Lea Verou CSS3 Patterns | https://projects.verou.me/css3patterns/ (https://github.com/LeaVerou/css3patterns) | MIT | 0 (copy CSS) | **Recommended** source for carbon, checker and stripe gradients |
| Materials / textures | SVG `feTurbulence` (native) | https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence | n/a | 0 | **Recommended** for wood grain, brushed metal and paper noise as data URIs |
| Canvas backgrounds | Native Canvas 2D (current approach) | | n/a | 0 | Keep it. The existing Starfield architecture already supports adding modes |

---

## 8. Unverified / caveats

- **arwes.dev** timed out (`ERR_CONNECTION_TIMED_OUT`) from both Playwright and curl, so I did not check the live Arwes docs. The Arwes rows rely on the `next` branch source, and paths below `packages/*/src` are approximate.
- **thegridcn license:** not found (no LICENSE file, GitHub API reports `null`). Treat the code as all rights reserved and use it only as visual reference.
- **Soul Extract is GPL-3.0.** Re-implement its ideas; do not copy code into this repository.
- **Some bundlephobia queries failed** (rate limit or non-JSON response). overlayscrollbars, jsfxr, zzfx and the @arwes/* packages have no measured size. The simplebar "6 KB" figure is the README's claim.
- **Safari support for `scrollbar-color` / `scrollbar-width`:** sources disagree (Safari 18.2 versus 26.2). The Chrome docs say 26.2.
- **ZKN scrollbar:** I could not tell whether ZKN hides or styles its scrollbar. It appeared native in the headless render.
- **glitchy.website:** the thresholds and colours come from reading the minified JS bundle. I did not watch the visualiser react, because there was no audio in headless mode.
- **Line references** (for example thegridcn `globals.css` 691-735) are as of the `main` branch on the research date.
- **Playwright screenshots** from this research were saved under the repository's `.playwright-mcp/` folder and should not be committed.
