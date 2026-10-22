# Case study: issue #7, "Double check correctness of all conclusions about immortality"

- Issue: https://github.com/konard/immortality/issues/7 (raw data: [`issue.json`](issue.json);
  the issue has no comments, see [`issue-comments.json`](issue-comments.json))
- Pull request: https://github.com/konard/immortality/pull/8 (snapshot: [`pr-8.json`](pr-8.json))
- Research date: 2026-10-22

This folder holds the collected data and the analysis behind the pull request:

| File | Contents |
| --- | --- |
| [`science-verification.md`](science-verification.md) | Claim-by-claim re-verification of every scientific statement in the repository: the CRISPR document, the dashboard verdict and methodology text, and the LEV metric. Each claim gets a verdict (Confirmed / Corrected / Outdated / Unconfirmed-single-study / Speculative) and primary sources. |
| [`reference-survey.md`](reference-survey.md) | UI reference survey (Arwes, thegridcn, Soul Extract, glitchy.website, ZKN): what each does, what the app lacked, the 15 most valuable missing ideas, and a survey of existing libraries. |
| `issue.json`, `issue-comments.json`, `pr-8.json` | Raw GitHub data captured for this case study. |

## 1. Requirements inventory

Every sentence of the issue, split into requirements and mapped to the plan, the
implementation and the evidence. Statuses are **Done** (implemented and verified),
**Done, with differences** (implemented in a different way than first sketched, explained
below) or **Not applicable** (with the reason).

