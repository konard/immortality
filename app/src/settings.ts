// Every visual, motion and audio axis of the futuristic interface is declared
// once here. The settings panel, persistence, presets, randomizer and share
// links are all driven by this schema, so adding an option in one place makes
// it configurable everywhere.

/** Design references the configuration axes were collected from. */
export const REFERENCES = {
  arwes: { label: 'Arwes', url: 'https://github.com/arwes/arwes' },
  arwesBleeps: {
    label: 'Arwes bleeps',
    url: 'https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/bleeps',
  },
  arwesFrames: {
    label: 'Arwes frames',
    url: 'https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/frames',
  },
  arwesStyles: {
    label: 'Arwes styles',
    url: 'https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/styles/src',
  },
  arwesText: {
    label: 'Arwes text',
    url: 'https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/text',
  },
  arwesBgs: {
    label: 'Arwes backgrounds',
    url: 'https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/bgs',
  },
  arwesEffects: {
    label: 'Arwes illuminator',
    url: 'https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/effects',
  },
  romel: { label: 'romelperez.dev', url: 'https://romelperez.dev' },
  gridcn: { label: 'thegridcn', url: 'https://thegridcn.com' },
  gridcnSource: {
    label: 'thegridcn-ui source',
    url: 'https://github.com/educlopez/thegridcn-ui',
  },
  gridcnDashboard: { label: 'thegridcn dashboard', url: 'https://thegridcn.com/templates/dashboard' },
  gridcnAnalytics: { label: 'thegridcn analytics', url: 'https://thegridcn.com/templates/analytics' },
  soulextract: { label: 'Soul Extract', url: 'https://soulextract.com/about' },
  soulextractSource: {
    label: 'soulextract.com source',
    url: 'https://github.com/soulextract/soulextract.com',
  },
  glitchy: { label: 'glitchy.website', url: 'https://glitchy.website/' },
  zknet: { label: 'ZKN app chain', url: 'https://zknet.io/features/app-chain' },
} as const;

export type ReferenceId = keyof typeof REFERENCES;

interface OptionDef {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly source?: ReferenceId;
}

export const PALETTES = [
  { id: 'mission', label: 'Mission teal', description: 'The original dashboard colors.' },
  {
    id: 'glitchy',
    label: 'Glitchy violet',
    description: 'Violet chrome inspired by glitchy.website.',
    source: 'glitchy',
  },
  { id: 'amber', label: 'Solar amber', description: 'Warm high-contrast instrument lighting.' },
  { id: 'monochrome', label: 'Signal mono', description: 'A restrained white and graphite display.' },
  { id: 'tron', label: 'Tron cyan', description: 'thegridcn Tron theme.', source: 'gridcn' },
  { id: 'ares', label: 'Ares red', description: 'thegridcn Ares theme.', source: 'gridcn' },
  { id: 'clu', label: 'Clu orange', description: 'thegridcn Clu theme.', source: 'gridcn' },
  { id: 'athena', label: 'Athena gold', description: 'thegridcn Athena theme.', source: 'gridcn' },
  {
    id: 'aphrodite',
    label: 'Aphrodite pink',
    description: 'thegridcn Aphrodite theme.',
    source: 'gridcn',
  },
  {
    id: 'poseidon',
    label: 'Poseidon blue',
    description: 'thegridcn Poseidon theme.',
    source: 'gridcn',
  },
  {
    id: 'soulextract',
    label: 'Soul cyan',
    description: 'Cyan and yellow on deep teal, from Soul Extract.',
    source: 'soulextractSource',
  },
  {
    id: 'matrix',
    label: 'ZK matrix',
    description: 'Phosphor green from the ZKN application chain.',
    source: 'zknet',
  },
] as const satisfies readonly OptionDef[];

export const BACKGROUNDS = [
  { id: 'stars', label: 'Deep stars' },
  { id: 'square-grid', label: 'Square grid', source: 'gridcn' },
  { id: 'perspective-grid', label: 'Horizon grid', source: 'gridcn' },
  { id: 'galaxy', label: 'Spiral galaxy' },
  { id: 'planet-orbit', label: 'Planet orbit' },
  { id: 'star-orbit', label: 'Stellar orbit' },
  { id: 'asteroids', label: 'Asteroid field' },
  { id: 'dots', label: 'Dot matrix', source: 'arwesBgs' },
  { id: 'moving-lines', label: 'Moving lines', source: 'arwesBgs' },
  { id: 'puffs', label: 'Energy puffs', source: 'arwesBgs' },
  { id: 'circuit', label: 'Circuit board', source: 'soulextractSource' },
  { id: 'data-rain', label: 'Data rain', source: 'zknet' },
  { id: 'nebula', label: 'Nebula & bokeh', source: 'glitchy' },
  { id: 'aurora', label: 'Aurora curtains' },
  { id: 'warp', label: 'Warp drive' },
  { id: 'hexagons', label: 'Hex lattice', source: 'gridcn' },
  { id: 'radar', label: 'Radar sweep', source: 'gridcn' },
  { id: 'constellation', label: 'Constellation network', source: 'zknet' },
  { id: 'grid-lines', label: 'Grid lines', source: 'arwesBgs' },
  { id: 'rails', label: 'Signal rails', source: 'soulextractSource' },
  { id: 'resonance', label: 'Sound resonance', source: 'glitchy' },
] as const satisfies readonly OptionDef[];

/** Full-screen gradient washes painted behind the background animation. */
export const BACKDROP_GRADIENTS = [
  { id: 'none', label: 'None', description: 'Plain page colour (original look).' },
  { id: 'horizon', label: 'Horizon glow', description: 'A lit horizon under a darkening sky.' },
  { id: 'deep-space', label: 'Deep space', description: 'Soft radial falloff toward the edges.' },
  { id: 'aurora', label: 'Aurora wash', description: 'Two-tone light bands from the palette.' },
  { id: 'nebula', label: 'Nebula wash', description: 'Layered coloured clouds.', source: 'glitchy' },
  { id: 'sunset', label: 'Synth sunset', description: 'Warm retro-futurist dusk.' },
  { id: 'abyss', label: 'Abyss', description: 'A deep vertical fade to black.' },
] as const satisfies readonly OptionDef[];

export const GLOW_LEVELS = [
  { id: 'none', label: 'None', description: 'Flat borders, no light bloom.' },
  { id: 'light', label: 'Light', description: 'Subtle glows (original look).' },
  { id: 'medium', label: 'Medium', description: 'Neon borders and text.' },
  { id: 'heavy', label: 'Heavy', description: 'Full HUD bloom with pulsing hover.' },
] as const satisfies readonly OptionDef[];

