import { DEFAULT_SETTINGS, type SoundEffects, type SoundPresetId } from './settings';

// Interactive UI bleeps synthesized with the Web Audio API — no audio assets,
// tracking, or third-party requests. Audio is enabled by default, but the
// AudioContext remains lazy so browser autoplay policies are respected.

let ctx: AudioContext | null = null;
let enabled = DEFAULT_SETTINGS.sound;
let volume = DEFAULT_SETTINGS.volume / 100;
let effects: SoundEffects = { ...DEFAULT_SETTINGS.effects };

function context(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {
      // A later user gesture will retry if this interaction was not eligible.
    });
  }
  return ctx;
}

interface ToneSpec {
  kind: 'tone';
  type: OscillatorType;
  from: number;
  to: number;
  duration: number;
  gain: number;
  /** Repeat the tone this many times, `gap` seconds apart (typing ticks, deploy chirps). */
  repeat?: number;
  gap?: number;
}

interface NoiseSpec {
  kind: 'noise';
  duration: number;
  gain: number;
  /** Band-pass center frequency that colours the static. */
  filter: number;
}

export type BleepSpec = ToneSpec | NoiseSpec;

export const PRESET_SPECS: Record<SoundPresetId, BleepSpec | null> = {
  spark: { kind: 'tone', type: 'sine', from: 1400, to: 1250, duration: 0.045, gain: 0.015 },
  confirm: { kind: 'tone', type: 'square', from: 880, to: 590, duration: 0.09, gain: 0.03 },
  transmit: { kind: 'tone', type: 'triangle', from: 440, to: 1180, duration: 0.16, gain: 0.04 },
  scanner: { kind: 'tone', type: 'sine', from: 980, to: 940, duration: 0.025, gain: 0.008 },
  soft: { kind: 'tone', type: 'sine', from: 520, to: 420, duration: 0.08, gain: 0.018 },
  pulse: { kind: 'tone', type: 'sine', from: 220, to: 440, duration: 0.14, gain: 0.025 },
  typing: {
    kind: 'tone',
    type: 'square',
    from: 1900,
    to: 1700,
    duration: 0.018,
    gain: 0.01,
    repeat: 4,
    gap: 0.05,
  },
  deploy: {
    kind: 'tone',
    type: 'sawtooth',
    from: 180,
    to: 920,
    duration: 0.32,
    gain: 0.02,
    repeat: 2,
    gap: 0.12,
  },
  expand: { kind: 'tone', type: 'triangle', from: 300, to: 760, duration: 0.12, gain: 0.03 },
  static: { kind: 'noise', duration: 0.12, gain: 0.05, filter: 2400 },
  silent: null,
};

let noiseBuffer: AudioBuffer | null = null;
function whiteNoise(audio: AudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== audio.sampleRate) {
    noiseBuffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.5), audio.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function envelope(audio: AudioContext, start: number, duration: number, gain: number): GainNode {
  const amp = audio.createGain();
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  amp.connect(audio.destination);
  return amp;
}

function play(spec: BleepSpec, audio: AudioContext): void {
  const now = audio.currentTime;
  if (spec.kind === 'noise') {
    const src = audio.createBufferSource();
    src.buffer = whiteNoise(audio);
    const band = audio.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = spec.filter;
    src.connect(band).connect(envelope(audio, now, spec.duration, spec.gain * volume));
    src.start(now, Math.random() * 0.3);
    src.stop(now + spec.duration + 0.02);
    return;
  }
  for (let i = 0; i < (spec.repeat ?? 1); i++) {
    const start = now + i * (spec.gap ?? 0);
    const osc = audio.createOscillator();
    osc.type = spec.type;
    osc.frequency.setValueAtTime(spec.from, start);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, spec.to), start + spec.duration);
    osc.connect(envelope(audio, start, spec.duration, spec.gain * volume));
    osc.start(start);
    osc.stop(start + spec.duration + 0.02);
  }
}

function bleep(preset: SoundPresetId): void {
  if (!enabled || volume <= 0) return;
  const spec = PRESET_SPECS[preset];
  if (!spec) return;
  const audio = context();
  if (!audio) return;
  play(spec, audio);
}

export const sounds = {
  configure(soundEnabled: boolean, soundEffects: SoundEffects, soundVolume = 100): void {
    enabled = soundEnabled;
    effects = { ...soundEffects };
    volume = Math.max(0, soundVolume) / 100;
  },
  setEnabled(value: boolean): void {
    enabled = value;
    if (value) bleep('transmit');
  },
  isEnabled(): boolean {
    return enabled;
  },
  volume(): number {
    return volume;
  },
  preview(preset: SoundPresetId): void {
    bleep(preset);
  },
  hover(): void {
    bleep(effects.hover);
  },
  click(): void {
    bleep(effects.activate);
  },
  select(): void {
    bleep(effects.select);
  },
  scan(): void {
    bleep(effects.scan);
  },
  open(): void {
    bleep(effects.open);
  },
  type(): void {
    bleep(effects.type);
  },
  intro(): void {
    bleep(effects.intro);
  },
};

let lastScan = 0;
export function throttledScan(): void {
  const now = performance.now();
  if (now - lastScan > 90) {
    lastScan = now;
    sounds.scan();
  }
}
