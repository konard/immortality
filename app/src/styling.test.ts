import { describe, expect, it } from 'vitest';
import css from './styles.css?raw';
import { isSvgFrameStyle } from './frameShapes';
import { AXIS_BY_KEY, DEFAULT_SETTINGS, type ScalarKey } from './settings';

// Axes rendered purely by CSS through a data attribute on `.app-shell` (see App.tsx).
// The default option is the unstyled base look, so it needs no dedicated rule.
const CSS_AXES: Array<[ScalarKey, string]> = [
  ['palette', 'data-palette'],
  ['glow', 'data-glow'],
  ['frame', 'data-frame'],
  ['surface', 'data-surface'],
  ['density', 'data-density'],
  ['font', 'data-font'],
  ['headingCase', 'data-heading-case'],
  ['entrance', 'data-entrance'],
];

describe('stylesheet coverage', () => {
  it.each(CSS_AXES)('styles every non-default %s option', (key, attribute) => {
    const axis = AXIS_BY_KEY[key];
    expect(axis.kind).toBe('choice');
    if (axis.kind !== 'choice') return;
    const unstyled = axis.options
      .map((option) => option.id)
      .filter((id) => id !== DEFAULT_SETTINGS[key])
      .filter((id) => !(key === 'frame' && isSvgFrameStyle(id)))
      .filter((id) => !css.includes(`[${attribute}='${id}']`));
    expect(unstyled).toEqual([]);
  });
});

describe('motion off', () => {
  it('cancels animation delays so staggered panels are not left invisible', () => {
    const motionOff = css.slice(css.indexOf('.motion-off *,'));
    const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    for (const block of [motionOff, reduced]) {
      const rule = block.slice(0, block.indexOf('}'));
      expect(rule).toContain('animation-delay: 0s !important');
    }
  });
});