export const FRAME_STYLES = [
  { id: 'corners', label: 'Corner brackets', description: 'Original Arwes-style corners.' },
  { id: 'octagon', label: 'Octagon', description: 'All corners chamfered.' },
  { id: 'kranox', label: 'Kranox', description: 'Asymmetric chamfer with an accent edge.' },
  { id: 'nefrex', label: 'Nefrex', description: 'Cut corners with offset accent lines.' },
  { id: 'nero', label: 'Nero', description: 'Faint box with four solid corner squares.' },
  { id: 'lines', label: 'Lines', description: 'Top and bottom rails only.' },
  { id: 'underline', label: 'Underline', description: 'A single glowing base line.' },
  { id: 'hud', label: 'HUD bracket', description: 'thegridcn HUD frame with header rule.' },
  { id: 'plain', label: 'Plain', description: 'A simple bordered panel.' },
] as const satisfies readonly OptionDef[];

/**
 * Panel materials. Every material is drawn on a dedicated `.frame-material` layer, so
 * its opacity (`surfaceOpacity`) and backdrop blur (`surfaceBlur`) are configurable and
 * it is clipped to the chamfered SVG outlines as well as the rectangular frames.
 * Materials are tinted with the active palette so they stay integrated with every skin.
 */
export const SURFACES = [
  { id: 'gradient', label: 'Gradient', description: 'Original diagonal panel shading.' },
  { id: 'glass', label: 'Glass', description: 'Clear blurred glass with a specular edge.' },
  { id: 'frosted', label: 'Frosted', description: 'Milky, heavily diffused glass with grain.' },
  { id: 'solid', label: 'Flat', description: 'Opaque flat panels.' },
  { id: 'transparent', label: 'Transparent', description: 'Outline-only panels over the scene.' },
  { id: 'steel', label: 'Brushed steel', description: 'Dark anisotropic brushed metal.' },
  { id: 'brass', label: 'Brass', description: 'Warm polished brass plate.' },
  { id: 'copper', label: 'Copper', description: 'Oxidised copper with a rose sheen.' },
  { id: 'wood', label: 'Walnut wood', description: 'Dark walnut veneer with growth rings.' },
  { id: 'carbon', label: 'Carbon fibre', description: 'Woven twill carbon weave.' },
  { id: 'holographic', label: 'Holographic', description: 'Iridescent foil that shifts with the palette.' },
  { id: 'marble', label: 'Black marble', description: 'Polished stone with soft veins.' },
  { id: 'concrete', label: 'Concrete', description: 'Matte speckled cast concrete.' },
] as const satisfies readonly OptionDef[];

/** Materials that are see-through by design and therefore always get a backdrop blur. */
export const TRANSLUCENT_SURFACES: ReadonlySet<string> = new Set(['glass', 'frosted', 'holographic']);

export const PANEL_SHADOWS = [
  { id: 'none', label: 'None' },
  { id: 'soft', label: 'Soft', description: 'A short ambient drop shadow.' },
  { id: 'deep', label: 'Deep', description: 'Panels float high above the scene.' },
  { id: 'neon', label: 'Neon halo', description: 'A coloured light halo instead of a shadow.' },
] as const satisfies readonly OptionDef[];

export const HOVER_EFFECTS = [
  { id: 'none', label: 'None' },
  { id: 'glow', label: 'Glow', description: 'Panels light up under the pointer.' },
  { id: 'lift', label: 'Lift', description: 'Panels rise slightly under the pointer.' },
  { id: 'sweep', label: 'Light sweep', description: 'A specular band crosses the panel.', source: 'gridcn' },
] as const satisfies readonly OptionDef[];

export const DENSITIES = [
  { id: 'compact', label: 'Compact' },
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'spacious', label: 'Spacious' },
] as const satisfies readonly OptionDef[];

export const METER_STYLES = [
  { id: 'bar', label: 'Bar', description: 'Original continuous meter.' },
  { id: 'segmented', label: 'Segmented', description: 'thegridcn energy-meter cells.' },
  { id: 'ring', label: 'Ring', description: 'thegridcn progress ring.' },
] as const satisfies readonly OptionDef[];

export const FONTS = [
  { id: 'system', label: 'System sans', description: 'Original system font stack.' },
  { id: 'mono', label: 'Grid mono', description: 'Monospace HUD type (thegridcn).', source: 'gridcn' },
  {
    id: 'orbitron',
    label: 'Orbitron + Electrolize',
    description: 'Soul Extract typography.',
    source: 'soulextractSource',
  },
  {
    id: 'chakra',
    label: 'Orbitron + Chakra Petch',
    description: 'ZKN typography.',
    source: 'zknet',
  },
  {
    id: 'electrolize',
    label: 'Electrolize + Titillium',
    description: 'glitchy.website typography.',
    source: 'glitchy',
  },
  { id: 'terminal', label: 'Terminal', description: 'Share Tech Mono throughout.' },
] as const satisfies readonly OptionDef[];

export const HEADING_CASES = [
  { id: 'upper', label: 'Uppercase' },
  { id: 'normal', label: 'As written' },
] as const satisfies readonly OptionDef[];

/** Decoration of panel titles. */
export const TITLE_STYLES = [
  { id: 'plain', label: 'Plain' },
  {
    id: 'rule',
    label: 'Header rule',
    description: 'A separator line running out of the title, ending in a deco block.',
    source: 'arwesFrames',
  },
  { id: 'bar', label: 'Accent bar', description: 'A glowing vertical bar before the title.', source: 'zknet' },
  { id: 'slash', label: 'Slashes', description: 'A // marker before the title.', source: 'soulextractSource' },
] as const satisfies readonly OptionDef[];

export const DIVIDERS = [
  { id: 'none', label: 'Spacing' },
  { id: 'line', label: 'Hairline', description: 'A thin fading line between paragraphs.' },
  {
    id: 'separator',
    label: 'Separator',
    description: 'A rule with bright end segments (styleSeparator).',
    source: 'arwesStyles',
  },
  { id: 'steps', label: 'Steps', description: 'A short run of stepped bars (styleSteps).', source: 'arwesStyles' },
  { id: 'strip', label: 'Hazard strip', description: 'Diagonal warning stripes (styleStrip).', source: 'arwesStyles' },
] as const satisfies readonly OptionDef[];

export const TEXT_EFFECTS = [
  { id: 'none', label: 'None' },
  { id: 'decipher', label: 'Decipher', description: 'Random glyphs resolve into text.', source: 'arwesText' },
  { id: 'sequence', label: 'Typewriter', description: 'Characters type in sequence.', source: 'soulextractSource' },
  { id: 'glitch', label: 'Glitch', description: 'RGB-split jitter on titles.', source: 'glitchy' },
] as const satisfies readonly OptionDef[];

export const SCANLINE_LEVELS = [
  { id: 'off', label: 'Off' },
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'heavy', label: 'Heavy' },
] as const satisfies readonly OptionDef[];

export const INTROS = [
  { id: 'none', label: 'None' },
  { id: 'boot', label: 'Boot sequence', description: 'Terminal start-up log.', source: 'gridcn' },
  {
    id: 'transmission',
    label: 'Transmission prompt',
    description: '“Intercept incoming transmission?” gate that also unlocks audio.',
    source: 'glitchy',
  },
] as const satisfies readonly OptionDef[];

