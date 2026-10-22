import type { ReactNode } from 'react';
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
 * from the shell's `data-frame`; chamfered shapes are drawn as a measured SVG.
 */
export function Frame({ title, subtitle, className, children }: FrameProps) {
  const { frame, cornerSize } = useUiSettings();
  return (
    <section
      className={className ? `frame ${className}` : 'frame'}
      onPointerEnter={() => sounds.hover()}
    >
      {isSvgFrameStyle(frame) && <FrameShape shape={frame} cut={cornerSize} />}
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
