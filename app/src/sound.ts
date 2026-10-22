import {
  DEFAULT_SETTINGS,
  type SoundEffects,
  type SoundEventId,
  type SoundId,
  type SoundModeId,
  type SoundToneId,
  type UiSettings,
} from './settings';

// Interactive UI sounds synthesized with the Web Audio API — no audio assets,
// tracking, or third-party requests. Audio is enabled by default, but the
// AudioContext remains lazy so browser autoplay policies are respected.
//
// Every sound is a small patch of layered voices (oscillators with optional FM and
// filter sweeps, or filtered noise) with click-free envelopes. All voices run through
// one master bus: tone shelf → compressor/limiter → output, with a convolution reverb
// send, per-play detune and optional pointer-positioned stereo panning.

interface Sweep {
  from: number;
  to: number;
}

interface FilterSpec {
  type: BiquadFilterType;
  freq: Sweep;
  q?: number;
}

interface VoiceBase {
  /** Seconds after the trigger. */
  delay?: number;
  duration: number;
  gain: number;
  /** Attack time in seconds; defaults to 4 ms which avoids clicks without softening. */
  attack?: number;
  filter?: FilterSpec;
  /** Fixed stereo position (-1 left … 1 right), added to the pointer position. */
  pan?: number;
}

interface ToneVoice extends VoiceBase {
  kind: 'tone';
  wave: OscillatorType;
  freq: Sweep;
  /** Static detune in cents, e.g. for chorus-like pairs. */
  detune?: number;
  /** Frequency modulation: modulator at `ratio`×carrier, depth decaying from `index`. */
  fm?: { ratio: number; index: number };
}

interface NoiseVoice extends VoiceBase {
  kind: 'noise';
  filter: FilterSpec;
}

export type Voice = ToneVoice | NoiseVoice;

export interface SoundSpec {
  voices: readonly Voice[];
  /** Repeat the whole patch this many times, `gap` seconds apart. */
  repeat?: number;
  gap?: number;
  /** Gain multiplier applied to every further repeat (echo tails). */
  repeatDecay?: number;
}

const tone = (
  wave: OscillatorType,
  from: number,
  to: number,
  duration: number,
  gain: number,
  extra: Partial<ToneVoice> = {}
): ToneVoice => ({ kind: 'tone', wave, freq: { from, to }, duration, gain, ...extra });

const noise = (
  type: BiquadFilterType,
  from: number,
  to: number,
  duration: number,
  gain: number,
  { q = 1, ...extra }: Omit<Partial<NoiseVoice>, 'filter'> & { q?: number } = {}
): NoiseVoice => ({ kind: 'noise', filter: { type, freq: { from, to }, q }, duration, gain, ...extra });