export const CHART_STYLES = [
  { id: 'line', label: 'Line', description: 'Original 2px line.' },
  { id: 'area', label: 'Area', description: 'Line with a fading fill.', source: 'gridcnAnalytics' },
  { id: 'glow', label: 'Neon', description: 'Line with a light bloom.', source: 'gridcnAnalytics' },
  { id: 'step', label: 'Step', description: 'Stepped digital trace.' },
] as const satisfies readonly OptionDef[];

export const CHART_GRIDS = [
  { id: 'solid', label: 'Solid' },
  { id: 'dashed', label: 'Dashed', source: 'gridcnDashboard' },
  { id: 'dots', label: 'Dotted' },
  { id: 'none', label: 'None' },
] as const satisfies readonly OptionDef[];

export const CURSORS = [
  { id: 'system', label: 'System' },
  { id: 'crosshair', label: 'Crosshair' },
  { id: 'reticle', label: 'HUD reticle', description: 'A palette-coloured targeting reticle.', source: 'arwes' },
] as const satisfies readonly OptionDef[];

export const TABLE_STYLES = [
  { id: 'lined', label: 'Lined', description: 'Hairline row separators.' },
  { id: 'zebra', label: 'Zebra', description: 'Alternating tinted rows.' },
  { id: 'grid', label: 'Grid', description: 'Full cell grid.', source: 'gridcnDashboard' },
  { id: 'terminal', label: 'Terminal', description: 'Monospace rows with a scan highlight.', source: 'zknet' },
] as const satisfies readonly OptionDef[];

export const SCROLLBAR_STYLES = [
  { id: 'thin', label: 'Thin', description: 'A slim palette-coloured thumb.' },
  { id: 'rail', label: 'HUD rail', description: 'A framed track with a glowing thumb.', source: 'gridcn' },
  { id: 'block', label: 'Block', description: 'A wide segmented thumb.' },
] as const satisfies readonly OptionDef[];

export const ENTRANCES = [
  { id: 'assemble', label: 'Assemble', description: 'Original reveal with drawn corners.', source: 'arwesFrames' },
  { id: 'fade', label: 'Fade' },
  { id: 'scan', label: 'Scan', description: 'Vertical scan-in.', source: 'gridcn' },
  { id: 'flicker', label: 'Flicker', description: 'Power-on flicker.', source: 'glitchy' },
  { id: 'none', label: 'None' },
] as const satisfies readonly OptionDef[];

const ARWES_BLEEP_SOURCE = REFERENCES.arwesBleeps.url;
const SOULEXTRACT_SOUNDS =
  'https://github.com/soulextract/soulextract.com/tree/633d5a57160fb8e3960c03b641aa4c27941bafda/static/sounds';
const GLITCHY_SOURCE = REFERENCES.glitchy.url;
const ZKNET_SOURCE = REFERENCES.zknet.url;
const WEB_AUDIO_SOURCE = 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API';

/**
 * Synthesized sound library. Names are neutral (materials, minerals and sky objects)
 * rather than tied to an action, because any sound can be mapped to any interaction
 * and several sounds can be mapped to the same one.
 */
export const SOUNDS = [
  { id: 'quartz', label: 'Quartz', character: 'Glassy high tick', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'cobalt', label: 'Cobalt', character: 'Square blip falling a fifth', sourceLabel: 'glitchy.website', sourceUrl: GLITCHY_SOURCE },
  { id: 'comet', label: 'Comet', character: 'Rising triangle sweep', sourceLabel: 'glitchy.website', sourceUrl: GLITCHY_SOURCE },
  { id: 'ion', label: 'Ion', character: 'Minimal sine tick', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'halo', label: 'Halo', character: 'Soft rounded drop', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'tide', label: 'Tide', character: 'Low rising swell', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'mica', label: 'Mica', character: 'Burst of key-like ticks', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'nova', label: 'Nova', character: 'Double rising power-up chirp', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'zephyr', label: 'Zephyr', character: 'Airy upward whoosh', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'ember', label: 'Ember', character: 'Band-passed static crackle', sourceLabel: 'glitchy.website', sourceUrl: GLITCHY_SOURCE },
  { id: 'prism', label: 'Prism', character: 'FM bell with shimmer', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'glacier', label: 'Glacier', character: 'Crystalline two-note interval', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'pulsar', label: 'Pulsar', character: 'Sub-bass thump with a click', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'orbit', label: 'Orbit', character: 'Stereo ping-pong blips', sourceLabel: 'Web Audio synthesis', sourceUrl: WEB_AUDIO_SOURCE },
  { id: 'vapor', label: 'Vapor', character: 'Falling filtered breath', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'cinder', label: 'Cinder', character: 'Sparse crackling grains', sourceLabel: 'glitchy.website', sourceUrl: GLITCHY_SOURCE },
  { id: 'tungsten', label: 'Tungsten', character: 'Inharmonic metallic ping', sourceLabel: 'Arwes bleeps', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'helix', label: 'Helix', character: 'Arpeggiated triad sparkle', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'drift', label: 'Drift', character: 'Detuned falling pad blip', sourceLabel: 'Web Audio synthesis', sourceUrl: WEB_AUDIO_SOURCE },
  { id: 'basalt', label: 'Basalt', character: 'Deep woody knock', sourceLabel: 'Web Audio synthesis', sourceUrl: WEB_AUDIO_SOURCE },
  { id: 'flint', label: 'Flint', character: 'Crisp mechanical switch', sourceLabel: 'Web Audio synthesis', sourceUrl: WEB_AUDIO_SOURCE },
  { id: 'opal', label: 'Opal', character: 'Soft marimba mallet', sourceLabel: 'Web Audio synthesis', sourceUrl: WEB_AUDIO_SOURCE },
  { id: 'lumen', label: 'Lumen', character: 'Bright major-third chime', sourceLabel: 'Web Audio synthesis', sourceUrl: WEB_AUDIO_SOURCE },
  { id: 'sonar', label: 'Sonar', character: 'Ping with an echo tail', sourceLabel: 'ZKN app chain', sourceUrl: ZKNET_SOURCE },
  { id: 'vesper', label: 'Vesper', character: 'Slow evening pad swell', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'relay', label: 'Relay', character: 'Latching double click', sourceLabel: 'Web Audio synthesis', sourceUrl: WEB_AUDIO_SOURCE },
] as const;

/** Sound ids of the first release, which were named after the action they played on. */
export const LEGACY_SOUND_IDS: Readonly<Record<string, SoundId | null>> = {
  spark: 'quartz',
  confirm: 'cobalt',
  transmit: 'comet',
  scanner: 'ion',
  soft: 'halo',
  pulse: 'tide',
  typing: 'mica',
  deploy: 'nova',
  expand: 'zephyr',
  static: 'ember',
  silent: null,
};

export const SOUND_EVENTS = [
  { id: 'hover', label: 'Hover' },
  { id: 'activate', label: 'Buttons' },
  { id: 'toggle', label: 'Switches' },
  { id: 'select', label: 'Selections & sliders' },
  { id: 'scan', label: 'Chart scanner' },
  { id: 'open', label: 'Open menus & panels' },
  { id: 'close', label: 'Close menus & panels' },
  { id: 'type', label: 'Text effects' },
  { id: 'intro', label: 'Intro & boot' },
  { id: 'notify', label: 'Notifications' },
] as const;

