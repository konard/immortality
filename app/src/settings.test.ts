import { describe, expect, it } from 'vitest';
import { SOUND_SPECS, chooseSounds, sounds } from './sound';
import {
  AXES,
  AXIS_BY_KEY,
  DEFAULT_SETTINGS,
  LEGACY_V1_BASE,
  LEGACY_V1_LOOK,
  MAX_SOUNDS_PER_EVENT,
  PRESETS,
  REFERENCES,
  SETTING_GROUPS,
  SHARE_VERSION,
  SOUNDS,
  SOUND_EVENTS,
  SURFACES,
  applyPreset,
  coerceSoundList,
  migrateLegacySettings,
  applySharedLook,
  countCustomized,
  decodeShareHash,
  diffFromDefaults,
  encodeShareHash,
  isPresetActive,
  parseStoredSettings,
  randomizeSettings,
  type UiSettings,
} from './settings';

function seeded(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const ISSUE_7_LINK =
  '#ui=%7B%22palette%22%3A%22poseidon%22%2C%22glow%22%3A%22medium%22%2C%22surface%22%3A%22transparent%22' +
  '%2C%22density%22%3A%22spacious%22%2C%22meter%22%3A%22segmented%22%2C%22font%22%3A%22orbitron%22' +
  '%2C%22textEffect%22%3A%22sequence%22%2C%22background%22%3A%22perspective-grid%22%2C%22statusBar%22' +
  '%3Atrue%2C%22intro%22%3A%22boot%22%2C%22chartStyle%22%3A%22area%22%2C%22chartGrid%22%3A%22dashed%22' +
  '%2C%22entrance%22%3A%22scan%22%2C%22stagger%22%3Atrue%7D';

describe('UI settings', () => {
  it('uses the default look requested in issue #7', () => {
    expect(DEFAULT_SETTINGS).toMatchObject({
      palette: 'poseidon',
      glow: 'medium',
      surface: 'transparent',
      density: 'spacious',
      meter: 'segmented',
      font: 'orbitron',
      textEffect: 'sequence',
      background: 'perspective-grid',
      statusBar: true,
      intro: 'boot',
      chartStyle: 'area',
      chartGrid: 'dashed',
      entrance: 'scan',
      stagger: true,
      animations: true,
      sound: true,
    });
    // The link from the issue (an unversioned first-release link) decodes to exactly the defaults.
    expect(decodeShareHash(ISSUE_7_LINK)).toEqual(DEFAULT_SETTINGS);
    expect(sounds.isEnabled()).toBe(true);
  });

  it('describes every scalar setting with exactly one schema axis', () => {
    const scalarKeys = Object.keys(DEFAULT_SETTINGS).filter((key) => key !== 'effects').sort();
    expect(AXES.map(({ key }) => key).sort()).toEqual(scalarKeys);
    const groups = new Set<string>(SETTING_GROUPS.map(({ id }) => id));
    for (const axis of AXES) {
      expect(groups.has(axis.group)).toBe(true);
      expect(AXIS_BY_KEY[axis.key]).toBe(axis);
      const value = DEFAULT_SETTINGS[axis.key];
      if (axis.kind === 'choice') {
        expect(axis.options.map(({ id }) => id)).toContain(value);
        expect(new Set(axis.options.map(({ id }) => id)).size).toBe(axis.options.length);
      } else if (axis.kind === 'toggle') {
        expect(typeof value).toBe('boolean');
      } else {
        expect(value).toBeGreaterThanOrEqual(axis.min);
        expect(value).toBeLessThanOrEqual(axis.max);
      }
      for (const source of axis.sources ?? []) expect(REFERENCES[source]).toBeDefined();
    }
  });

  it('links every reference to an https source', () => {
    for (const reference of Object.values(REFERENCES)) {
      expect(reference.url).toMatch(/^https:\/\//);
    }
  });

  it('names sounds by character, not by the action they play on', () => {
    const actions = SOUND_EVENTS.flatMap(({ id, label }) => [id, ...label.toLowerCase().split(/\W+/)]);
    const actionWords = new Set([...actions, 'click', 'confirm', 'select', 'scanner', 'typing', 'deploy']);
    expect(new Set(SOUNDS.map(({ id }) => id)).size).toBe(SOUNDS.length);
    for (const sound of SOUNDS) {
      expect(actionWords.has(sound.id)).toBe(false);
      expect(sound.sourceUrl).toMatch(/^https:\/\//);
      expect(SOUND_SPECS[sound.id].voices.length).toBeGreaterThan(0);
    }
    expect(Object.keys(SOUND_SPECS).sort()).toEqual(SOUNDS.map(({ id }) => id).sort());
  });

  it('maps one or more sounds to every interaction', () => {
    for (const { id } of SOUND_EVENTS) {
      const list = DEFAULT_SETTINGS.effects[id];
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeLessThanOrEqual(MAX_SOUNDS_PER_EVENT);
    }
    expect(DEFAULT_SETTINGS.effects.activate.length).toBeGreaterThan(1);
  });

  it('normalizes sound lists, including first-release single sound ids', () => {
    expect(coerceSoundList('confirm')).toEqual(['cobalt']);
    expect(coerceSoundList('silent')).toEqual([]);
    expect(coerceSoundList('missing')).toBeUndefined();
    expect(coerceSoundList(['halo', 'halo', 'nope', 'spark', 7])).toEqual(['halo', 'quartz']);
    expect(coerceSoundList(SOUNDS.map(({ id }) => id))).toHaveLength(MAX_SOUNDS_PER_EVENT);
    expect(coerceSoundList({})).toBeUndefined();
  });

  it('merges a valid saved preference with new defaults', () => {
    expect(parseStoredSettings('{"palette":"glitchy","sound":false}')).toEqual({
      ...DEFAULT_SETTINGS,
      palette: 'glitchy',
      sound: false,
    });
  });

  it('migrates first-release storage, keeping only what the visitor changed', () => {
    const untouched = JSON.stringify({
      ...LEGACY_V1_LOOK,
      animations: true,
      sound: true,
      effects: { hover: 'spark', activate: 'confirm', select: 'transmit', scan: 'scanner' },
    });
    expect(migrateLegacySettings(untouched)).toEqual(DEFAULT_SETTINGS);
    const customized = JSON.stringify({
      ...LEGACY_V1_LOOK,
      palette: 'amber',
      animations: false,
      effects: { hover: 'soft', activate: 'confirm', select: 'transmit', scan: 'silent' },
    });
    expect(migrateLegacySettings(customized)).toEqual({
      ...DEFAULT_SETTINGS,
      palette: 'amber',
      animations: false,
      effects: { ...DEFAULT_SETTINGS.effects, hover: ['halo'], scan: [] },
    });
    expect(migrateLegacySettings('not-json')).toEqual(DEFAULT_SETTINGS);
    expect(migrateLegacySettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it('rejects invalid and stale saved values without breaking the UI', () => {
    expect(
      parseStoredSettings(
        '{"palette":"removed","background":"black-hole","animations":"yes",' +
          '"glow":42,"cornerSize":"big","volume":null,"surface":"plywood",' +
          '"effects":{"hover":"missing","activate":["halo"]}}'
      )
    ).toEqual({
      ...DEFAULT_SETTINGS,
      effects: { ...DEFAULT_SETTINGS.effects, activate: ['halo'] },
    });
    expect(parseStoredSettings('not-json')).toEqual(DEFAULT_SETTINGS);
    expect(parseStoredSettings('null')).toEqual(DEFAULT_SETTINGS);
    expect(parseStoredSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it('clamps out-of-range numeric values', () => {
    const parsed = parseStoredSettings(
      '{"cornerSize":999,"volume":-5,"animationSpeed":1,"surfaceOpacity":400,"fontScale":1}'
    );
    expect(parsed.cornerSize).toBe(32);
    expect(parsed.volume).toBe(0);
    expect(parsed.animationSpeed).toBe(25);
    const opacity = AXIS_BY_KEY.surfaceOpacity;
    const scale = AXIS_BY_KEY.fontScale;
    if (opacity.kind !== 'range' || scale.kind !== 'range') throw new Error('range axes expected');
    expect(parsed.surfaceOpacity).toBe(opacity.max);
    expect(parsed.fontScale).toBe(scale.min);
  });

  it('offers wood, metals and other materials with a configurable opacity', () => {
    const surfaces = SURFACES.map(({ id }) => id as string);
    for (const id of ['glass', 'solid', 'transparent', 'wood', 'steel', 'carbon', 'marble']) {
      expect(surfaces).toContain(id);
    }
    expect(AXIS_BY_KEY.surfaceOpacity.kind).toBe('range');
    expect(AXIS_BY_KEY.surfaceBlur.kind).toBe('range');
  });
});

describe('sound selection', () => {
  it('picks according to the multi-sound mode', () => {
    const list = ['quartz', 'halo', 'nova'] as const;
    expect(chooseSounds([], 'random', 0)).toEqual([]);
    expect(chooseSounds(list, 'layer', 0)).toEqual([...list]);
    expect([0, 1, 2, 3].map((turn) => chooseSounds(list, 'cycle', turn)[0])).toEqual([
      'quartz',
      'halo',
      'nova',
      'quartz',
    ]);
    expect(chooseSounds(list, 'random', 0, () => 0.99)).toEqual(['nova']);
  });

  it('never repeats the previous random pick when there is a choice', () => {
    const list = ['quartz', 'halo'] as const;
    for (const value of [0, 0.3, 0.6, 0.99]) {
      expect(chooseSounds(list, 'random', 0, () => value, 'quartz')).toEqual(['halo']);
    }
    expect(chooseSounds(['ion'], 'random', 0, () => 0.5, 'ion')).toEqual(['ion']);
  });
});

describe('presets', () => {
  it('ships valid, distinct, complete settings for every preset', () => {
    expect(PRESETS[0].settings).toEqual(DEFAULT_SETTINGS);
    expect(new Set(PRESETS.map(({ id }) => id)).size).toBe(PRESETS.length);
    for (const { settings, sources } of PRESETS) {
      expect(parseStoredSettings(JSON.stringify(settings))).toEqual(settings);
      for (const source of sources) expect(REFERENCES[source]).toBeDefined();
    }
    const fingerprints = PRESETS.map(({ settings }) => JSON.stringify(settings));
    expect(new Set(fingerprints).size).toBe(PRESETS.length);
  });

  it('keeps comfort settings when applied, but a silent preset still mutes', () => {
    const viewer: UiSettings = { ...DEFAULT_SETTINGS, animations: false, sound: false, volume: 25 };
    for (const preset of PRESETS) {
      const next = applyPreset(preset, viewer);
      expect(next).toMatchObject({ animations: false, sound: false, volume: 25 });
      expect(isPresetActive(preset, next)).toBe(true);
    }
    const listening: UiSettings = { ...DEFAULT_SETTINGS, sound: true };
    const quiet = PRESETS.find(({ id }) => id === 'minimal')!;
    expect(applyPreset(quiet, listening).sound).toBe(false);
    const grid = PRESETS.find(({ id }) => id === 'grid')!;
    expect(applyPreset(grid, listening).sound).toBe(true);
  });

  it('covers every requested reference with a dedicated preset', () => {
    const covered = new Set(PRESETS.flatMap(({ sources }) => sources));
    for (const source of ['gridcn', 'arwes', 'romel', 'soulextract', 'glitchy', 'zknet'] as const) {
      expect(covered.has(source)).toBe(true);
    }
  });
});

describe('share links and randomizer', () => {
  it('encodes only changed values and round-trips through the URL hash', () => {
    expect(diffFromDefaults(DEFAULT_SETTINGS)).toEqual({});
    expect(countCustomized(DEFAULT_SETTINGS)).toBe(0);
    for (const { settings } of PRESETS) {
      const hash = encodeShareHash(settings);
      expect(hash.startsWith('#ui=')).toBe(true);
      expect(decodeShareHash(hash)).toEqual(settings);
    }
    const custom: UiSettings = {
      ...DEFAULT_SETTINGS,
      glow: 'heavy',
      effects: { ...DEFAULT_SETTINGS.effects, hover: ['tide', 'halo'] },
    };
    expect(diffFromDefaults(custom)).toEqual({ glow: 'heavy', effects: { hover: ['tide', 'halo'] } });
    expect(countCustomized(custom)).toBe(2);
    const hash = encodeShareHash(custom);
    expect(JSON.parse(decodeURIComponent(hash.slice(4))).v).toBe(SHARE_VERSION);
  });

  it('keeps first-release share links showing the look that was shared', () => {
    const legacy = '#ui=' + encodeURIComponent(JSON.stringify({ glow: 'heavy', effects: { hover: 'pulse' } }));
    expect(decodeShareHash(legacy)).toEqual({
      ...LEGACY_V1_BASE,
      glow: 'heavy',
      effects: { ...LEGACY_V1_BASE.effects, hover: ['tide'] },
    });
  });

  it('applies a shared look without overriding the viewer motion and audio choices', () => {
    const sender: UiSettings = { ...DEFAULT_SETTINGS, palette: 'ares', sound: true, volume: 100 };
    const viewer: UiSettings = { ...DEFAULT_SETTINGS, animations: false, sound: false, volume: 10 };
    const shared = decodeShareHash(encodeShareHash(sender))!;
    const applied = applySharedLook(viewer, shared);
    expect(applied.palette).toBe('ares');
    expect(applied).toMatchObject({ animations: false, sound: false, volume: 10 });
  });

  it('ignores unrelated or malformed hashes', () => {
    expect(decodeShareHash('')).toBeNull();
    expect(decodeShareHash('#methodology')).toBeNull();
    expect(decodeShareHash('#ui=%7Bbroken')).toBeNull();
    expect(decodeShareHash('#ui=%7B%22v%22%3A2%2C%22palette%22%3A%22nope%22%7D')).toEqual(DEFAULT_SETTINGS);
    expect(decodeShareHash('#ui=%7B%22palette%22%3A%22nope%22%7D')).toEqual(LEGACY_V1_BASE);
  });

  it('randomizes visual axes deterministically and keeps comfort settings', () => {
    const base: UiSettings = { ...DEFAULT_SETTINGS, sound: false, volume: 30, animations: false };
    const a = randomizeSettings(base, seeded(7));
    const b = randomizeSettings(base, seeded(7));
    expect(a).toEqual(b);
    expect(a).not.toEqual(base);
    expect(parseStoredSettings(JSON.stringify(a))).toEqual(a);
    expect(a.sound).toBe(false);
    expect(a.volume).toBe(30);
    expect(a.animations).toBe(false);
    expect(a.intro).toBe(base.intro);
  });
});