/** The patch behind every entry of `SOUNDS` in settings.ts. */
export const SOUND_SPECS: Record<SoundId, SoundSpec> = {
  quartz: {
    voices: [
      tone('sine', 1400, 1250, 0.05, 0.016),
      tone('sine', 3860, 3500, 0.03, 0.004),
    ],
  },
  cobalt: {
    voices: [
      tone('square', 880, 590, 0.09, 0.024, {
        filter: { type: 'lowpass', freq: { from: 4200, to: 1600 }, q: 0.7 },
      }),
      tone('sine', 440, 295, 0.09, 0.014),
    ],
  },
  comet: {
    voices: [
      tone('triangle', 440, 1180, 0.16, 0.04),
      tone('sine', 880, 2360, 0.12, 0.007, { delay: 0.02 }),
    ],
  },
  ion: { voices: [tone('sine', 980, 940, 0.028, 0.014)] },
  halo: {
    voices: [tone('sine', 520, 420, 0.09, 0.02), tone('sine', 1040, 840, 0.06, 0.005)],
  },
  tide: {
    voices: [tone('sine', 220, 440, 0.16, 0.026), tone('triangle', 110, 220, 0.16, 0.01)],
  },
  mica: {
    repeat: 4,
    gap: 0.05,
    voices: [
      tone('square', 1900, 1700, 0.018, 0.008, {
        attack: 0.002,
        filter: { type: 'lowpass', freq: { from: 5200, to: 5200 }, q: 0.7 },
      }),
      noise('highpass', 4200, 4200, 0.01, 0.012, { attack: 0.001 }),
    ],
  },
  nova: {
    repeat: 2,
    gap: 0.12,
    voices: [
      tone('sawtooth', 180, 920, 0.32, 0.02, {
        filter: { type: 'lowpass', freq: { from: 700, to: 5200 }, q: 4 },
      }),
      tone('sine', 360, 1840, 0.28, 0.008),
    ],
  },
  zephyr: {
    voices: [
      noise('bandpass', 600, 3200, 0.24, 0.05, { attack: 0.06, q: 1.2 }),
      tone('triangle', 300, 760, 0.14, 0.016, { delay: 0.04 }),
    ],
  },
  ember: {
    voices: [noise('bandpass', 2400, 2400, 0.12, 0.05, { q: 0.8 })],
  },
  prism: {
    voices: [
      tone('sine', 1320, 1320, 0.6, 0.022, { fm: { ratio: 3.5, index: 2.4 } }),
      tone('sine', 2640, 2640, 0.3, 0.005, { delay: 0.01 }),
    ],
  },
  glacier: {
    voices: [
      tone('sine', 1568, 1568, 0.14, 0.02),
      tone('sine', 2093, 2093, 0.3, 0.02, { delay: 0.07 }),
      tone('triangle', 4186, 4186, 0.12, 0.003, { delay: 0.07 }),
    ],
  },
  pulsar: {
    voices: [
      tone('sine', 140, 45, 0.24, 0.08, { attack: 0.002 }),
      noise('highpass', 3000, 3000, 0.008, 0.02, { attack: 0.001 }),
    ],
  },
  orbit: {
    voices: [
      tone('square', 1200, 1180, 0.04, 0.01, { pan: -0.7, filter: { type: 'lowpass', freq: { from: 4000, to: 4000 } } }),
      tone('square', 1500, 1480, 0.04, 0.009, { pan: 0.7, delay: 0.08, filter: { type: 'lowpass', freq: { from: 4000, to: 4000 } } }),
      tone('square', 1800, 1780, 0.04, 0.007, { pan: -0.3, delay: 0.16, filter: { type: 'lowpass', freq: { from: 4000, to: 4000 } } }),
    ],
  },
  vapor: {
    voices: [noise('bandpass', 3200, 480, 0.26, 0.045, { attack: 0.02, q: 1.5 })],
  },
  cinder: {
    repeat: 5,
    gap: 0.032,
    voices: [noise('bandpass', 5200, 4800, 0.014, 0.03, { attack: 0.001, q: 3 })],
  },
  tungsten: {
    voices: [
      tone('sine', 800, 800, 0.42, 0.012, { attack: 0.001 }),
      tone('sine', 1856, 1856, 0.3, 0.008, { attack: 0.001 }),
      tone('sine', 3400, 3400, 0.2, 0.005, { attack: 0.001 }),
      tone('sine', 5304, 5304, 0.12, 0.003, { attack: 0.001 }),
    ],
  },
  helix: {
    voices: [
      tone('triangle', 880, 880, 0.12, 0.016),
      tone('triangle', 1109, 1109, 0.12, 0.016, { delay: 0.05 }),
      tone('triangle', 1319, 1319, 0.26, 0.016, { delay: 0.1 }),
    ],
  },
  drift: {
    voices: [
      tone('sawtooth', 660, 440, 0.26, 0.011, { detune: -12, filter: { type: 'lowpass', freq: { from: 2400, to: 900 } } }),
      tone('sawtooth', 660, 440, 0.26, 0.011, { detune: 12, filter: { type: 'lowpass', freq: { from: 2400, to: 900 } } }),
    ],
  },
  basalt: {
    voices: [
      tone('sine', 190, 118, 0.1, 0.06, { attack: 0.002 }),
      noise('bandpass', 900, 700, 0.025, 0.03, { attack: 0.001, q: 4 }),
    ],
  },
  flint: {
    voices: [
      noise('highpass', 2600, 2600, 0.007, 0.04, { attack: 0.001 }),
      noise('highpass', 2000, 2000, 0.006, 0.02, { attack: 0.001, delay: 0.035 }),
      tone('square', 2400, 2300, 0.01, 0.005, { attack: 0.001 }),
    ],
  },
  opal: {
    voices: [
      tone('sine', 784, 784, 0.36, 0.04, { attack: 0.002 }),
      tone('sine', 3136, 3136, 0.06, 0.01, { attack: 0.001 }),
      tone('sine', 7840, 7840, 0.02, 0.003, { attack: 0.001 }),
    ],
  },
  lumen: {
    voices: [
      tone('sine', 1047, 1047, 0.5, 0.02),
      tone('sine', 1319, 1319, 0.5, 0.018, { delay: 0.06 }),
      tone('triangle', 2093, 2093, 0.2, 0.004),
    ],
  },
  sonar: {
    repeat: 3,
    gap: 0.2,
    repeatDecay: 0.42,
    voices: [tone('sine', 1500, 1480, 0.32, 0.028, { fm: { ratio: 1.01, index: 0.3 } })],
  },
  vesper: {
    voices: [
      tone('sawtooth', 330, 330, 0.75, 0.011, { attack: 0.25, detune: -7, filter: { type: 'lowpass', freq: { from: 900, to: 2200 }, q: 1.2 } }),
      tone('sawtooth', 495, 495, 0.75, 0.009, { attack: 0.25, detune: 7, filter: { type: 'lowpass', freq: { from: 900, to: 2200 }, q: 1.2 } }),
    ],
  },
  relay: {
    voices: [
      tone('square', 3000, 2000, 0.008, 0.014, { attack: 0.001 }),
      tone('square', 2600, 1800, 0.008, 0.012, { attack: 0.001, delay: 0.022 }),
      noise('bandpass', 1800, 1800, 0.012, 0.02, { attack: 0.001, q: 2 }),
    ],
  },
};

