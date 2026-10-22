import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Point } from '../analytics';
import { throttledScan } from '../sound';
import { Frame } from './Frame';
import { useElementWidth } from '../useElementWidth';
import { motionAllowed, useUiSettings } from '../uiContext';

interface Threshold {
  value: number;
  label: string;
}

interface LineChartProps {
  title: string;
  subtitle: string;
  points: Point[];
  unit: string;
  /** Decimal places for tooltip / direct label values. */
  precision?: number;
  threshold?: Threshold;
  zeroLine?: boolean;
  /** Clamp the visible y-domain; data beyond it is clipped and noted. */
  yClamp?: [number, number];
}

const HEIGHT = 240;
const MARGIN = { top: 16, right: 58, bottom: 28, left: 46 };

const GRID_DASH: Record<string, string | undefined> = {
  solid: undefined,
  dashed: '4 4',
  dots: '1 5',
};

/** ~4–6 clean-numbered ticks spanning [min, max]. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!(max > min)) return [min];
  const rawStep = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const step = (residual >= 5 ? 10 : residual >= 2 ? 5 : residual >= 1 ? 2 : 1) * magnitude;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step / 1e6; v += step) {
    ticks.push(Number(v.toFixed(10)));
  }
  return ticks;
}

export function LineChart({
  title,
  subtitle,
  points,
  unit,
  precision = 1,
  threshold,
  zeroLine,
  yClamp,
}: LineChartProps) {
  const settings = useUiSettings();
  const { chartStyle, chartGrid } = settings;
  const drawIn = motionAllowed(settings) && settings.entrance === 'scan';
  const wrapRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(wrapRef, 640);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const clipId = useMemo(() => `clip-${title.replace(/\W+/g, '-').toLowerCase()}`, [title]);

  const geometry = useMemo(() => {
    if (points.length < 2) return null;
    const xMin = points[0].year;
    const xMax = points[points.length - 1].year;
    const values = points.map((p) => p.value);
    let yMin = Math.min(...values, threshold ? threshold.value : Infinity, zeroLine ? 0 : Infinity);
    let yMax = Math.max(...values, threshold ? threshold.value : -Infinity);
    let clipped = false;
    if (yClamp) {
      if (yMin < yClamp[0]) {
        yMin = yClamp[0];
        clipped = true;
      }
      if (yMax > yClamp[1]) {
        yMax = yClamp[1];
        clipped = true;
      }
    }
    const pad = (yMax - yMin) * 0.08 || 1;
    yMin -= pad;
    yMax += pad;
    const plotW = width - MARGIN.left - MARGIN.right;
    const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
    const x = (year: number) => MARGIN.left + ((year - xMin) / (xMax - xMin)) * plotW;
    const y = (value: number) => MARGIN.top + (1 - (value - yMin) / (yMax - yMin)) * plotH;
    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.year).toFixed(2)},${y(p.value).toFixed(2)}`)
      .join('');
    const stepPath = points
      .map((p, i) =>
        i === 0
          ? `M${x(p.year).toFixed(2)},${y(p.value).toFixed(2)}`
          : `L${x(p.year).toFixed(2)},${y(points[i - 1].value).toFixed(2)}L${x(p.year).toFixed(2)},${y(p.value).toFixed(2)}`
      )
      .join('');
    const bottom = (MARGIN.top + plotH).toFixed(2);
    const areaPath = `${path}L${x(xMax).toFixed(2)},${bottom}L${x(xMin).toFixed(2)},${bottom}Z`;
    return { xMin, xMax, yMin, yMax, x, y, path, stepPath, areaPath, clipped, plotW, plotH };
  }, [points, width, threshold, zeroLine, yClamp]);

  if (!geometry || points.length < 2) {
    return (
      <Frame title={title} subtitle={subtitle} className="chart-card">
        <p className="chart-note">Not enough data points in the selected range.</p>
      </Frame>
    );
  }

  const { xMin, xMax, x, y, clipped } = geometry;
  const path = chartStyle === 'step' ? geometry.stepPath : geometry.path;
  const fillId = `${clipId}-fill`;
  const yTicks = niceTicks(geometry.yMin, geometry.yMax);
  const xTicks = niceTicks(xMin, xMax, 6).filter((t) => Number.isInteger(t));
  const last = points[points.length - 1];
  const hover = hoverIndex === null ? null : points[hoverIndex];

  const nearestIndex = (year: number) => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(points[i].year - year);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const year = xMin + ((px - MARGIN.left) / geometry.plotW) * (xMax - xMin);
    const index = nearestIndex(year);
    if (index !== hoverIndex) {
      setHoverIndex(index);
      throttledScan();
    }
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.key === 'ArrowLeft' ? -1 : 1;
    setHoverIndex((current) => {
      const base = current ?? points.length - 1;
      return Math.max(0, Math.min(points.length - 1, base + delta));
    });
    throttledScan();
  };

  return (
    <Frame title={title} subtitle={subtitle} className="chart-card">
      <div className="chart-wrap" ref={wrapRef}>
        <svg
          className="chart-svg"
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          role="img"
          aria-label={`${title}: line chart, ${points[0].year} to ${last.year}. Latest value ${last.value.toFixed(precision)} ${unit}. Values are listed in the data table below.`}
          tabIndex={0}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHoverIndex(null)}
          onKeyDown={onKeyDown}
          onFocus={() => setHoverIndex(points.length - 1)}
          onBlur={() => setHoverIndex(null)}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                x={MARGIN.left}
                y={MARGIN.top}
                width={geometry.plotW}
                height={geometry.plotH}
              />
            </clipPath>
            <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Gridlines: recessive hairlines (solid, dashed, dotted or hidden) */}
          {yTicks.map((tick) => (
            <g key={`y${tick}`}>
              {chartGrid !== 'none' && (
                <line
                  x1={MARGIN.left}
                  x2={width - MARGIN.right}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke={chartGrid === 'dots' ? 'var(--baseline)' : 'var(--gridline)'}
                  strokeWidth={chartGrid === 'dots' ? 1.5 : 1}
                  strokeDasharray={GRID_DASH[chartGrid]}
                  strokeLinecap={chartGrid === 'dots' ? 'round' : undefined}
                />
              )}
              <text
                x={MARGIN.left - 8}
                y={y(tick) + 3.5}
                textAnchor="end"
                fontSize={11}
                fill="var(--text-muted)"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {tick}
              </text>
            </g>
          ))}
          {xTicks.map((tick) => (
            <text
              key={`x${tick}`}
              x={x(tick)}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize={11}
              fill="var(--text-muted)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {tick}
            </text>
          ))}

          {/* Zero baseline */}
          {zeroLine && geometry.yMin < 0 && geometry.yMax > 0 && (
            <line
              x1={MARGIN.left}
              x2={width - MARGIN.right}
              y1={y(0)}
              y2={y(0)}
              stroke="var(--baseline)"
              strokeWidth={1}
            />
          )}

          {/* Threshold rule (dashed = target, not grid) */}
          {threshold && threshold.value <= geometry.yMax && threshold.value >= geometry.yMin && (
            <g>
              <line
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={y(threshold.value)}
                y2={y(threshold.value)}
                stroke="var(--threshold)"
                strokeWidth={1.5}
                strokeDasharray="6 4"
              />
              <text
                x={width - MARGIN.right}
                y={y(threshold.value) - 6}
                textAnchor="end"
                fontSize={10.5}
                letterSpacing="0.14em"
                fill="var(--text-secondary)"
              >
                {threshold.label.toUpperCase()}
              </text>
            </g>
          )}

          {/* Data line, with optional area fill or neon bloom */}
          {chartStyle === 'area' && (
            <path
              d={geometry.areaPath}
              fill={`url(#${fillId})`}
              clipPath={`url(#${clipId})`}
              className={drawIn ? 'chart-area-draw' : undefined}
            />
          )}
          {chartStyle === 'glow' && (
            <path
              d={path}
              fill="none"
              stroke="var(--series-1)"
              strokeWidth={7}
              strokeOpacity={0.28}
              strokeLinejoin="round"
              strokeLinecap="round"
              clipPath={`url(#${clipId})`}
              className="chart-line-bloom"
            />
          )}
          <path
            key={drawIn ? `${path.length}-${chartStyle}` : 'static'}
            d={path}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth={2}
            strokeLinejoin={chartStyle === 'step' ? 'miter' : 'round'}
            strokeLinecap="round"
            clipPath={`url(#${clipId})`}
            pathLength={drawIn ? 1 : undefined}
            className={drawIn ? 'chart-line-draw' : undefined}
          />

          {/* Endpoint marker (surface ring) + selective direct label */}
          <circle cx={x(last.year)} cy={y(last.value)} r={6} fill="var(--surface-1)" />
          <circle cx={x(last.year)} cy={y(last.value)} r={4} fill="var(--series-1)" />
          <text
            x={x(last.year) + 9}
            y={y(last.value) + 4}
            fontSize={12}
            fontWeight={650}
            fill="var(--text-primary)"
          >
            {last.value.toFixed(precision)}
          </text>

          {/* Crosshair */}
          {hover && (
            <g>
              <line
                x1={x(hover.year)}
                x2={x(hover.year)}
                y1={MARGIN.top}
                y2={HEIGHT - MARGIN.bottom}
                stroke="var(--baseline)"
                strokeWidth={1}
              />
              <circle cx={x(hover.year)} cy={y(hover.value)} r={6} fill="var(--surface-1)" />
              <circle cx={x(hover.year)} cy={y(hover.value)} r={4} fill="var(--series-1)" />
            </g>
          )}
        </svg>

        {hover && (
          <div
            className="chart-tooltip"
            role="status"
            style={{
              left: Math.min(x(hover.year) + 12, width - 150),
              top: Math.max(4, y(Math.max(Math.min(hover.value, geometry.yMax), geometry.yMin)) - 48),
            }}
          >
            <div>{hover.year}</div>
            <div>
              <span className="key" aria-hidden="true" />
              <span className="tooltip-value">{hover.value.toFixed(Math.max(precision, 2))}</span>{' '}
              {unit}
            </div>
          </div>
        )}
      </div>
      {clipped && (
        <p className="chart-note">
          Axis clamped to keep the recent record readable — wartime and pandemic shocks exceed the
          visible scale; exact values are in the data table.
        </p>
      )}
    </Frame>
  );
}
