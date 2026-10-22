import { describe, expect, it } from 'vitest';
import { PRESET_SPECS, sounds } from './sound';
import {
  AXES,
  AXIS_BY_KEY,
  DEFAULT_SETTINGS,
  PRESETS,
  REFERENCES,
  SETTING_GROUPS,
  SOUND_EVENTS,
  SOUND_PRESETS,
  countCustomized,
  decodeShareHash,
  diffFromDefaults,
  encodeShareHash,
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

describe('UI settings', () => {
  it('keeps the existing look while enabling sound and motion by default', () => {
    expect(DEFAULT_SETTINGS).toMatchObject({
      palette: 'mission',
      background: 'stars',
      animations: true,
      sound: true,
      effects: {
        hover: 'spark',
        activate: 'confirm',
        select: 'transmit',
        scan: 'scanner',
      },
    });
    // Every new axis is opt-in: the defaults reproduce the original dashboard.
    expect(DEFAULT_SETTINGS).toMatchObject({
      glow: 'light',
      frame: 'corners',
      surface: 'gradient',
      font: 'system',
      textEffect: 'none',
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
      entrance: 'assemble',
      stagger: false,
      animationSpeed: 100,
      backgroundIntensity: 100,
      volume: 100,
    });
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

  it('provides a direct reference or source link and a synth for every audible preset', () => {
    for (const preset of SOUND_PRESETS.filter(({ id }) => id !== 'silent')) {
      expect(preset.sourceUrl).toMatch(/^https:\/\//);
      expect(PRESET_SPECS[preset.id]).not.toBeNull();
    }
    expect(PRESET_SPECS.silent).toBeNull();
    for (const { id } of SOUND_EVENTS) expect(DEFAULT_SETTINGS.effects[id]).toBeDefined();
  });

  it('merges a valid saved preference with new defaults', () => {
    expect(parseStoredSettings('{"palette":"glitchy","sound":false}')).toEqual({
      ...DEFAULT_SETTINGS,
      palette: 'glitchy',
      sound: false,
    });
  });

  it('upgrades settings saved before the new axes existed', () => {
    const legacy = JSON.stringify({
      palette: 'amber',
      background: 'galaxy',
      animations: false,
      sound: true,
      effects: { hover: 'soft', activate: 'confirm', select: 'transmit', scan: 'scanner' },
    });
    expect(parseStoredSettings(legacy)).toEqual({
      ...DEFAULT_SETTINGS,
      palette: 'amber',
      background: 'galaxy',
      animations: false,
      effects: { ...DEFAULT_SETTINGS.effects, hover: 'soft' },
    });
  });

  it('rejects invalid and stale saved values without breaking the UI', () => {
    expect(
      parseStoredSettings(
        '{"palette":"removed","background":"black-hole","animations":"yes",' +
          '"glow":42,"cornerSize":"big","volume":null,' +
          '"effects":{"hover":"missing","activate":"soft"}}'
      )
    ).toEqual({
      ...DEFAULT_SETTINGS,
      effects: {
        ...DEFAULT_SETTINGS.effects,
        activate: 'soft',
      },
    });
    expect(parseStoredSettings('not-json')).toEqual(DEFAULT_SETTINGS);
    expect(parseStoredSettings('null')).toEqual(DEFAULT_SETTINGS);
    expect(parseStoredSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it('clamps out-of-range numeric values', () => {
    const parsed = parseStoredSettings('{"cornerSize":999,"volume":-5,"animationSpeed":1}');
    expect(parsed.cornerSize).toBe(32);
    expect(parsed.volume).toBe(0);
    expect(parsed.animationSpeed).toBe(25);
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
      effects: { ...DEFAULT_SETTINGS.effects, hover: 'pulse' },
    };
    expect(diffFromDefaults(custom)).toEqual({ glow: 'heavy', effects: { hover: 'pulse' } });
    expect(countCustomized(custom)).toBe(2);
  });

  it('ignores unrelated or malformed hashes', () => {
    expect(decodeShareHash('')).toBeNull();
    expect(decodeShareHash('#methodology')).toBeNull();
    expect(decodeShareHash('#ui=%7Bbroken')).toBeNull();
    expect(decodeShareHash('#ui=%7B%22palette%22%3A%22nope%22%7D')).toEqual(DEFAULT_SETTINGS);
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