export interface SoundOptions {
  mode: SoundModeId;
  tone: SoundToneId;
  /** 0–100 % wet send to the room reverb. */
  reverb: number;
  /** Maximum random detune per play, in cents. */
  pitchVariance: number;
  stereo: boolean;
}

/** Tone shelf gain (dB) at 3.2 kHz for each tone choice. */
const TONE_SHELF: Record<SoundToneId, number> = { warm: -7, neutral: 0, bright: 5 };

let noiseBuffer: AudioBuffer | null = null;
function whiteNoise(audio: BaseAudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== audio.sampleRate) {
    noiseBuffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.5), audio.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/** A short stereo room impulse: decaying, slightly low-passed noise. */
function roomImpulse(audio: BaseAudioContext, seconds = 1.4): AudioBuffer {
  const length = Math.ceil(audio.sampleRate * seconds);
  const buffer = audio.createBuffer(2, length, audio.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      last = last * 0.55 + (Math.random() * 2 - 1) * 0.45;
      data[i] = last * Math.pow(1 - t, 3.2);
    }
  }
  return buffer;
}

export interface Bus {
  input: GainNode;
  shelf: BiquadFilterNode;
  wet: GainNode;
}

/** Builds the master chain on `audio`, ending in `destination`. */
export function createBus(audio: BaseAudioContext, destination: AudioNode = audio.destination): Bus {
  const input = audio.createGain();
  const shelf = audio.createBiquadFilter();
  shelf.type = 'highshelf';
  shelf.frequency.value = 3200;
  const compressor = audio.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 12;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.15;
  const convolver = audio.createConvolver();
  convolver.buffer = roomImpulse(audio);
  const wet = audio.createGain();
  input.connect(shelf);
  shelf.connect(compressor);
  shelf.connect(convolver);
  convolver.connect(wet).connect(compressor);
  compressor.connect(destination);
  return { input, shelf, wet };
}

/** Click-free attack/decay envelope that releases to true silence. */
function envelope(audio: BaseAudioContext, start: number, voice: Voice, gain: number): GainNode {
  const amp = audio.createGain();
  const attack = Math.min(voice.attack ?? 0.004, voice.duration * 0.8);
  const peak = Math.max(0.00011, gain);
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(peak, start + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + voice.duration);
  amp.gain.linearRampToValueAtTime(0, start + voice.duration + 0.01);
  return amp;
}

function sweep(param: AudioParam, value: Sweep, start: number, duration: number): void {
  param.setValueAtTime(value.from, start);
  if (value.to !== value.from) {
    param.exponentialRampToValueAtTime(Math.max(1, value.to), start + duration);
  }
}

