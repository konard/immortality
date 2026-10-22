// SVG outlines for chamfered panel frames, after Arwes FrameOctagon / FrameKranox /
// FrameNefrex (https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/frames).
// Pure geometry so the outlines are testable without a DOM.

export type SvgFrameStyle = 'octagon' | 'kranox' | 'nefrex';

export const SVG_FRAME_STYLES: readonly SvgFrameStyle[] = ['octagon', 'kranox', 'nefrex'];

export interface FrameGeometry {
  /** Closed outline used for the panel fill and its border stroke. */
  shape: string;
  /** Thicker decorative strokes drawn on top of the outline. */
  accents: string[];
}

const fmt = (n: number) => Number(n.toFixed(2));
const path = (points: Array<[number, number]>, close = true) =>
  points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${fmt(x)},${fmt(y)}`).join(' ') +
  (close ? ' Z' : '');

export function isSvgFrameStyle(style: string): style is SvgFrameStyle {
  return (SVG_FRAME_STYLES as readonly string[]).includes(style);
}

/**
 * Builds the outline for a `width` × `height` box. `cut` is the chamfer size; it is
 * clamped so the outline never self-intersects on small panels. Strokes are inset by
 * half a pixel to stay crisp.
 */
export function frameGeometry(
  style: SvgFrameStyle,
  width: number,
  height: number,
  cut: number
): FrameGeometry {
  const s = 0.5;
  const w = Math.max(width, 2) - s;
  const h = Math.max(height, 2) - s;
  const maxCut = Math.max(0, Math.min(width, height) / 4);
  const c = Math.min(Math.max(cut, 0), maxCut);

  if (style === 'octagon') {
    return {
      shape: path([
        [s + c, s],
        [w - c, s],
        [w, s + c],
        [w, h - c],
        [w - c, h],
        [s + c, h],
        [s, h - c],
        [s, s + c],
      ]),
      accents: [],
    };
  }

  if (style === 'kranox') {
    const big = Math.min(c * 2, Math.min(width, height) / 2);
    const accent = Math.min(height * 0.3, 60, h - big - 6 - s);
    const shape = path([
      [s + big, s],
      [w, s],
      [w, h - big],
      [w - big, h],
      [s, h],
      [s, s + big],
    ]);
    if (accent <= 0) return { shape, accents: [] };
    return {
      shape,
      accents: [
        path(
          [
            [s, s + big + 6],
            [s, s + big + 6 + accent],
          ],
          false
        ),
        path(
          [
            [w, h - big - 6 - accent],
            [w, h - big - 6],
          ],
          false
        ),
      ],
    };
  }

  const span = Math.min(width * 0.32, 220);
  return {
    shape: path([
      [s + c, s],
      [w, s],
      [w, h - c],
      [w - c, h],
      [s, h],
      [s, s + c],
    ]),
    accents: [
      path(
        [
          [s, s + c],
          [s + c, s],
          [s + c + span, s],
        ],
        false
      ),
      path(
        [
          [w - c - span, h],
          [w - c, h],
          [w, h - c],
        ],
        false
      ),
    ],
  };
}
