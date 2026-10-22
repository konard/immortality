import { useEffect, useRef, useState } from 'react';
import { sounds } from '../sound';
import { decipherFrame, effectDuration, revealOrder, sequenceFrame } from '../textEffects';
import { motionAllowed, useUiSettings } from '../uiContext';

// Many titles start together; one typing cue per burst is enough.
let lastTypeCue = 0;

interface FxTextProps {
  text: string;
}

/**
 * Text with the configured entrance effect: decipher (Arwes), typewriter sequence
 * (Soul Extract) or an RGB-split glitch (glitchy.website). Screen readers always
 * get the final text.
 */
export function FxText({ text }: FxTextProps) {
  const settings = useUiSettings();
  const effect = settings.textEffect;
  const animate = motionAllowed(settings) && (effect === 'decipher' || effect === 'sequence');
  // Start hidden so the final text does not flash before the first effect frame.
  const [display, setDisplay] = useState(animate ? '' : text);
  // Read through a ref: dragging the speed slider should not replay every title.
  const speed = useRef(settings.animationSpeed);
  speed.current = settings.animationSpeed;

  useEffect(() => {
    if (!animate) {
      setDisplay(text);
      return;
    }
    const duration = effectDuration(text, speed.current);
    const order = revealOrder(text);
    const start = performance.now();
    let frame = 0;
    let lastPaint = 0;
    if (start - lastTypeCue > 250) {
      lastTypeCue = start;
      sounds.type();
    }
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // ~30 fps is enough for glyph cycling and keeps re-renders cheap.
      if (progress >= 1 || now - lastPaint > 33) {
        lastPaint = now;
        setDisplay(
          effect === 'decipher' ? decipherFrame(text, progress, order) : sequenceFrame(text, progress)
        );
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, effect, animate]);

  if (effect === 'glitch') {
    return (
      <span className="fx-glitch" data-text={text}>
        {text}
      </span>
    );
  }
  if (!animate) return <>{text}</>;
  return (
    <span className="fx-text">
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">{display || ' '}</span>
    </span>
  );
}