/**
 * Schedules `spec` on `audio` into `output`. Exported so experiments can render the
 * library with an OfflineAudioContext.
 */
export function playSpec(
  spec: SoundSpec,
  audio: BaseAudioContext,
  output: AudioNode,
  { gain = 1, detune = 0, pan = 0, at = audio.currentTime } = {}
): number {
  let end = at;
  for (let r = 0; r < (spec.repeat ?? 1); r++) {
    const repeatGain = gain * Math.pow(spec.repeatDecay ?? 1, r);
    for (const voice of spec.voices) {
      const start = at + r * (spec.gap ?? 0) + (voice.delay ?? 0);
      const stop = start + voice.duration + 0.02;
      end = Math.max(end, stop);
      const amp = envelope(audio, start, voice, voice.gain * repeatGain);

      let source: AudioScheduledSourceNode;
      if (voice.kind === 'noise') {
        const src = audio.createBufferSource();
        src.buffer = whiteNoise(audio);
        source = src;
        src.start(start, Math.random() * 0.3);
      } else {
        const osc = audio.createOscillator();
        osc.type = voice.wave;
        sweep(osc.frequency, voice.freq, start, voice.duration);
        osc.detune.value = (voice.detune ?? 0) + detune;
        if (voice.fm) {
          const mod = audio.createOscillator();
          const depth = audio.createGain();
          mod.frequency.value = voice.freq.from * voice.fm.ratio;
          depth.gain.setValueAtTime(voice.freq.from * voice.fm.index, start);
          depth.gain.exponentialRampToValueAtTime(1, start + voice.duration);
          mod.connect(depth).connect(osc.frequency);
          mod.start(start);
          mod.stop(stop);
        }
        source = osc;
        osc.start(start);
      }
      source.stop(stop);

      let node: AudioNode = source;
      if (voice.filter) {
        const filter = audio.createBiquadFilter();
        filter.type = voice.filter.type;
        filter.Q.value = voice.filter.q ?? 1;
        sweep(filter.frequency, voice.filter.freq, start, voice.duration);
        node = node.connect(filter);
      }
      node = node.connect(amp);
      const position = Math.max(-1, Math.min(1, pan + (voice.pan ?? 0)));
      if (position !== 0 && typeof audio.createStereoPanner === 'function') {
        const panner = audio.createStereoPanner();
        panner.pan.value = position;
        node = node.connect(panner);
      }
      node.connect(output);
    }
  }
  return end;
}

/**
 * Picks which sounds of an interaction play, according to the multi-sound mode. Random
 * mode never repeats the `previous` pick back to back (when there is a choice), which
 * keeps rapid repeated cues from sounding mechanical.
 */
export function chooseSounds(
  list: readonly SoundId[],
  mode: SoundModeId,
  turn: number,
  random: () => number = Math.random,
  previous?: SoundId
): SoundId[] {
  if (list.length === 0) return [];
  if (mode === 'layer') return [...list];
  if (mode === 'cycle') return [list[turn % list.length]];
  const pool = list.length > 1 && previous ? list.filter((id) => id !== previous) : list;
  return [pool[Math.floor(random() * pool.length) % pool.length]];
}

let ctx: AudioContext | null = null;
let bus: Bus | null = null;
let enabled = DEFAULT_SETTINGS.sound;
let volume = DEFAULT_SETTINGS.volume / 100;
let effects: SoundEffects = { ...DEFAULT_SETTINGS.effects };
let options: SoundOptions = {
  mode: DEFAULT_SETTINGS.soundMode,
  tone: DEFAULT_SETTINGS.soundTone,
  reverb: DEFAULT_SETTINGS.reverb,
  pitchVariance: DEFAULT_SETTINGS.pitchVariance,
  stereo: DEFAULT_SETTINGS.stereo,
};
const turns: Partial<Record<SoundEventId, number>> = {};
const lastPicked: Partial<Record<SoundEventId, SoundId>> = {};
let pointerPan = 0;

function context(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  // Cues fired by load-time animations (decipher titles, boot log) before the first
  // gesture would only trigger autoplay warnings; stay silent until the user interacts.
  if (!ctx && typeof navigator !== 'undefined' && navigator.userActivation?.hasBeenActive === false) {
    return null;
  }
  if (!ctx) {
    ctx = new AudioContext();
    bus = createBus(ctx);
    applyBus();
  }
  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {
      // A later user gesture will retry if this interaction was not eligible.
    });
  }
  return ctx;
}