| # | Requirement (issue text) | Solution | Evidence | Status |
| --- | --- | --- | --- | --- |
| R1 | "double check all latest news, question everything and reverify the actual state of things" | Every claim in `CRISPR-Autologous-Gene-Therapy.md`, the dashboard verdict (`app/src/App.tsx`) and `app/src/analytics.ts` was rechecked against regulator notices, ClinicalTrials.gov (API v2), SEC filings and peer-reviewed papers, with status as of October 2026. | [`science-verification.md`](science-verification.md): claims 1.1–1.12, 2a–2e and 3, with a verdict each. | Done |
| R2 | "use references to lots of research papers" | The verification cites 108 numbered sources. Every journal DOI was resolved through the Crossref API, and guessed DOIs that resolved to unrelated papers were dropped. | `science-verification.md` › References; DOI method in "Method and rules used". | Done |
| R3 | "base our conclusions in consensus established by multiple papers from different countries" | A consensus rule: a conclusion is *likely* only when independent groups, ideally in different countries, agree. The dashboard text now cites multi-group evidence (UN WPP 2024, GBD 2021, Oeppen & Vaupel 2002, Vaupel et al. 2021). | `science-verification.md` claims 2b–2d and 3; `app/src/App.tsx` verdict text. | Done |
| R4 | "not treat any single paper without multiple confirmations … as likely outcome" | A verdict class, **Unconfirmed-single-study**. Single-study results (early in vivo editing reports, single-trial aging interventions) are labelled as such. The app no longer calls them breakthroughs and states that no therapy is approved to slow or reverse aging. Items that could not be checked are listed explicitly instead of being assumed. | `science-verification.md` claim 2d and "Items that could not be verified" (10 items). | Done |
| R5 | Fix the conclusions that turned out wrong | The CRISPR document was corrected: Casgevy disrupts the *BCL11A* enhancer instead of inserting a template; no virus, so not "infect"; the trial number was mislabelled; EDIT-101 method and status; the NTLA-2001 Phase 3 hold and its lifting; the two NICE decisions. The dashboard now calls LEV a *proxy* (period e0 gain ≥ 1 yr/yr, not de Grey's actuarial definition). The peak-velocity explanation is no longer hard-coded as the same story for every country. | Commits `a022c3a` (CRISPR document) and `4db0477` (`App.tsx`, `analytics.ts`). A corrections box sits at the top of `CRISPR-Autologous-Gene-Therapy.md`. | Done |
| R6 | Default UI/UX: `{"palette":"poseidon","glow":"medium","surface":"transparent","density":"spacious","meter":"segmented","font":"orbitron","textEffect":"sequence","background":"perspective-grid","statusBar":true,"intro":"boot","chartStyle":"area","chartGrid":"dashed","entrance":"scan","stagger":true}` | `DEFAULT_SETTINGS` in `app/src/settings.ts` is exactly this configuration. First-release storage and share links migrate against the old base (`LEGACY_V1_BASE`), so they still show the look that was shared. "Restore defaults" returns to it, and "Poseidon" is the first preset. | `settings.test.ts`: "uses the default look requested in issue #7", "migrates first-release storage…", "keeps first-release share links showing the look that was shared"; [screenshot](../../screenshots/dashboard-world.png). | Done |
| R7 | "transparency of any material should be configured" | The panel material is drawn on its own `.frame-material` layer, so a **Material opacity** slider (0–100%) and a **Backdrop blur** slider (0–32px) apply to *every* material, including glass, flat and the textured ones. | `settings.test.ts` "offers wood, metals and other materials with a configurable opacity"; `styling.test.ts` "gives every surface a material…". | Done |
| R8 | "more materials like wood, steel and others" | 13 materials (main had 4): gradient, glass, frosted, flat, transparent, brushed steel, brass, copper, walnut wood, carbon fibre, holographic, black marble and concrete. They are built with CSS gradients and SVG `feTurbulence` noise (no image assets), with a text shadow and brighter muted ink on textured panels for readability. Two presets show them: Foundry (steel and brass) and Study (walnut). | [materials.png](../../screenshots/materials.png), [preset-foundry.png](../../screenshots/preset-foundry.png), [preset-study.png](../../screenshots/preset-study.png). | Done |
| R9 | "All UI elements should be fully styled … drop down lists …" | Native `<select>` was replaced by a skinned WAI-ARIA select-only combobox (`app/src/components/Select.tsx`, about 230 lines). It supports keyboard navigation and type-ahead, flips up near the viewport edge, makes sounds, and takes the palette, font, glow, material and chamfer from the skin. It is used for the entity picker and every settings list. | [select-open.png](../../screenshots/select-open.png); `styling.test.ts` "no longer styles native selects…". | Done |
| R10 | "… data table … its scroll bar …" | The data table has four styles (lined, zebra, grid, terminal), a sticky header that stays bordered while scrolling, and tabular numerals. **Scrollbars** have three skinned styles (thin, HUD rail, block) for the page, the table, the drawer and the select list. They use `scrollbar-color` / `scrollbar-width`, with `::-webkit-scrollbar` for WebKit. | [data-table.png](../../screenshots/data-table.png); `styling.test.ts` "styles every non-default tableStyle / scrollbarStyle option". | Done |
| R11 | "… and so on" (every other element) | Sliders, toggles, buttons, tabs, the status bar, the gauge, stat tiles, focus rings, the intro and the settings drawer all read the same CSS variables. The CSS-axis test requires a rule for every non-default option of every visual axis, so new options cannot ship unstyled. | `styling.test.ts` "styles every non-default … option" (one case per CSS-driven axis). | Done |
| R12 | "more high fidelity sounds that sound perfectly" | Sound engine v2 (`app/src/sound.ts`), all synthesized with Web Audio: 26 sounds built from layered oscillators, FM, filtered noise and envelopes. The master bus has a high shelf (tone), a convolution room reverb, a limiter, per-play pitch variation and optional pointer-positioned stereo. | `experiments/sound-render.js` renders every sound through the real bus with `OfflineAudioContext`, worst case three overlapping plays: nothing clips (highest peak 0.895, "Mica") and nothing is silent. | Done |
| R13 | "multiple sounds per action to be configurable" | Each of the 10 interaction types (hover, buttons, switches, selections & sliders, chart scanner, open, close, text effects, intro, notifications) maps to a *list* of sounds. They play at random (never repeating the previous pick), in turn, or layered. | `settings.test.ts` "maps one or more sounds to every interaction", "picks according to the multi-sound mode", "never repeats the previous random pick…"; [settings-drawer-audio.png](../../screenshots/settings-drawer-audio.png). | Done |
| R14 | "sounds should not be named to actions they represent" | Sounds have neutral names describing their character (Quartz, Cobalt, Comet, Ion, …, Sonar, Vesper, Relay). Old action-named ids in saved settings are migrated. | `settings.test.ts` "names sounds by character, not by the action they play on" (checks every name against every action word); "normalizes sound lists, including first-release single sound ids". | Done |
| R15 | "make UI/UX configuration much more detailed, so there are more options" | 49 axes in 7 groups (main had 28), 12 presets (main had 8), randomize and share links. New axes include material opacity and blur, border width, panel shadow, chamfer size, text size, heading case, title decoration, section dividers, backdrop gradient, background intensity and speed, vignette, flicker, film grain, illuminator, chart line width, sparklines, counting numbers, panel hover, cursor, table style, scrollbar style, animation speed, volume, tone, reverb, pitch variation, stereo and the multi-sound mode. | `experiments/list-axes.ts` prints the whole catalog; `settings.test.ts` "describes every scalar setting with exactly one schema axis". | Done |
| R16 | "Quality of backgrounds and gradients especially can be increased" | 21 canvas backgrounds (main had 13), adding aurora curtains, warp drive, hex lattice, radar sweep, constellation network, Arwes grid lines, Soul Extract signal rails and a sound-resonance ring. There are 6 full-screen backdrop gradients (horizon glow, deep space, aurora wash, nebula wash, synth sunset, abyss), and intensity and speed sliders. | Preset screenshots in [`docs/screenshots`](../../screenshots). | Done |
| R17 | "Double check UI ideas and elements we didn't recreate from all our references" | A fresh survey of all five references (`reference-survey.md` §1–5) produced a ranked list of 15 missing ideas (§6). All 15 were implemented or explicitly ruled out; see section 3 below. | `reference-survey.md` §6; section 3 of this file. | Done |
| R18 | "bad idea to have sections which contain only expandable elements" | The Methodology and Data table sections were `<details>` disclosures. They now show their full content directly, and the table scrolls inside its own skinned container. | `styling.test.ts` "no longer styles native selects or expandable sections"; [data-table.png](../../screenshots/data-table.png). | Done |
| R19 | "configurations for borders and panels look glitchy … double check how they look, and how it was intended" | Root cause: the entrance animations used `animation-fill-mode: both`, which left `clip-path` and transforms on finished panels, so borders were clipped or offset. Entrances now use `backwards`, and stagger delays are cancelled after the entrance. The drawer's bottom corner brackets were pinned to the viewport, and the SVG frames were re-measured. All presets and frames were inspected in a browser. | `styling.test.ts` "keeps entrance animations from leaving clip-path or transforms…", "cancels animation delays…", "pins the scrolling drawer material and bottom corners…"; preset screenshots. | Done |
| R20 | "full screen fog does glitch by appearing and disappearing" | Root cause: the "screen flicker" overlay used `steps(1)` keyframes with white flashes, which read as fog popping in and out. It now breathes smoothly (an ease-in-out radial glow in the palette colour, screen blend). The canvas fogs (nebula, puffs) were checked: their alpha follows `sin(t·π)`, so they fade in and out without popping. | `styling.test.ts` "breathes the full-screen flicker smoothly instead of hard white flashes". | Done |
| R21 | "Double check the artistic ideas are migrated nicely and perfectly" | Each reference has a dedicated preset that recreates its art direction: Arwes, The Grid and Ares (thegridcn), Soul Extract, Glitchy, ZK matrix, and Resonance (Arwes and glitchy). Each was rendered and compared with the reference. Palettes were converted from the references' OKLCH values (`experiments/oklch-to-hex.py`). | `settings.test.ts` "covers every requested reference with a dedicated preset"; the README preset gallery. | Done |
| R22 | "collect data … to `./docs/case-studies/issue-{id}` … deep case study analysis … search online … list of each and all requirements … solution plans … existing components/libraries" | This folder: raw issue data, online research (`science-verification.md`, `reference-survey.md`), this requirements inventory, solution plans (sections 1–3) and the library survey (section 2). | This file. | Done |
| R23 | "plan and execute everything in this single pull request" | All work is in PR #8. | PR #8. | Done |

## 2. Existing components and libraries considered

The full table, with versions, licenses and sizes, is in `reference-survey.md` §7. The decisions:

| Need | Candidates | Decision and reason |
| --- | --- | --- |
| Skinned dropdown | `@radix-ui/react-select` (≈30 KB gz), `@headlessui/react` Listbox, `downshift` `useSelect` (≈15 KB gz), `react-aria`, `@ariakit/react`, native `appearance: base-select` (Chrome 135+ only) | **Hand-rolled** WAI-ARIA APG "select-only combobox" (≈2 KB). The app has no UI dependencies, a single control did not justify a portal and popper stack, and the hand-rolled control can take every skin variable. Downshift is the fallback if accessibility bugs appear. |
| Scrollbars | `overlayscrollbars`, `simplebar` | **Native** `scrollbar-color` / `scrollbar-width` plus `::-webkit-scrollbar`. Zero cost and native scrolling behaviour. |
| UI sound | `howler`, `use-sound`, `tone` (≈77 KB gz), `zzfx`, `jsfxr`, `@arwes/bleeps` | **Plain Web Audio** synthesis. No sample files to license or download, and every sound can be parameterised (tone, reverb, pitch, stereo). Tone.js would add 77 KB for features the engine already has. zzfx is noted as a compact source of more sound variants if needed. |
| Frames, backgrounds, text effects | `@arwes/frames`, `@arwes/bgs`, `@arwes/text` (MIT, pre-release) | **Re-implemented** from the MIT source as small functions (`frameShapes.ts`, `Starfield.tsx`, `textEffects.ts`). The packages are pre-release, and the app needs them skinnable through its own settings. |
| Materials and textures | Lea Verou CSS3 Patterns (MIT), SVG `feTurbulence` | **CSS gradients plus `feTurbulence` data URIs**: no image assets, and each material scales and tints with the palette. |
| Sound-reactive background | an `AnalyserNode` FFT, as on glitchy.website | **Interaction cues** (`onSoundCue` in `sound.ts`). See idea 15 below. |

Licenses: Arwes is MIT (ideas and code shapes reused with attribution in source comments).
Soul Extract is GPL-3.0, so its ideas were re-implemented, not copied. thegridcn publishes no
license, so it was used only as a visual reference.

## 3. Reference ideas that had not been recreated (survey §6)

| # | Idea | Where it is now | Status |
| --- | --- | --- | --- |
| 1 | Themed accessible Select | `components/Select.tsx` | Done |
| 2 | Themed scrollbars | "Scrollbars" axis (thin, HUD rail, block) | Done |
| 3 | Table styling; no expandable-only sections | "Data table" axis; Methodology and table shown directly | Done |
| 4 | Materials with transparency | 13 materials plus opacity and blur | Done |
| 5 | Several sounds per action, neutral names | Sound engine v2 | Done |
| 6 | Fix glitchy borders and fog | See R19 and R20 | Done |
| 7 | Arwes FrameNero / FrameHeader / FrameCircle | **Nero** frame (four L-brackets with an opacity flicker on enter); FrameHeader as the "Header rule" title decoration | Done, with differences: FrameCircle was not added because every panel is rectangular, so a circular frame would clip the content |
| 8 | Arwes style helpers (separator, steps, strip) | "Section dividers" axis: hairline, separator (`styleSeparator`), steps (`styleSteps`), hazard strip (`styleStrip`), between verdict paragraphs, methodology items and above the footer. See [divider-separator.png](../../screenshots/divider-separator.png) and [divider-strip.png](../../screenshots/divider-strip.png). | Done |
| 9 | Blinking caret for text effects | Typewriter caret (stops when motion is off) | Done |
| 10 | Per-element illuminator clipped to the frame | "Glow" panel hover: a pointer-following radial light on the clipped `.frame-material` layer, plus the screen-wide "Pointer illuminator" | Done |
| 11 | Soul Extract rails and `//` ticks | "Signal rails" background and the "Slashes" title decoration | Done |
| 12 | Arwes GridLines and richer dots | "Grid lines" background (solid verticals, dashed animated horizontals) | Done |
| 13 | Richer StatTile | Sparkline under the value, count-up (rAF, 900 ms, ease-out, skipped when motion is off), ▲/▼ delta | Done, with differences: no icon box, since the tiles have no meaningful icons and a generic glyph would be decoration only |
| 14 | ZKN and Arwes navigation chrome | The "Accent bar" title decoration (3px bar plus tinted strip) | Done, with differences: the pager, tabs and nav underline do not apply because the dashboard is one page without navigation; the settings drawer tabs are already skinned |
| 15 | Audio-reactive background | "Sound resonance" background: a wavy ring that ripples and sparks with every interface sound cue, panned by pointer position, plus a slow ambient ripple | Done, with differences: driven by sound *cues* instead of an `AnalyserNode` FFT. The UI sounds are short synthesized blips, so an FFT would only see the same clicks, and cues also work while sound is muted. |

A new "Resonance" preset shows ideas 7, 12 and 15 together.

## 4. Verification

- `npm run build`, `npx tsc --noEmit` and `npx vitest run` in `app/`: 79 tests in 7 files
  (analytics, frameShapes, settings, styling, textEffects, sparkline, sound), all passing.
  CI runs the same steps (`.github/workflows/website.yml`).
- Visual checks in headless Chromium through Playwright. `experiments/preset-gallery.js`
  regenerates every screenshot in `docs/screenshots`: all 12 presets, materials, the open
  select, the data table, drawer tabs, both intros and mobile.
- Audio: `experiments/sound-render.js` (see R12).
- A code review of the whole diff found eight bugs, all fixed with regression checks:
  - share links with inherited keys (`"constructor"`) as sound ids crashed the app;
  - React StrictMode lost the v1 → v2 migration in dev;
  - pressing the select list's padding or scrollbar took focus from the button, so Escape
    closed the drawer;
  - Tab on the empty "+ Add sound" picker added the first sound;
  - Space ended a typeahead search;
  - an interrupted count-up jumped (and in dev never counted);
  - the hover glow was offset under the text-size zoom;
  - background speed 0% still moved the CSS grids.

  The first two are unit tests in `settings.test.ts`; the rest were checked in Playwright.
- Science: `experiments/lev-report.mjs` recomputes the dashboard numbers quoted in
  `science-verification.md`.

## 5. Known limits

- Headless Chromium draws overlay scrollbars, so the scrollbar skins are not visible in the
  screenshots. They were checked through computed styles. For the same reason, dragging the
  select list's scrollbar could not be tested. The list cancels mouse-down to keep focus on
  the button, the pattern react-select uses with native scrollbars, and hands focus back
  if a browser focuses the list anyway.
- Animated effects (the Nero flicker, ripples, count-up) cannot be shown in still screenshots.
- arwes.dev timed out from this environment, so Arwes was studied from its GitHub source.
- thegridcn publishes no license: it was used only as a visual reference.
- The science items that could not be verified are listed at the end of
  `science-verification.md`. They are not used as facts in the app or the documents.
