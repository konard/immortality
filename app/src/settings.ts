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
  { id: 'lines', label: 'Lines', description: 'Top and bottom rails only.' },
  { id: 'underline', label: 'Underline', description: 'A single glowing base line.' },
  { id: 'hud', label: 'HUD bracket', description: 'thegridcn HUD frame with header rule.' },
  { id: 'plain', label: 'Plain', description: 'A simple bordered panel.' },
] as const satisfies readonly OptionDef[];

export const SURFACES = [
  { id: 'gradient', label: 'Gradient', description: 'Original diagonal panel shading.' },
  { id: 'glass', label: 'Glass', description: 'Translucent blurred panels.' },
  { id: 'solid', label: 'Solid', description: 'Opaque flat panels.' },
  { id: 'transparent', label: 'Transparent', description: 'Outline-only panels over the scene.' },
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

export const SOUND_PRESETS = [
  { id: 'spark', label: 'Spark', sourceLabel: 'Arwes bleep source', sourceUrl: ARWES_BLEEP_SOURCE },
  {
    id: 'confirm',
    label: 'Confirm',
    sourceLabel: 'glitchy.website reference',
    sourceUrl: 'https://glitchy.website/',
  },
  {
    id: 'transmit',
    label: 'Transmit',
    sourceLabel: 'glitchy.website reference',
    sourceUrl: 'https://glitchy.website/',
  },
  { id: 'scanner', label: 'Scanner', sourceLabel: 'Arwes bleep source', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'soft', label: 'Soft tone', sourceLabel: 'Arwes bleep source', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'pulse', label: 'Low pulse', sourceLabel: 'Arwes bleep source', sourceUrl: ARWES_BLEEP_SOURCE },
  { id: 'typing', label: 'Typing', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'deploy', label: 'Deploy', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  { id: 'expand', label: 'Expand', sourceLabel: 'Soul Extract sounds', sourceUrl: SOULEXTRACT_SOUNDS },
  {
    id: 'static',
    label: 'Static burst',
    sourceLabel: 'glitchy.website reference',
    sourceUrl: 'https://glitchy.website/',
  },
  { id: 'silent', label: 'Silent', sourceLabel: null, sourceUrl: null },
] as const;

export const SOUND_EVENTS = [
  { id: 'hover', label: 'Hover' },
  { id: 'activate', label: 'Buttons' },
  { id: 'select', label: 'Selections' },
  { id: 'scan', label: 'Chart scanner' },
  { id: 'open', label: 'Panels & details' },
  { id: 'type', label: 'Text effects' },
  { id: 'intro', label: 'Intro & boot' },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];
export type BackgroundId = (typeof BACKGROUNDS)[number]['id'];
export type GlowId = (typeof GLOW_LEVELS)[number]['id'];
export type FrameStyleId = (typeof FRAME_STYLES)[number]['id'];
export type SurfaceId = (typeof SURFACES)[number]['id'];
export type DensityId = (typeof DENSITIES)[number]['id'];
export type MeterStyleId = (typeof METER_STYLES)[number]['id'];
export type FontId = (typeof FONTS)[number]['id'];
export type HeadingCaseId = (typeof HEADING_CASES)[number]['id'];
export type TextEffectId = (typeof TEXT_EFFECTS)[number]['id'];
export type ScanlineId = (typeof SCANLINE_LEVELS)[number]['id'];
export type IntroId = (typeof INTROS)[number]['id'];
export type ChartStyleId = (typeof CHART_STYLES)[number]['id'];
export type ChartGridId = (typeof CHART_GRIDS)[number]['id'];
export type EntranceId = (typeof ENTRANCES)[number]['id'];
export type SoundPresetId = (typeof SOUND_PRESETS)[number]['id'];
export type SoundEventId = (typeof SOUND_EVENTS)[number]['id'];

export type SoundEffects = Record<SoundEventId, SoundPresetId>;

export interface UiSettings {
  // Color
  palette: PaletteId;
  // Surfaces
  glow: GlowId;
  frame: FrameStyleId;
  cornerSize: number;
  surface: SurfaceId;
  density: DensityId;
  meter: MeterStyleId;
  // Typography
  font: FontId;
  headingCase: HeadingCaseId;
  textEffect: TextEffectId;
  // Scene
  background: BackgroundId;
  backgroundIntensity: number;
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
  // Motion
  animations: boolean;
  entrance: EntranceId;
  stagger: boolean;
  animationSpeed: number;
  // Audio
  sound: boolean;
  volume: number;
  effects: SoundEffects;
}

export const SETTINGS_STORAGE_KEY = 'immortality.ui-settings.v1';

/** Defaults reproduce the original dashboard exactly; every new axis is opt-in. */
export const DEFAULT_SETTINGS: UiSettings = {
  palette: 'mission',
  glow: 'light',
  frame: 'corners',
  cornerSize: 14,
  surface: 'gradient',
  density: 'comfortable',
  meter: 'bar',
  font: 'system',
  headingCase: 'upper',
  textEffect: 'none',
  background: 'stars',
  backgroundIntensity: 100,
  scanlines: 'off',
  scanSweep: false,
  vignette: false,
  flicker: false,
  noise: false,
  illuminator: false,
  statusBar: false,
  intro: 'none',
  chartStyle: 'line',
  chartGrid: 'solid',
  animations: true,
  entrance: 'assemble',
  stagger: false,
  animationSpeed: 100,
  sound: true,
  volume: 100,
  effects: {
    hover: 'spark',
    activate: 'confirm',
    select: 'transmit',
    scan: 'scanner',
    open: 'silent',
    type: 'silent',
    intro: 'deploy',
  },
};

export type ScalarKey = Exclude<keyof UiSettings, 'effects'>;

export const SETTING_GROUPS = [
  { id: 'color', label: 'Color' },
  { id: 'surface', label: 'Panels' },
  { id: 'type', label: 'Type & text' },
  { id: 'scene', label: 'Scene & overlays' },
  { id: 'hud', label: 'HUD & charts' },
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
  /** Render as a grid of swatch buttons instead of a select. */
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
  { key: 'surface', kind: 'choice', label: 'Panel surface', group: 'surface', options: SURFACES },
  { key: 'density', kind: 'choice', label: 'Layout density', group: 'surface', options: DENSITIES },
  {
    key: 'meter',
    kind: 'choice',
    label: 'Progress meter',
    group: 'surface',
    options: METER_STYLES,
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
  { key: 'headingCase', kind: 'choice', label: 'Heading case', group: 'type', options: HEADING_CASES },
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
  { key: 'flicker', kind: 'toggle', label: 'Screen flicker', group: 'scene', sources: ['glitchy'] },
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
  { key: 'chartGrid', kind: 'choice', label: 'Chart gridlines', group: 'hud', options: CHART_GRIDS },
  { key: 'animations', kind: 'toggle', label: 'Animations', group: 'motion' },
  {
    key: 'entrance',
    kind: 'choice',
    label: 'Panel entrance',
    group: 'motion',
    options: ENTRANCES,
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
];

export const AXIS_BY_KEY: Readonly<Record<ScalarKey, Axis>> = Object.fromEntries(
  AXES.map((axis) => [axis.key, axis])
) as Record<ScalarKey, Axis>;

const soundPresetIds = new Set<string>(SOUND_PRESETS.map(({ id }) => id));

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
    const value = savedEffects[id];
    if (typeof value === 'string' && soundPresetIds.has(value)) {
      next.effects[id] = value as SoundPresetId;
    }
  }
  return next;
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

/** Only the values that differ from the defaults — compact for share links. */
export function diffFromDefaults(settings: UiSettings): Partial<UiSettings> {
  const diff: Record<string, unknown> = {};
  for (const axis of AXES) {
    if (settings[axis.key] !== DEFAULT_SETTINGS[axis.key]) diff[axis.key] = settings[axis.key];
  }
  const effects: Partial<SoundEffects> = {};
  for (const { id } of SOUND_EVENTS) {
    if (settings.effects[id] !== DEFAULT_SETTINGS.effects[id]) effects[id] = settings.effects[id];
  }
  if (Object.keys(effects).length > 0) diff.effects = effects;
  return diff as Partial<UiSettings>;
}

export const SHARE_HASH_PREFIX = '#ui=';

/** Encodes settings for a URL hash, e.g. `#ui=%7B%22palette%22%3A%22ares%22%7D`. */
export function encodeShareHash(settings: UiSettings): string {
  return SHARE_HASH_PREFIX + encodeURIComponent(JSON.stringify(diffFromDefaults(settings)));
}

/** Decodes a `#ui=` hash; returns `null` when the hash carries no settings. */
export function decodeShareHash(hash: string): UiSettings | null {
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null;
  try {
    return mergeSettings(
      DEFAULT_SETTINGS,
      JSON.parse(decodeURIComponent(hash.slice(SHARE_HASH_PREFIX.length)))
    );
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

const preset = (
  id: string,
  label: string,
  description: string,
  sources: readonly ReferenceId[],
  overrides: Partial<Omit<UiSettings, 'effects'>> & { effects?: Partial<SoundEffects> }
): Preset => ({
  id,
  label,
  description,
  sources,
  settings: {
    ...DEFAULT_SETTINGS,
    ...overrides,
    effects: { ...DEFAULT_SETTINGS.effects, ...overrides.effects },
  },
});

/** Complete looks assembled from each reference, as starting points for experiments. */
export const PRESETS: readonly Preset[] = [
  preset('mission', 'Mission control', 'The original dashboard.', [], {}),
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
      scanlines: 'light',
      scanSweep: true,
      statusBar: true,
      intro: 'boot',
      meter: 'segmented',
      chartStyle: 'glow',
      chartGrid: 'dashed',
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
      statusBar: true,
      meter: 'ring',
      chartStyle: 'area',
      chartGrid: 'dashed',
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
      font: 'electrolize',
      textEffect: 'decipher',
      background: 'moving-lines',
      illuminator: true,
      entrance: 'assemble',
      stagger: true,
      effects: { open: 'expand', type: 'typing' },
    }
  ),
  preset(
    'soulextract',
    'Soul Extract',
    'Orbitron titles typing over a pulsing circuit board.',
    ['soulextract', 'soulextractSource'],
    {
      palette: 'soulextract',
      glow: 'medium',
      frame: 'lines',
      font: 'orbitron',
      textEffect: 'sequence',
      background: 'circuit',
      entrance: 'fade',
      stagger: true,
      effects: { open: 'expand', type: 'typing', intro: 'deploy' },
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
      surface: 'glass',
      font: 'electrolize',
      headingCase: 'normal',
      textEffect: 'glitch',
      background: 'nebula',
      scanlines: 'medium',
      vignette: true,
      flicker: true,
      noise: true,
      intro: 'transmission',
      entrance: 'flicker',
      effects: { activate: 'static', open: 'transmit' },
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
      textEffect: 'decipher',
      background: 'data-rain',
      meter: 'segmented',
      chartStyle: 'step',
      chartGrid: 'dots',
      statusBar: true,
      entrance: 'scan',
      effects: { type: 'typing' },
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
      chartGrid: 'dots',
      entrance: 'fade',
      sound: false,
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
const RANDOMIZER_LOCKED = new Set<ScalarKey>(['animations', 'sound', 'volume', 'intro']);

/** Random combination of every visual axis — a quick way to explore the space. */
export function randomizeSettings(current: UiSettings, random: () => number = Math.random): UiSettings {
  const next: UiSettings = { ...current, effects: { ...current.effects } };
  const writable = next as unknown as Record<string, unknown>;
  const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length) % items.length];
  for (const axis of AXES) {
    if (RANDOMIZER_LOCKED.has(axis.key)) continue;
    if (axis.kind === 'choice') writable[axis.key] = pick(axis.options).id;
    else if (axis.kind === 'toggle') writable[axis.key] = random() < 0.5;
    else {
      const steps = Math.round((axis.max - axis.min) / axis.step);
      writable[axis.key] = axis.min + Math.round(random() * steps) * axis.step;
    }
  }
  return next;
}
