import type { LevAssessment } from '../analytics';
import { useUiSettings } from '../uiContext';
import { Frame } from './Frame';

interface GaugeProps {
  entity: string;
  lev: LevAssessment | null;
}

const SEGMENTS = 20;
const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Hero figure + meter: how much of longevity escape velocity is reached. */
export function Gauge({ entity, lev }: GaugeProps) {
  const { meter } = useUiSettings();
  if (!lev) {
    return (
      <Frame title="Escape velocity progress" subtitle={entity}>
        <p className="chart-note">Not enough data to assess.</p>
      </Frame>
    );
  }
  const percent = lev.progress * 100;
  const width = Math.max(0, Math.min(100, percent));
  const lit = Math.round((width / 100) * SEGMENTS);
  const heroNumber = (
    <div className="hero-number" aria-live="polite">
      {percent.toFixed(1)}
      <span className="unit">% of LEV</span>
    </div>
  );
  return (
    <Frame
      title="Escape velocity progress"
      subtitle={`${entity} — share of the +1 year / year threshold, as of ${lev.asOfYear}`}
    >
      {meter === 'ring' ? (
        <div className="gauge-ring-row">
          <svg
            className="meter-ring"
            viewBox="0 0 80 80"
            width={88}
            height={88}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Number(width.toFixed(1))}
            aria-label={`Progress toward longevity escape velocity: ${percent.toFixed(1)} percent`}
          >
            <circle className="meter-ring-track" cx={40} cy={40} r={RING_RADIUS} />
            <circle
              className="meter-ring-fill"
              cx={40}
              cy={40}
              r={RING_RADIUS}
              strokeDasharray={`${(width / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
              transform="rotate(-90 40 40)"
            />
            {Array.from({ length: 12 }, (_, i) => (
              <line
                key={i}
                className="meter-ring-tick"
                x1={40}
                y1={1}
                x2={40}
                y2={4}
                transform={`rotate(${i * 30} 40 40)`}
              />
            ))}
          </svg>
          <div>
            {heroNumber}
            <div className="meter-scale">
              <span>escape velocity = +1 yr / yr</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {heroNumber}
          <div
            className="meter"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Number(width.toFixed(1))}
            aria-label={`Progress toward longevity escape velocity: ${percent.toFixed(1)} percent`}
          >
            {meter === 'segmented' ? (
              <div className="meter-segments">
                {Array.from({ length: SEGMENTS }, (_, i) => (
                  <span
                    key={i}
                    className={i < lit ? 'meter-segment is-lit' : 'meter-segment'}
                    style={{ animationDelay: `${i * 30}ms` }}
                  />
                ))}
              </div>
            ) : (
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${width}%` }} />
              </div>
            )}
            <div className="meter-scale">
              <span>0</span>
              <span>escape velocity = +1 yr / yr</span>
            </div>
          </div>
        </>
      )}
    </Frame>
  );
}