/** At most this many sounds can be layered or rotated on one interaction. */
export const MAX_SOUNDS_PER_EVENT = 6;

export const SOUND_MODES = [
  { id: 'random', label: 'Random', description: 'Each interaction picks one of its sounds at random.' },
  { id: 'cycle', label: 'Cycle', description: 'Each interaction plays its sounds in turn.' },
  { id: 'layer', label: 'Layer', description: 'All sounds of an interaction play together.' },
] as const satisfies readonly OptionDef[];

export const SOUND_TONES = [
  { id: 'warm', label: 'Warm', description: 'Rolled-off highs.' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'bright', label: 'Bright', description: 'Extra air and presence.' },
] as const satisfies readonly OptionDef[];

export type PaletteId = (typeof PALETTES)[number]['id'];
export type BackgroundId = (typeof BACKGROUNDS)[number]['id'];
export type GlowId = (typeof GLOW_LEVELS)[number]['id'];
export type FrameStyleId = (typeof FRAME_STYLES)[number]['id'];
export type SurfaceId = (typeof SURFACES)[number]['id'];
export type DensityId = (typeof DENSITIES)[number]['id'];
export type MeterStyleId = (typeof METER_STYLES)[number]['id'];
export type FontId = (typeof FONTS)[number]['id'];
export type HeadingCaseId = (typeof HEADING_CASES)[number]['id'];
export type TitleStyleId = (typeof TITLE_STYLES)[number]['id'];
export type DividerId = (typeof DIVIDERS)[number]['id'];
export type TextEffectId = (typeof TEXT_EFFECTS)[number]['id'];
export type ScanlineId = (typeof SCANLINE_LEVELS)[number]['id'];
export type IntroId = (typeof INTROS)[number]['id'];
export type ChartStyleId = (typeof CHART_STYLES)[number]['id'];
export type ChartGridId = (typeof CHART_GRIDS)[number]['id'];
export type EntranceId = (typeof ENTRANCES)[number]['id'];
export type PanelShadowId = (typeof PANEL_SHADOWS)[number]['id'];
export type HoverEffectId = (typeof HOVER_EFFECTS)[number]['id'];
export type BackdropGradientId = (typeof BACKDROP_GRADIENTS)[number]['id'];
export type CursorId = (typeof CURSORS)[number]['id'];
export type TableStyleId = (typeof TABLE_STYLES)[number]['id'];
export type ScrollbarStyleId = (typeof SCROLLBAR_STYLES)[number]['id'];
export type SoundId = (typeof SOUNDS)[number]['id'];
export type SoundEventId = (typeof SOUND_EVENTS)[number]['id'];
export type SoundModeId = (typeof SOUND_MODES)[number]['id'];
export type SoundToneId = (typeof SOUND_TONES)[number]['id'];

/** Sounds played for each interaction; an empty list keeps that interaction silent. */
export type SoundEffects = Record<SoundEventId, readonly SoundId[]>;

export interface UiSettings {
  // Color
  palette: PaletteId;
  // Panels & materials
  glow: GlowId;
  frame: FrameStyleId;
  cornerSize: number;
  borderWidth: number;
  surface: SurfaceId;
  surfaceOpacity: number;
  surfaceBlur: number;
  panelShadow: PanelShadowId;
  density: DensityId;
  meter: MeterStyleId;
  // Typography
  font: FontId;
  fontScale: number;
  headingCase: HeadingCaseId;
  titleStyle: TitleStyleId;
  divider: DividerId;
  textEffect: TextEffectId;
  // Scene
  background: BackgroundId;
  backdropGradient: BackdropGradientId;
  backgroundIntensity: number;
  backgroundSpeed: number;
  scanlines: ScanlineId;
  scanSweep: boolean;
  vignette: boolean;
  flicker: boolean;
  noise: boolean;
  illuminator: boolean;
  // HUD & charts
  statusBar: boolean;
  intro: IntroId;
  chartStyle: ChartStyleId;
  chartGrid: ChartGridId;
  chartLineWidth: number;
  sparklines: boolean;
  countUp: boolean;
  // Controls & data
  hoverEffect: HoverEffectId;
  cursor: CursorId;
  tableStyle: TableStyleId;
  scrollbarStyle: ScrollbarStyleId;
  // Motion
  animations: boolean;
  entrance: EntranceId;
  stagger: boolean;
  animationSpeed: number;
  // Audio
  sound: boolean;
  volume: number;
  soundMode: SoundModeId;
  soundTone: SoundToneId;
  reverb: number;
  pitchVariance: number;
  stereo: boolean;
  effects: SoundEffects;
}

/** Version 2 stores the redesigned schema (sound lists, materials, new defaults). */
export const SETTINGS_STORAGE_KEY = 'immortality.ui-settings.v2';
/** First-release storage key; read once to migrate customizations, then removed. */
export const LEGACY_SETTINGS_STORAGE_KEY = 'immortality.ui-settings.v1';

/**
 * Default look requested in issue #7: Poseidon blue, medium glow, transparent panels,
 * spacious layout, segmented meters, Orbitron type, typewriter titles, horizon grid,
 * status rail, boot intro, area charts with dashed grids and staggered scan entrances.
 */
export const DEFAULT_SETTINGS: UiSettings = {
  palette: 'poseidon',
  glow: 'medium',
  frame: 'corners',
  cornerSize: 14,
  borderWidth: 1,
  surface: 'transparent',
  surfaceOpacity: 100,
  surfaceBlur: 12,
  panelShadow: 'none',
  density: 'spacious',
  meter: 'segmented',
  font: 'orbitron',
  fontScale: 100,
  headingCase: 'upper',
  titleStyle: 'plain',
  divider: 'none',
  textEffect: 'sequence',
  background: 'perspective-grid',
  backdropGradient: 'none',
  backgroundIntensity: 100,
  backgroundSpeed: 100,
  scanlines: 'off',
  scanSweep: false,
  vignette: false,
  flicker: false,
  noise: false,
  illuminator: false,
  statusBar: true,
  intro: 'boot',
  chartStyle: 'area',
  chartGrid: 'dashed',
  chartLineWidth: 2,
  sparklines: true,
  countUp: true,
  hoverEffect: 'glow',
  cursor: 'system',
  tableStyle: 'lined',
  scrollbarStyle: 'thin',
  animations: true,
  entrance: 'scan',
  stagger: true,
  animationSpeed: 100,
  sound: true,
  volume: 100,
  soundMode: 'random',
  soundTone: 'neutral',
  reverb: 20,
  pitchVariance: 15,
  stereo: true,
  effects: {
    hover: ['quartz'],
    activate: ['cobalt', 'relay'],
    toggle: ['flint'],
    select: ['comet'],
    scan: ['ion'],
    open: ['zephyr'],
    close: ['vapor'],
    type: [],
    intro: ['nova'],
    notify: ['lumen'],
  },
};

