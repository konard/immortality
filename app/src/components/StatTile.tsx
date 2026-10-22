import { useEffect, useRef, useState, type ReactNode } from 'react';
import { countUpText, isCountable, sparkline } from '../sparkline';
import { motionAllowed, useUiSettings } from '../uiContext';
import { Frame } from './Frame';

interface StatTileProps {
  label: string;
  value: string;
  unit?: string;
  hint?: ReactNode;
  /** Recent history drawn as a sparkline under the value (thegridcn stat cards). */
  spark?: number[];
  /** Roll the number up when it changes; off for values such as years. */
  count?: boolean;
}

const SPARK_WIDTH = 120;
const SPARK_HEIGHT = 28;
const COUNT_MS = 900;

/** Counts from the previously shown number to `value` with requestAnimationFrame. */
function useCountUp(value: string, enabled: boolean): string {
  const [shown, setShown] = useState(enabled && isCountable(value) ? countUpText(value, 0) : value);
  // The number on screen, so an interrupted count resumes from where it visibly is.
  const from = useRef(0);

  useEffect(() => {
    if (!enabled || !isCountable(value)) {
      from.current = isCountable(value) ? Number(value) : 0;
      setShown(value);
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let frame = requestAnimationFrame(function tick(now) {
      const progress = (now - start) / COUNT_MS;
      const text = countUpText(value, progress, origin);
      from.current = Number(text);
      setShown(text);
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [value, enabled]);

  return shown;
}

export function StatTile({ label, value, unit, hint, spark, count = true }: StatTileProps) {
  const settings = useUiSettings();
  const shown = useCountUp(value, count && settings.countUp && motionAllowed(settings));
  const geometry = settings.sparklines && spark ? sparkline(spark, SPARK_WIDTH, SPARK_HEIGHT) : null;
  return (
    <Frame className="stat-tile">
      <div className="label">{label}</div>
      <div className="value">
        {shown}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {hint && <div className="hint">{hint}</div>}
      {geometry && (
        <svg
          className="stat-spark"
          viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="stat-spark-area" d={geometry.area} />
          <path className="stat-spark-line" d={geometry.line} />
        </svg>
      )}
    </Frame>
  );
}
