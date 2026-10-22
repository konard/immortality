import { useEffect, useRef, useState } from 'react';
import { frameGeometry, type SvgFrameStyle } from '../frameShapes';

interface FrameShapeProps {
  shape: SvgFrameStyle;
  cut: number;
}

/** Measured SVG outline for chamfered frames (Arwes-style); sits behind the panel content. */
export function FrameShape({ shape, cut }: FrameShapeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSize({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const geometry = size ? frameGeometry(shape, size.width, size.height, cut) : null;

  return (
    <span className="frame-shape" ref={ref} aria-hidden="true">
      {size && geometry && (
        <svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
          <path className="frame-shape-fill" d={geometry.shape} />
          <path className="frame-shape-line" d={geometry.shape} pathLength={1} />
          {geometry.accents.map((d) => (
            <path key={d} className="frame-shape-accent" d={d} />
          ))}
        </svg>
      )}
    </span>
  );
}
