import { describe, expect, it } from 'vitest';
import {
  DECIPHER_CHARACTERS,
  decipherFrame,
  effectDuration,
  revealOrder,
  sequenceFrame,
} from './textEffects';

function seeded(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

describe('text effects', () => {
  it('reveals every non-space character exactly once', () => {
    const order = revealOrder('Life expectancy', seeded(3));
    expect(order).toHaveLength('Lifeexpectancy'.length);
    expect(new Set(order).size).toBe(order.length);
    expect(order).not.toContain(4);
  });

  it('deciphers from random glyphs to the final text while keeping spaces', () => {
    const text = 'Mission assessment';
    const order = revealOrder(text, seeded(5));
    const start = decipherFrame(text, 0, order, seeded(9));
    expect(start).toHaveLength(text.length);
    expect(start[7]).toBe(' ');
    for (const [i, ch] of [...start].entries()) {
      if (i !== 7) expect(DECIPHER_CHARACTERS).toContain(ch);
    }
    const half = decipherFrame(text, 0.5, order, seeded(9));
    for (const index of order.slice(0, Math.floor(order.length / 2))) {
      expect(half[index]).toBe(text[index]);
    }
    expect(decipherFrame(text, 1, order)).toBe(text);
  });

  it('types text in sequence', () => {
    expect(sequenceFrame('VELOCITY', 0)).toBe('');
    expect(sequenceFrame('VELOCITY', 0.5)).toBe('VELO');
    expect(sequenceFrame('VELOCITY', 1)).toBe('VELOCITY');
  });

  it('scales duration with length and animation speed', () => {
    expect(effectDuration('a')).toBe(450);
    expect(effectDuration('x'.repeat(100))).toBe(1400);
    expect(effectDuration('x'.repeat(20), 200)).toBe(450);
  });
});
