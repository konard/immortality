import type { PointerEvent, ReactNode } from 'react';
import { isSvgFrameStyle } from '../frameShapes';
import { sounds } from '../sound';
import { useUiSettings } from '../uiContext';
import { FrameShape } from './FrameShape';
import { FxText } from './FxText';

interface FrameProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Configurable HUD panel. CSS draws corner, line, underline, HUD and plain frames
 * from the shell's `data-frame`; chamfered shapes are drawn as a measured SVG. The panel
 * material (glass, steel, wood, …) lives on its own `.frame-material` layer so its opacity
 * and blur are configurable and it can be clipped to the chamfered outline.
 */
export function Frame({ title, subtitle, className, children }: FrameProps) {
  const { frame, cornerSize, hoverEffect } = useUiSettings();
  // The glow hover follows the pointer; written straight to the element so moving the mouse
  // never re-renders the panel.
  const trackPointer =
    hoverEffect === 'glow'
      ? (event: PointerEvent<HTMLElement>) => {
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
        }
      : undefined;
  return (
    <section
      className={className ? `frame ${className}` : 'frame'}
      onPointerEnter={() => sounds.hover()}
      onPointerMove={trackPointer}
    >
      {isSvgFrameStyle(frame) ? (
        <FrameShape shape={frame} cut={cornerSize} />
      ) : (
        <span className="frame-material" aria-hidden="true" />
      )}
      <span className="corner" aria-hidden="true" />
      {title && (
        <h2 className="frame-title">
          <FxText text={title} />
        </h2>
      )}
      {subtitle && <p className="frame-subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}
