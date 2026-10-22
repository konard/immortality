import { useEffect, useState } from 'react';
import { sounds } from '../sound';
import { decipherFrame, effectDuration, revealOrder, sequenceFrame } from '../textEffects';
import { motionAllowed, useUiSettings } from '../uiContext';

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

  useEffect(() => {
    if (!animate) {
      setDisplay(text);
      return;
    }
    const duration = effectDuration(text, settings.animationSpeed);
    const order = revealOrder(text);
    const start = performance.now();
    let frame = 0;
    let lastPaint = 0;
    sounds.type();
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
  }, [text, effect, animate, settings.animationSpeed]);

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
