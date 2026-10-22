// Pure helpers for the stat tiles: sparkline geometry and the count-up number roll.

export interface Sparkline {
  /** Open polyline through the samples. */
  line: string;
  /** The same polyline closed down to the baseline, for the soft area fill. */
  area: string;
}

const fmt = (n: number) => Number(n.toFixed(2));

/**
 * Scales `values` into a `width` × `height` box (y grows downwards). Non-finite samples are
 * dropped; fewer than two samples give no sparkline. A flat series is drawn mid-height.
 */
export function sparkline(values: number[], width: number, height: number): Sparkline | null {
  const samples = values.filter(Number.isFinite);
  if (samples.length < 2) return null;
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const range = max - min;
  const pad = 2;
  const points = samples.map((value, i): [number, number] => [
    fmt((i / (samples.length - 1)) * width),
    fmt(range === 0 ? height / 2 : pad + (1 - (value - min) / range) * (height - pad * 2)),
  ]);
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  return {
    line,
    area: `${line} L${width},${height} L0,${height} Z`,
  };
}

const NUMBER = /^([+-]?)(\d+)(?:\.(\d+))?$/;

/**
 * Renders `target` (a plain decimal such as "73.2" or "+0.0123") part-way through a count-up
 * from `from`, keeping its sign style and decimal places. `progress` runs 0 → 1 and is eased
 * (ease-out cubic). Text that is not a plain number is returned unchanged.
 */
export function countUpText(target: string, progress: number, from = 0): string {
  const match = NUMBER.exec(target);
  if (!match) return target;
  const decimals = match[3]?.length ?? 0;
  const goal = Number(target);
  const t = Math.min(1, Math.max(0, progress));
  const eased = 1 - (1 - t) ** 3;
  const value = from + (goal - from) * eased;
  const text = (t >= 1 ? goal : value).toFixed(decimals);
  return match[1] === '+' && !text.startsWith('-') ? `+${text}` : text;
}

/** True when `text` is a number the tile can count up to. */
export const isCountable = (text: string) => NUMBER.test(text);