/** The original (first release) values of the axes whose default changed in issue #7. */
export const LEGACY_V1_LOOK = {
  palette: 'mission',
  glow: 'light',
  surface: 'gradient',
  density: 'comfortable',
  meter: 'bar',
  font: 'system',
  textEffect: 'none',
  background: 'stars',
  statusBar: false,
  intro: 'none',
  chartStyle: 'line',
  chartGrid: 'solid',
  entrance: 'assemble',
  stagger: false,
} as const satisfies Partial<UiSettings>;

/** Base for unversioned (first release) share links: they encoded a diff against this look. */
export const LEGACY_V1_BASE: UiSettings = {
  ...DEFAULT_SETTINGS,
  ...LEGACY_V1_LOOK,
  effects: { ...DEFAULT_SETTINGS.effects },
};

/** First-release sound map, translated to the renamed sounds. */
const LEGACY_V1_EFFECTS: SoundEffects = {
  hover: ['quartz'],
  activate: ['cobalt'],
  toggle: ['cobalt'],
  select: ['comet'],
  scan: ['ion'],
  open: [],
  close: [],
  type: [],
  intro: ['nova'],
  notify: [],
};

export type ScalarKey = Exclude<keyof UiSettings, 'effects'>;

export const SETTING_GROUPS = [
  { id: 'color', label: 'Color' },
  { id: 'surface', label: 'Panels' },
  { id: 'type', label: 'Type & text' },
  { id: 'scene', label: 'Scene & overlays' },
  { id: 'hud', label: 'HUD & charts' },
  { id: 'controls', label: 'Controls & data' },
  { id: 'motion', label: 'Motion' },
  { id: 'audio', label: 'Audio' },
] as const;

export type SettingGroupId = (typeof SETTING_GROUPS)[number]['id'];

interface AxisBase {
  key: ScalarKey;
  label: string;
  group: SettingGroupId;
  description?: string;
  sources?: readonly ReferenceId[];
}

export interface ChoiceAxis extends AxisBase {
  kind: 'choice';
  options: readonly OptionDef[];
  /** Render as a grid of swatch buttons instead of a dropdown. */
  display?: 'buttons' | 'select';
}

export interface ToggleAxis extends AxisBase {
  kind: 'toggle';
}

export interface RangeAxis extends AxisBase {
  kind: 'range';
  min: number;
  max: number;
  step: number;
  unit: string;
}

export type Axis = ChoiceAxis | ToggleAxis | RangeAxis;

