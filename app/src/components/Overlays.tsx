import { useEffect, useRef } from 'react';
import { motionAllowed, useUiSettings } from '../uiContext';

/**
 * Screen-space effects layered above the scene: CRT scanlines and sweep (thegridcn),
 * vignette, flicker and film noise (glitchy.website) and a pointer illuminator
 * (Arwes Illuminator, https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/effects).
 * Purely decorative and never intercepts pointer events.
 */
export function Overlays() {
  const settings = useUiSettings();
  const illuminatorRef = useRef<HTMLSpanElement>(null);
  const motion = motionAllowed(settings);

  useEffect(() => {
    const element = illuminatorRef.current;
    if (!settings.illuminator || !element) return;
    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    const apply = () => {
      frame = 0;
      element.style.setProperty('--pointer-x', `${x}px`);
      element.style.setProperty('--pointer-y', `${y}px`);
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [settings.illuminator]);

  const { scanlines, scanSweep, vignette, flicker, noise, illuminator } = settings;
  if (scanlines === 'off' && !scanSweep && !vignette && !flicker && !noise && !illuminator) return null;

  return (
    <div className="fx-overlays" aria-hidden="true" data-testid="fx-overlays">
      {illuminator && <span ref={illuminatorRef} className="fx-illuminator" />}
      {vignette && <span className="fx-vignette" />}
      {scanlines !== 'off' && <span className={`fx-scanlines fx-scanlines--${scanlines}`} />}
      {scanSweep && motion && <span className="fx-sweep" />}
      {noise && <span className="fx-noise" />}
      {flicker && motion && <span className="fx-flicker" />}
    </div>
  );
}