function applyBus(): void {
  if (!ctx || !bus) return;
  const now = ctx.currentTime;
  bus.input.gain.setTargetAtTime(volume, now, 0.02);
  bus.shelf.gain.setTargetAtTime(TONE_SHELF[options.tone], now, 0.02);
  bus.wet.gain.setTargetAtTime((options.reverb / 100) * 0.9, now, 0.02);
}

function trackPointer(event: PointerEvent): void {
  pointerPan = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', trackPointer, { passive: true });
  window.addEventListener('pointerdown', trackPointer, { passive: true });
  // Cut reverb tails and scheduled repeats when the tab is hidden; the next cue resumes.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && ctx?.state === 'running') void ctx.suspend().catch(() => undefined);
  });
}

function playSound(id: SoundId, gain = 1): void {
  const audio = context();
  if (!audio || !bus) return;
  const cents = (Math.random() * 2 - 1) * options.pitchVariance;
  const pan = options.stereo ? pointerPan * 0.6 : 0;
  // ±10% level humanization alongside the pitch variance (scaled by the same setting).
  const level = gain * (1 + (Math.random() * 2 - 1) * 0.1 * Math.min(1, options.pitchVariance / 15));
  playSpec(SOUND_SPECS[id], audio, bus.input, { gain: level, detune: cents, pan });
}

export interface SoundCue {
  event: SoundEventId;
  /** Stereo position of the pointer that caused the cue, −1 (left) … 1 (right). */
  pan: number;
}

const cueListeners = new Set<(cue: SoundCue) => void>();

/**
 * Subscribes to interaction cues (the "sound resonance" background draws them). Cues are
 * reported even while sound is muted so the visual echo works on its own. Returns an
 * unsubscribe function.
 */
export function onSoundCue(listener: (cue: SoundCue) => void): () => void {
  cueListeners.add(listener);
  return () => {
    cueListeners.delete(listener);
  };
}

function trigger(event: SoundEventId): void {
  for (const listener of cueListeners) listener({ event, pan: pointerPan });
  if (!enabled || volume <= 0) return;
  const turn = turns[event] ?? 0;
  turns[event] = turn + 1;
  const chosen = chooseSounds(effects[event], options.mode, turn, Math.random, lastPicked[event]);
  if (chosen.length === 1) lastPicked[event] = chosen[0];
  // Layered sounds share the headroom so a stack is not louder than a single cue.
  const gain = 1 / Math.sqrt(Math.max(1, chosen.length));
  for (const id of chosen) playSound(id, gain);
}

export type SoundSettings = Pick<
  UiSettings,
  'sound' | 'volume' | 'effects' | 'soundMode' | 'soundTone' | 'reverb' | 'pitchVariance' | 'stereo'
>;

export const sounds = {
  configure(settings: SoundSettings): void {
    enabled = settings.sound;
    effects = { ...settings.effects };
    volume = Math.max(0, settings.volume) / 100;
    options = {
      mode: settings.soundMode,
      tone: settings.soundTone,
      reverb: settings.reverb,
      pitchVariance: settings.pitchVariance,
      stereo: settings.stereo,
    };
    applyBus();
  },
  setEnabled(value: boolean): void {
    enabled = value;
    if (value && volume > 0) playSound('comet');
  },
  isEnabled(): boolean {
    return enabled;
  },
  volume(): number {
    return volume;
  },
  /** Plays one sound regardless of the interaction map (settings previews). */
  preview(id: SoundId): void {
    if (enabled && volume > 0) playSound(id);
  },
  hover: () => trigger('hover'),
  click: () => trigger('activate'),
  toggle: () => trigger('toggle'),
  select: () => trigger('select'),
  scan: () => trigger('scan'),
  open: () => trigger('open'),
  close: () => trigger('close'),
  type: () => trigger('type'),
  intro: () => trigger('intro'),
  notify: () => trigger('notify'),
};

let lastScan = 0;
export function throttledScan(): void {
  const now = performance.now();
  if (now - lastScan > 90) {
    lastScan = now;
    sounds.scan();
  }
}