/** The complete list of configurable axes, in display order. */
export const AXES: readonly Axis[] = [
  {
    key: 'palette',
    kind: 'choice',
    label: 'Color system',
    group: 'color',
    options: PALETTES,
    display: 'buttons',
    sources: ['gridcn', 'glitchy', 'soulextractSource', 'zknet'],
  },
  {
    key: 'surface',
    kind: 'choice',
    label: 'Panel material',
    group: 'surface',
    options: SURFACES,
    display: 'buttons',
    description: 'Every material is tinted by the color system.',
  },
  {
    key: 'surfaceOpacity',
    kind: 'range',
    label: 'Material opacity',
    group: 'surface',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    description: 'Scales the opacity of glass, flat and every other material; lower values show more of the scene.',
  },
  {
    key: 'surfaceBlur',
    kind: 'range',
    label: 'Backdrop blur',
    group: 'surface',
    min: 0,
    max: 32,
    step: 2,
    unit: 'px',
    description: 'Blurs the scene behind see-through materials.',
  },
  {
    key: 'glow',
    kind: 'choice',
    label: 'Glow intensity',
    group: 'surface',
    options: GLOW_LEVELS,
    display: 'buttons',
    sources: ['gridcnSource'],
  },
  {
    key: 'frame',
    kind: 'choice',
    label: 'Frame shape',
    group: 'surface',
    options: FRAME_STYLES,
    display: 'buttons',
    sources: ['arwesFrames', 'gridcnDashboard'],
  },
  {
    key: 'cornerSize',
    kind: 'range',
    label: 'Corner / chamfer size',
    group: 'surface',
    min: 4,
    max: 32,
    step: 2,
    unit: 'px',
    sources: ['gridcnSource'],
  },
  {
    key: 'borderWidth',
    kind: 'range',
    label: 'Border width',
    group: 'surface',
    min: 0,
    max: 4,
    step: 0.5,
    unit: 'px',
  },
  {
    key: 'panelShadow',
    kind: 'choice',
    label: 'Panel shadow',
    group: 'surface',
    options: PANEL_SHADOWS,
    display: 'buttons',
  },
  { key: 'density', kind: 'choice', label: 'Layout density', group: 'surface', options: DENSITIES, display: 'buttons' },
  {
    key: 'meter',
    kind: 'choice',
    label: 'Progress meter',
    group: 'surface',
    options: METER_STYLES,
    display: 'buttons',
    sources: ['gridcnDashboard'],
  },
  {
    key: 'font',
    kind: 'choice',
    label: 'Typeface',
    group: 'type',
    options: FONTS,
    display: 'buttons',
    sources: ['soulextractSource', 'zknet', 'glitchy', 'gridcn'],
  },
  {
    key: 'fontScale',
    kind: 'range',
    label: 'Text size',
    group: 'type',
    min: 85,
    max: 130,
    step: 5,
    unit: '%',
  },
  {
    key: 'headingCase',
    kind: 'choice',
    label: 'Heading case',
    group: 'type',
    options: HEADING_CASES,
    display: 'buttons',
  },
  {
    key: 'titleStyle',
    kind: 'choice',
    label: 'Title decoration',
    group: 'type',
    options: TITLE_STYLES,
    display: 'buttons',
    sources: ['arwesFrames', 'zknet', 'soulextractSource'],
  },
  {
    key: 'divider',
    kind: 'choice',
    label: 'Section dividers',
    group: 'type',
    options: DIVIDERS,
    display: 'buttons',
    sources: ['arwesStyles'],
  },
  {
    key: 'textEffect',
    kind: 'choice',
    label: 'Title text effect',
    group: 'type',
    options: TEXT_EFFECTS,
    display: 'buttons',
    sources: ['arwesText', 'soulextractSource', 'glitchy'],
  },
  {
    key: 'background',
    kind: 'choice',
    label: 'Deep-space background',
    group: 'scene',
    options: BACKGROUNDS,
    sources: ['arwesBgs', 'soulextractSource', 'zknet', 'glitchy', 'gridcn'],
  },
  {
    key: 'backdropGradient',
    kind: 'choice',
    label: 'Backdrop gradient',
    group: 'scene',
    options: BACKDROP_GRADIENTS,
    description: 'A dithered colour wash painted behind the background animation.',
  },
  {
    key: 'backgroundIntensity',
    kind: 'range',
    label: 'Background intensity',
    group: 'scene',
    min: 0,
    max: 200,
    step: 10,
    unit: '%',
  },
  {
    key: 'backgroundSpeed',
    kind: 'range',
    label: 'Background speed',
    group: 'scene',
    min: 0,
    max: 300,
    step: 25,
    unit: '%',
    description: '0% freezes the background while keeping the other animations.',
  },
  {
    key: 'scanlines',
    kind: 'choice',
    label: 'CRT scanlines',
    group: 'scene',
    options: SCANLINE_LEVELS,
    display: 'buttons',
    sources: ['gridcnSource', 'glitchy'],
  },
  {
    key: 'scanSweep',
    kind: 'toggle',
    label: 'Scan sweep line',
    group: 'scene',
    sources: ['gridcnSource'],
  },
  { key: 'vignette', kind: 'toggle', label: 'Vignette', group: 'scene', sources: ['glitchy'] },
  {
    key: 'flicker',
    kind: 'toggle',
    label: 'Screen flicker',
    group: 'scene',
    description: 'A faint, smooth brightness breathing of the whole screen.',
    sources: ['glitchy'],
  },
  { key: 'noise', kind: 'toggle', label: 'Film grain', group: 'scene', sources: ['glitchy'] },
  {
    key: 'illuminator',
    kind: 'toggle',
    label: 'Pointer illuminator',
    group: 'scene',
    description: 'A soft light follows the pointer.',
    sources: ['arwesEffects'],
  },
  {
    key: 'statusBar',
    kind: 'toggle',
    label: 'HUD status bar',
    group: 'hud',
    description: 'Top system rail with link status and UTC clock.',
    sources: ['gridcnDashboard'],
  },
  {
    key: 'intro',
    kind: 'choice',
    label: 'Start-up intro',
    group: 'hud',
    options: INTROS,
    display: 'buttons',
    description: 'Shown on the next page load.',
    sources: ['gridcn', 'glitchy'],
  },
  {
    key: 'chartStyle',
    kind: 'choice',
    label: 'Chart trace',
    group: 'hud',
    options: CHART_STYLES,
    display: 'buttons',
    sources: ['gridcnAnalytics'],
  },
  {
    key: 'chartGrid',
    kind: 'choice',
    label: 'Chart gridlines',
    group: 'hud',
    options: CHART_GRIDS,
    display: 'buttons',
  },
  {
    key: 'chartLineWidth',
    kind: 'range',
    label: 'Chart line width',
    group: 'hud',
    min: 1,
    max: 4,
    step: 0.5,
    unit: 'px',
  },
  {
    key: 'sparklines',
    kind: 'toggle',
    label: 'Stat sparklines',
    group: 'hud',
    description: 'Small trend lines under the headline numbers.',
    sources: ['gridcn'],
  },
  {
    key: 'countUp',
    kind: 'toggle',
    label: 'Counting numbers',
    group: 'hud',
    description: 'Headline numbers count up to their value when they appear.',
    sources: ['gridcn'],
  },
  {
    key: 'hoverEffect',
    kind: 'choice',
    label: 'Panel hover',
    group: 'controls',
    options: HOVER_EFFECTS,
    display: 'buttons',
  },
  {
    key: 'cursor',
    kind: 'choice',
    label: 'Pointer cursor',
    group: 'controls',
    options: CURSORS,
    display: 'buttons',
  },
  {
    key: 'tableStyle',
    kind: 'choice',
    label: 'Data table',
    group: 'controls',
    options: TABLE_STYLES,
    display: 'buttons',
  },
  {
    key: 'scrollbarStyle',
    kind: 'choice',
    label: 'Scrollbars',
    group: 'controls',
    options: SCROLLBAR_STYLES,
    display: 'buttons',
  },
  { key: 'animations', kind: 'toggle', label: 'Animations', group: 'motion' },
  {
    key: 'entrance',
    kind: 'choice',
    label: 'Panel entrance',
    group: 'motion',
    options: ENTRANCES,
    display: 'buttons',
    sources: ['arwesFrames', 'gridcn', 'glitchy'],
  },
  {
    key: 'stagger',
    kind: 'toggle',
    label: 'Staggered reveal',
    group: 'motion',
    description: 'Panels enter one after another.',
    sources: ['arwes', 'soulextractSource'],
  },
  {
    key: 'animationSpeed',
    kind: 'range',
    label: 'Animation speed',
    group: 'motion',
    min: 25,
    max: 300,
    step: 25,
    unit: '%',
  },
  { key: 'sound', kind: 'toggle', label: 'Audio effects', group: 'audio' },
  {
    key: 'volume',
    kind: 'range',
    label: 'Master volume',
    group: 'audio',
    min: 0,
    max: 200,
    step: 10,
    unit: '%',
    sources: ['soulextractSource'],
  },
  {
    key: 'soundMode',
    kind: 'choice',
    label: 'Multiple sounds per action',
    group: 'audio',
    options: SOUND_MODES,
    display: 'buttons',
  },
  {
    key: 'soundTone',
    kind: 'choice',
    label: 'Tone',
    group: 'audio',
    options: SOUND_TONES,
    display: 'buttons',
  },
  {
    key: 'reverb',
    kind: 'range',
    label: 'Room reverb',
    group: 'audio',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
  },
  {
    key: 'pitchVariance',
    kind: 'range',
    label: 'Pitch variation',
    group: 'audio',
    min: 0,
    max: 100,
    step: 5,
    unit: ' ct',
    description: 'Random detune per play so repeated sounds do not feel mechanical.',
  },
  {
    key: 'stereo',
    kind: 'toggle',
    label: 'Positional stereo',
    group: 'audio',
    description: 'Pans each sound toward the pointer position.',
  },
];

export const AXIS_BY_KEY: Readonly<Record<ScalarKey, Axis>> = Object.fromEntries(
  AXES.map((axis) => [axis.key, axis])
) as Record<ScalarKey, Axis>;

const soundIds = new Set<string>(SOUNDS.map(({ id }) => id));

/** Returns `value` if it is valid for `axis`, otherwise `undefined`. */
export function coerceAxisValue(axis: Axis, value: unknown): string | number | boolean | undefined {
  if (axis.kind === 'toggle') return typeof value === 'boolean' ? value : undefined;
  if (axis.kind === 'range') {
    if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
    return Math.min(axis.max, Math.max(axis.min, value));
  }
  return typeof value === 'string' && axis.options.some(({ id }) => id === value)
    ? value
    : undefined;
}

/**
 * Normalizes one interaction's sounds: accepts a list of sound ids or a single
 * first-release id (`'confirm'`, `'silent'`, …), drops unknown ids and duplicates.
 */
export function coerceSoundList(value: unknown): SoundId[] | undefined {
  const toId = (item: unknown): SoundId | null | undefined => {
    if (typeof item !== 'string') return undefined;
    if (soundIds.has(item)) return item as SoundId;
    return item in LEGACY_SOUND_IDS ? LEGACY_SOUND_IDS[item] : undefined;
  };
  if (typeof value === 'string') {
    const id = toId(value);
    if (id === undefined) return undefined;
    return id === null ? [] : [id];
  }
  if (!Array.isArray(value)) return undefined;
  const list: SoundId[] = [];
  for (const item of value) {
    const id = toId(item);
    if (id && !list.includes(id)) list.push(id);
  }
  return list.slice(0, MAX_SOUNDS_PER_EVENT);
}

