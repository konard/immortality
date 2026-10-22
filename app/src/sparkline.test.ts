import { describe, expect, it } from 'vitest';
import { countUpText, isCountable, sparkline } from './sparkline';

describe('sparkline', () => {
  it('maps the lowest sample to the bottom and the highest to the top', () => {
    const spark = sparkline([1, 3, 2], 100, 20);
    expect(spark?.line).toBe('M0,18 L50,2 L100,10');
    expect(spark?.area.endsWith('L100,20 L0,20 Z')).toBe(true);
  });

  it('draws flat series mid-height and skips series that are too short', () => {
    expect(sparkline([5, 5, 5], 10, 20)?.line).toBe('M0,10 L5,10 L10,10');
    expect(sparkline([5], 10, 20)).toBeNull();
    expect(sparkline([Number.NaN, 4], 10, 20)).toBeNull();
  });
});

describe('count-up', () => {
  it('keeps decimals and the explicit plus sign while counting', () => {
    expect(countUpText('73.25', 0)).toBe('0.00');
    expect(countUpText('73.25', 1)).toBe('73.25');
    expect(countUpText('+0.0123', 1)).toBe('+0.0123');
    expect(countUpText('-0.5', 1)).toBe('-0.5');
  });

  it('eases out, so the number is past halfway at half time', () => {
    expect(Number(countUpText('100', 0.5))).toBeGreaterThan(80);
    expect(countUpText('100', 0.5, 100)).toBe('100');
  });

  it('leaves words and dashes alone', () => {
    expect(countUpText('Reached', 0.3)).toBe('Reached');
    expect(isCountable('—')).toBe(false);
    expect(isCountable('2045')).toBe(true);
  });
});
