# immortality
Draft plan for immortality

## 📡 Longevity Escape Velocity Monitor

**Live dashboard: https://konard.github.io/immortality/**

Making immortality measurable: the dashboard plots actual life expectancy from
[Our World in Data](https://ourworldindata.org/life-expectancy), its growth
**velocity** (years of life expectancy gained per calendar year), and the
**acceleration** of that velocity — tracking how close humanity is to
*longevity escape velocity*, the point where each year lived adds a full year
of life expectancy.

[![Longevity Escape Velocity Monitor](docs/screenshots/dashboard-world.png?raw=true)](https://konard.github.io/immortality/)

The site is a React + Vite app in [`app/`](app/) with a space-inspired UI
(in the spirit of [Arwes](https://arwes.dev) and
[thegridcn-ui](https://github.com/educlopez/thegridcn-ui)) and interactive
sounds, built and deployed to GitHub Pages by
[GitHub Actions](.github/workflows/website.yml). The OWID data snapshot is
refreshed automatically on every deployment.

### Configurable futuristic UI

Every way of delivering the futuristic look is an independent, reversible
**axis** in the **Settings** drawer, so styles can be mixed and compared live
next to the dashboard. The axes were collected from
[thegridcn](https://thegridcn.com) ([source](https://github.com/educlopez/thegridcn-ui),
[dashboard](https://thegridcn.com/templates/dashboard),
[analytics](https://thegridcn.com/templates/analytics)),
[Arwes](https://github.com/arwes/arwes),
[soulextract.com](https://soulextract.com/about) ([source](https://github.com/soulextract/soulextract.com)),
[ZKN app chain](https://zknet.io/features/app-chain) and
[glitchy.website](https://glitchy.website); each control links back to its references.

| Group | Axes |
| --- | --- |
| Color | 12 color systems: Mission teal, Glitchy violet, Solar amber, Signal mono, Tron cyan, Ares red, Clu orange, Athena gold, Aphrodite pink, Poseidon blue, Soul cyan, ZK matrix |
| Panels | 13 panel materials (gradient, glass, frosted, flat, transparent, brushed steel, brass, copper, walnut wood, carbon fibre, holographic, black marble, concrete) with material opacity and backdrop blur; glow (none → heavy); frame shape (corner brackets, Arwes Octagon / Kranox / Nefrex / Nero SVG frames, lines, underline, HUD bracket, plain); chamfer size; border width; panel shadow; density; progress meter (bar, segmented, ring) |
| Type & text | typeface pairs (system, mono, Orbitron, Electrolize, Chakra Petch, Titillium, terminal), text size, heading case, title decoration (Arwes rule, zknet bar, Soul Extract `//`), section dividers (hairline, Arwes separator, steps, hazard strip), title effect (decipher, typewriter with caret, glitch) |
| Scene & overlays | 21 animated backgrounds (stars, grids, galaxy, orbits, asteroids, dot matrix, moving lines, energy puffs, circuit board, data rain, nebula, aurora curtains, warp drive, hex lattice, radar sweep, constellation network, Arwes grid lines, Soul Extract signal rails, and a sound resonance ring that ripples with every interface cue), 7 backdrop gradients, background intensity and speed, CRT scanlines, scan sweep, vignette, flicker, film grain, pointer illuminator |
| HUD & charts | status rail, start-up intro (boot sequence or "Intercept incoming transmission?" prompt), chart trace (line, area, neon, step), gridlines, line width, stat-card sparklines, counting numbers |
| Controls & data | skinned dropdowns everywhere, panel hover (glow, lift, light sweep), pointer cursor (crosshair, HUD reticle), data table style (lined, zebra, grid, terminal), scrollbars (thin, HUD rail, block) |
| Motion | animations, panel entrance (assemble, fade, scan, flicker), staggered reveal, animation speed |
| Audio | sound on/off, master volume, tone, room reverb, pitch variation, positional stereo, and several sounds per action (played at random, in turn or layered) chosen from a library of 26 synthesized sounds with neutral names (Quartz, Cobalt, Tungsten, Opal, Sonar, …) for hover, buttons, switches, selections, chart scanner, opening, closing, text effects, intro and notifications |

To find a good combination quickly:

- **Presets** apply a complete look in one click: Poseidon (the default),
  Mission control (the original dashboard), The Grid, Ares, Arwes, Soul
  Extract, Glitchy, ZK matrix, Foundry (brushed steel and brass), Study
  (walnut panels and soft wooden sounds), Quiet and Resonance (Nero frames
  over the sound resonance background).
- **Randomize** shuffles the visual axes (comfort settings such as motion and
  volume are kept).
- **Copy share link** puts the current combination into a `#ui=` URL; opening
  it applies and saves those settings, so candidates can be compared and
  shared.
- **Restore defaults** returns to the default (Poseidon) look.

Preferences are stored locally in the browser. Sound and animation are enabled
by default; browser autoplay rules mean audio begins after the first
interaction. `experiments/list-axes.ts` prints the full axis catalog and
`experiments/preset-gallery.js` re-renders the screenshots below.

| Poseidon (default) | Mission control | The Grid | Ares |
| --- | --- | --- | --- |
| ![Poseidon](docs/screenshots/preset-poseidon.png?raw=true) | ![Mission control](docs/screenshots/preset-mission.png?raw=true) | ![The Grid](docs/screenshots/preset-grid.png?raw=true) | ![Ares](docs/screenshots/preset-ares.png?raw=true) |
| **Arwes** | **Soul Extract** | **Glitchy** | **ZK matrix** |
| ![Arwes](docs/screenshots/preset-arwes.png?raw=true) | ![Soul Extract](docs/screenshots/preset-soulextract.png?raw=true) | ![Glitchy](docs/screenshots/preset-glitchy.png?raw=true) | ![ZK matrix](docs/screenshots/preset-zknet.png?raw=true) |
| **Foundry** | **Study** | **Quiet** | **Resonance** |
| ![Foundry](docs/screenshots/preset-foundry.png?raw=true) | ![Study](docs/screenshots/preset-study.png?raw=true) | ![Quiet](docs/screenshots/preset-minimal.png?raw=true) | ![Resonance](docs/screenshots/preset-resonance.png?raw=true) |

![Panel materials](docs/screenshots/materials.png?raw=true)

![Settings drawer with presets and axis groups](docs/screenshots/settings-drawer.png?raw=true)

## Source

### Electromagnetic levitation
https://youtu.be/y-Tp5oswnNA
Trapping Particles In a Beam of Light—The Optical Tweezers Experiment
The Action Lab

### Acoustic Levitation
https://youtu.be/VjfqYoA7rwY
How Does Acoustic Levitation Really Work?
The Action Lab

### Phased array antenna
https://youtu.be/qs2QcycggWU
How does Starlink Satellite Internet Work?
Branch Education

### Atomic 3D scanner
https://youtu.be/9DnnxvS6BBQ
How do Electron Microscopes Work? 🔬🛠🔬 Taking Pictures of Atoms
Branch Education

### Atomic 3D printer
https://youtu.be/oSCX78-8-q0
A Boy And His Atom: The World's Smallest Movie
IBM

### Atomic 3D shreder

## Target

### Real telekinesis

### Real telepathy

### Real immortallity

### Real teleport

### Real cloning