/** Merges a partial, untrusted settings object over `base`, dropping invalid values. */
export function mergeSettings(base: UiSettings, raw: unknown): UiSettings {
  if (!raw || typeof raw !== 'object') return base;
  const saved = raw as Record<string, unknown>;
  const next: UiSettings = { ...base, effects: { ...base.effects } };
  const writable = next as unknown as Record<string, unknown>;

  for (const axis of AXES) {
    const value = coerceAxisValue(axis, saved[axis.key]);
    if (value !== undefined) writable[axis.key] = value;
  }

  const savedEffects =
    saved.effects && typeof saved.effects === 'object'
      ? (saved.effects as Record<string, unknown>)
      : {};
  for (const { id } of SOUND_EVENTS) {
    const list = coerceSoundList(savedEffects[id]);
    if (list) next.effects[id] = list;
  }
  return next;
}

const sameSounds = (a: readonly SoundId[], b: readonly SoundId[]) => a.join() === b.join();

/** Only the values of `settings` that differ from `base`. */
export function diffSettings(settings: UiSettings, base: UiSettings): Partial<UiSettings> {
  const diff: Record<string, unknown> = {};
  for (const axis of AXES) {
    if (settings[axis.key] !== base[axis.key]) diff[axis.key] = settings[axis.key];
  }
  const effects: Partial<SoundEffects> = {};
  for (const { id } of SOUND_EVENTS) {
    if (!sameSounds(settings.effects[id], base.effects[id])) effects[id] = settings.effects[id];
  }
  if (Object.keys(effects).length > 0) diff.effects = effects;
  return diff as Partial<UiSettings>;
}

/** Only the values that differ from the defaults — compact for share links. */
export function diffFromDefaults(settings: UiSettings): Partial<UiSettings> {
  return diffSettings(settings, DEFAULT_SETTINGS);
}

