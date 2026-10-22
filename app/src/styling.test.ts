import { describe, expect, it } from 'vitest';
import css from './styles.css?raw';
import { isSvgFrameStyle } from './frameShapes';
import { AXIS_BY_KEY, DEFAULT_SETTINGS, SURFACES, type ScalarKey } from './settings';

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
  ['panelShadow', 'data-panel-shadow'],
  ['hoverEffect', 'data-hover'],
  ['cursor', 'data-cursor'],
  ['tableStyle', 'data-table'],
  ['scrollbarStyle', 'data-scrollbar'],
  ['backdropGradient', 'data-backdrop'],
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

describe('materials', () => {
  it('gives every surface a material for both the panels and its settings swatch', () => {
    const missing = SURFACES.flatMap(({ id }) =>
      [`.app-shell[data-surface='${id}']`, `.material-swatch[data-material='${id}']`].filter(
        (selector) => !css.includes(selector),
      ),
    );
    expect(missing).toEqual([]);
  });

  it('keeps entrance animations from leaving clip-path or transforms on finished panels', () => {
    const frame = css.slice(css.indexOf('\n.frame {'), css.indexOf('}', css.indexOf('\n.frame {')));
    expect(frame).toContain('backwards');
    expect(frame).not.toMatch(/\)\s+both;/);
  });

  it('breathes the full-screen flicker smoothly instead of hard white flashes', () => {
    const flicker = css.slice(css.indexOf('.fx-flicker {'));
    const rule = flicker.slice(0, flicker.indexOf('}'));
    expect(rule).not.toContain('steps(');
    expect(rule).not.toContain('rgba(255, 255, 255');
  });

  it('pins the scrolling drawer material and bottom corners to the viewport', () => {
    for (const selector of ['.settings-panel > .frame-material {', '.settings-panel > .corner {']) {
      const block = css.slice(css.indexOf(selector));
      expect(block.slice(0, block.indexOf('}'))).toContain('position: fixed');
    }
  });

  it('no longer styles native selects or expandable sections', () => {
    expect(css).not.toMatch(/(^|\s)select\s*\{/m);
    expect(css).not.toContain('panel-details');
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

  it('stops the typewriter caret blinking', () => {
    expect(css).toContain('.text-caret {');
    expect(css).toMatch(/\.motion-off \.text-caret[^{]*\{/);
  });
});
