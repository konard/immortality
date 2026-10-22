import { describe, expect, it } from 'vitest';
import { FRAME_STYLES } from './settings';
import { SVG_FRAME_STYLES, frameGeometry, isSvgFrameStyle } from './frameShapes';

const coordinates = (d: string) =>
  [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);

describe('frame shapes', () => {
  it('only claims SVG rendering for configured frame styles', () => {
    const ids = FRAME_STYLES.map(({ id }) => id as string);
    for (const style of SVG_FRAME_STYLES) expect(ids).toContain(style);
    expect(isSvgFrameStyle('corners')).toBe(false);
    expect(isSvgFrameStyle('kranox')).toBe(true);
  });

  it.each(SVG_FRAME_STYLES)('keeps %s outlines closed and inside the panel', (style) => {
    for (const [width, height, cut] of [
      [320, 180, 14],
      [40, 30, 32],
      [1000, 240, 6],
    ]) {
      const { shape, accents } = frameGeometry(style, width, height, cut);
      expect(shape.startsWith('M')).toBe(true);
      expect(shape.endsWith('Z')).toBe(true);
      for (const d of [shape, ...accents]) {
        for (const [x, y] of coordinates(d)) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(width);
          expect(y).toBeLessThanOrEqual(height);
        }
      }
    }
  });

  it('chamfers octagon corners by the requested size', () => {
    expect(frameGeometry('octagon', 200, 100, 10).shape).toBe(
      'M10.5,0.5 L189.5,0.5 L199.5,10.5 L199.5,89.5 L189.5,99.5 L10.5,99.5 L0.5,89.5 L0.5,10.5 Z'
    );
  });

  it('clamps the cut on tiny panels', () => {
    const { shape } = frameGeometry('octagon', 40, 20, 30);
    expect(shape.startsWith('M5.5,0.5')).toBe(true);
  });
});