/** Safely upgrades a persisted, potentially stale settings object. */
export function parseStoredSettings(raw: string | null): UiSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return mergeSettings(DEFAULT_SETTINGS, JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Migrates first-release storage. That release always saved every value, so only the
 * values a visitor actually changed from the old defaults are carried over to the new
 * defaults; untouched settings pick up the new look.
 */
export function migrateLegacySettings(raw: string | null): UiSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const legacyDefaults: UiSettings = { ...LEGACY_V1_BASE, effects: LEGACY_V1_EFFECTS };
    const legacy = mergeSettings(legacyDefaults, JSON.parse(raw));
    return mergeSettings(DEFAULT_SETTINGS, diffSettings(legacy, legacyDefaults));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const SHARE_HASH_PREFIX = '#ui=';
export const SHARE_VERSION = 2;

/** Encodes settings for a URL hash, e.g. `#ui=%7B%22v%22%3A2%2C%22palette%22%3A%22ares%22%7D`. */
export function encodeShareHash(settings: UiSettings): string {
  return (
    SHARE_HASH_PREFIX +
    encodeURIComponent(JSON.stringify({ v: SHARE_VERSION, ...diffFromDefaults(settings) }))
  );
}

/**
 * Decodes a `#ui=` hash; returns `null` when the hash carries no settings. Links without
 * a version come from the first release and are read against its defaults, so they keep
 * showing the look that was shared.
 */
export function decodeShareHash(hash: string): UiSettings | null {
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null;
  try {
    const raw: unknown = JSON.parse(decodeURIComponent(hash.slice(SHARE_HASH_PREFIX.length)));
    if (!raw || typeof raw !== 'object') return null;
    const versioned = (raw as { v?: unknown }).v === SHARE_VERSION;
    return mergeSettings(versioned ? DEFAULT_SETTINGS : LEGACY_V1_BASE, raw);
  } catch {
    return null;
  }
}

export interface Preset {
  id: string;
  label: string;
  description: string;
  sources: readonly ReferenceId[];
  settings: UiSettings;
}

type PresetOverrides = Partial<Omit<UiSettings, 'effects'>> & { effects?: Partial<SoundEffects> };

/** Reference presets are composed over the first-release look they were designed on. */
const preset = (
  id: string,
  label: string,
  description: string,
  sources: readonly ReferenceId[],
  overrides: PresetOverrides,
  base: UiSettings = LEGACY_V1_BASE
): Preset => ({
  id,
  label,
  description,
  sources,
  settings: {
    ...base,
    ...overrides,
    effects: { ...base.effects, ...overrides.effects },
  },
});

/** Complete looks assembled from each reference, as starting points for experiments. */
export const PRESETS: readonly Preset[] = [
  preset(
    'poseidon',
    'Poseidon',
    'The default look: Poseidon blue HUD over a horizon grid with typed Orbitron titles.',
    ['gridcn', 'soulextractSource'],
    {},
    DEFAULT_SETTINGS
  ),
  preset('mission', 'Mission control', 'The original dashboard.', [], {
    effects: LEGACY_V1_EFFECTS,
  }),
  preset(
    'grid',
    'The Grid',
    'Tron cyan HUD: mono type, heavy glow, horizon grid, scan sweep and status rail.',
    ['gridcn', 'gridcnDashboard'],
    {
      palette: 'tron',
      glow: 'heavy',
      frame: 'hud',
      cornerSize: 20,
      font: 'mono',
      background: 'perspective-grid',
      backdropGradient: 'horizon',
      scanlines: 'light',
      scanSweep: true,
      statusBar: true,
      intro: 'boot',
      meter: 'segmented',
      chartStyle: 'glow',
      chartGrid: 'dashed',
      divider: 'steps',
      tableStyle: 'grid',
      scrollbarStyle: 'rail',
      hoverEffect: 'sweep',
      entrance: 'scan',
      stagger: true,
    }
  ),
  preset(
    'ares',
    'Ares',
    'thegridcn Ares red with square grid, area charts and a progress ring.',
    ['gridcn', 'gridcnAnalytics'],
    {
      palette: 'ares',
      glow: 'medium',
      frame: 'hud',
      font: 'mono',
      background: 'square-grid',
      backdropGradient: 'abyss',
      statusBar: true,
      meter: 'ring',
      chartStyle: 'area',
      chartGrid: 'dashed',
      divider: 'strip',
      tableStyle: 'grid',
      scrollbarStyle: 'rail',
      entrance: 'scan',
      stagger: true,
    }
  ),
  preset(
    'arwes',
    'Arwes',
    'Kranox frames, deciphering titles, moving lines and a pointer illuminator.',
    ['arwes', 'romel'],
    {
      palette: 'tron',
      glow: 'medium',
      frame: 'kranox',
      cornerSize: 16,
      surface: 'glass',
      surfaceOpacity: 70,
      font: 'electrolize',
      titleStyle: 'rule',
      divider: 'separator',
      textEffect: 'decipher',
      background: 'moving-lines',
      backdropGradient: 'deep-space',
      illuminator: true,
      cursor: 'reticle',
      hoverEffect: 'glow',
      entrance: 'assemble',
      stagger: true,
      effects: { open: ['zephyr'], close: ['vapor'], type: ['mica'] },
    }
  ),
  preset(
    'soulextract',
    'Soul Extract',
    'Orbitron titles behind "//" markers, typing over signal rails with travelling lights.',
    ['soulextract', 'soulextractSource'],
    {
      palette: 'soulextract',
      glow: 'medium',
      frame: 'lines',
      font: 'orbitron',
      titleStyle: 'slash',
      textEffect: 'sequence',
      background: 'rails',
      backdropGradient: 'deep-space',
      entrance: 'fade',
      stagger: true,
      effects: { open: ['zephyr'], type: ['mica'], intro: ['nova'] },
    }
  ),
  preset(
    'glitchy',
    'Glitchy',
    'Violet CRT: nebula, scanlines, grain, glitching titles and a transmission prompt.',
    ['glitchy'],
    {
      palette: 'glitchy',
      glow: 'medium',
      frame: 'corners',
      cornerSize: 12,
      surface: 'frosted',
      surfaceOpacity: 60,
      font: 'electrolize',
      headingCase: 'normal',
      textEffect: 'glitch',
      background: 'nebula',
      backdropGradient: 'nebula',
      scanlines: 'medium',
      vignette: true,
      flicker: true,
      noise: true,
      intro: 'transmission',
      entrance: 'flicker',
      effects: { activate: ['ember', 'cinder'], open: ['comet'] },
    }
  ),
  preset(
    'zknet',
    'ZK matrix',
    'Phosphor-green data rain with Nefrex frames and deciphered headings.',
    ['zknet'],
    {
      palette: 'matrix',
      glow: 'medium',
      frame: 'nefrex',
      font: 'chakra',
      titleStyle: 'bar',
      textEffect: 'decipher',
      background: 'data-rain',
      meter: 'segmented',
      chartStyle: 'step',
      chartGrid: 'dots',
      tableStyle: 'terminal',
      scrollbarStyle: 'block',
      statusBar: true,
      entrance: 'scan',
      effects: { type: ['mica'], select: ['sonar'] },
    }
  ),
  preset(
    'foundry',
    'Foundry',
    'Brushed-steel panels and brass meters under a synth sunset.',
    [],
    {
      palette: 'amber',
      glow: 'light',
      frame: 'octagon',
      cornerSize: 12,
      borderWidth: 1.5,
      surface: 'steel',
      panelShadow: 'deep',
      font: 'chakra',
      background: 'perspective-grid',
      backdropGradient: 'sunset',
      meter: 'segmented',
      chartStyle: 'area',
      tableStyle: 'zebra',
      scrollbarStyle: 'rail',
      hoverEffect: 'lift',
      entrance: 'fade',
      effects: { activate: ['tungsten', 'relay'], hover: ['basalt'], toggle: ['relay'] },
    }
  ),
  preset(
    'study',
    'Study',
    'Walnut panels, warm light and soft wooden sounds.',
    [],
    {
      palette: 'athena',
      glow: 'none',
      frame: 'plain',
      cornerSize: 8,
      surface: 'wood',
      panelShadow: 'soft',
      font: 'system',
      headingCase: 'normal',
      background: 'stars',
      backdropGradient: 'abyss',
      backgroundIntensity: 60,
      tableStyle: 'zebra',
      hoverEffect: 'lift',
      entrance: 'fade',
      reverb: 35,
      effects: {
        hover: ['opal'],
        activate: ['basalt', 'opal'],
        toggle: ['basalt'],
        select: ['opal'],
        open: ['vesper'],
        close: ['drift'],
      },
    }
  ),
  preset(
    'minimal',
    'Quiet',
    'Calm graphite panels, no glow, no overlays and no sound.',
    [],
    {
      palette: 'monochrome',
      glow: 'none',
      frame: 'plain',
      surface: 'solid',
      backgroundIntensity: 40,
      backgroundSpeed: 50,
      chartGrid: 'dots',
      entrance: 'fade',
      sound: false,
    }
  ),
  preset(
    'resonance',
    'Resonance',
    'Nero frames over a ring that ripples with every interface sound, on Arwes grid lines.',
    ['arwesFrames', 'glitchy'],
    {
      palette: 'aphrodite',
      glow: 'medium',
      frame: 'nero',
      cornerSize: 12,
      surface: 'glass',
      surfaceOpacity: 55,
      font: 'electrolize',
      titleStyle: 'rule',
      divider: 'separator',
      textEffect: 'sequence',
      background: 'resonance',
      backdropGradient: 'nebula',
      chartStyle: 'area',
      chartGrid: 'dashed',
      entrance: 'assemble',
      stagger: true,
      effects: { activate: ['sonar'], open: ['zephyr'] },
    }
  ),
];

/**
 * Applies a shared look (share link or preset) over the viewer's settings while keeping
 * their personal comfort choices: motion and audio are never switched back on by a link.
 */
export function applySharedLook(current: UiSettings, look: UiSettings): UiSettings {
  return {
    ...look,
    effects: { ...look.effects },
    animations: current.animations,
    sound: current.sound,
    volume: current.volume,
  };
}

/** Applies a preset; comfort settings are kept, but a silent preset (Quiet) still mutes. */
export function applyPreset(preset: Preset, current: UiSettings): UiSettings {
  return { ...applySharedLook(current, preset.settings), sound: current.sound && preset.settings.sound };
}

/** Whether `current` is exactly what applying `preset` would produce. */
export function isPresetActive(preset: Preset, current: UiSettings): boolean {
  return JSON.stringify(applyPreset(preset, current)) === JSON.stringify(current);
}

/** Number of distinct settings values that differ from the defaults. */
export function countCustomized(settings: UiSettings): number {
  const diff = diffFromDefaults(settings);
  const effects = diff.effects ? Object.keys(diff.effects).length : 0;
  return Object.keys(diff).filter((key) => key !== 'effects').length + effects;
}

/** Axes that the randomizer leaves alone so experiments stay comfortable. */
const RANDOMIZER_LOCKED = new Set<ScalarKey>(['animations', 'intro', 'cursor']);

/** Random combination of every visual axis — a quick way to explore the space. */
export function randomizeSettings(current: UiSettings, random: () => number = Math.random): UiSettings {
  const next: UiSettings = { ...current, effects: { ...current.effects } };
  const writable = next as unknown as Record<string, unknown>;
  const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length) % items.length];
  for (const axis of AXES) {
    if (RANDOMIZER_LOCKED.has(axis.key) || axis.group === 'audio') continue;
    if (axis.kind === 'choice') writable[axis.key] = pick(axis.options).id;
    else if (axis.kind === 'toggle') writable[axis.key] = random() < 0.5;
    else {
      const steps = Math.round((axis.max - axis.min) / axis.step);
      writable[axis.key] = axis.min + Math.round(random() * steps) * axis.step;
    }
  }
  return next;
}
