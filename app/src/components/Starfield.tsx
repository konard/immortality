import { useEffect, useRef } from 'react';
import type { BackgroundId, PaletteId } from '../settings';

interface StarfieldProps {
  mode?: BackgroundId;
  animated?: boolean;
  /** Re-tints the canvas when the palette (and so `--neon`) changes. */
  palette?: PaletteId;
}

type Rgb = [number, number, number];

const FALLBACK_NEON: Rgb = [126, 252, 246];
const FALLBACK_ACCENT: Rgb = [201, 133, 0];

/** Parses `#rgb`, `#rrggbb` or `rgb()/rgba()` custom-property values. */
export function parseColor(value: string, fallback: Rgb): Rgb {
  const text = value.trim();
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(text);
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((d) => d + d).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)) as Rgb;
  }
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(text);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return fallback;
}

const RAIN_GLYPHS = '01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>/[]{}=+*';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
}

const seededRandom = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

/** Configurable deep-space canvas with two CSS grid overlays. */
export function Starfield({ mode = 'stars', animated = true, palette }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const styles = getComputedStyle(canvas);
    const neon = parseColor(styles.getPropertyValue('--neon'), FALLBACK_NEON);
    const accent = parseColor(styles.getPropertyValue('--threshold'), FALLBACK_ACCENT);
    const tint = (alpha: number, color: Rgb = neon) =>
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.max(0, Math.min(1, alpha))})`;
    const shouldAnimate = animated && !reducedMotion;
    let stars: Star[] = [];
    let frame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let traces: Array<{ points: Array<[number, number]>; length: number; period: number; offset: number }> = [];
    let rain: Array<{ x: number; y: number; speed: number; glyphs: string[] }> = [];
    let bokeh: Array<{ x: number; y: number; radius: number; speed: number; phase: number }> = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const random = seededRandom(73);
      const count = Math.min(300, Math.floor((width * height) / 5500));
      stars = Array.from({ length: count }, () => ({
        x: random() * width,
        y: random() * height,
        radius: random() * 1.1 + 0.2,
        speed: random() * 0.03 + 0.005,
        phase: random() * Math.PI * 2,
      }));
      if (mode === 'circuit') traces = buildTraces(random);
      if (mode === 'data-rain') {
        const glyph = () => RAIN_GLYPHS[Math.floor(random() * RAIN_GLYPHS.length)];
        rain = Array.from({ length: Math.ceil(width / 20) }, (_, i) => ({
          x: i * 20 + 4,
          y: random() * height * 1.4 - height * 0.4,
          speed: 0.6 + random() * 1.6,
          glyphs: Array.from({ length: 14 }, glyph),
        })).filter(() => random() < 0.65);
      }
      if (mode === 'nebula') {
        bokeh = Array.from({ length: 42 }, () => ({
          x: random() * width,
          y: random() * height,
          radius: 2 + random() * 9,
          speed: 0.05 + random() * 0.2,
          phase: random() * Math.PI * 2,
        }));
      }
    };

    // Manhattan/45° PCB traces on a 40px lattice, each carrying a travelling light pulse.
    const buildTraces = (random: () => number) => {
      const cell = 40;
      const directions: Array<[number, number]> = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
        [-1, 0],
        [0, -1],
      ];
      const count = Math.min(70, Math.floor((width * height) / 22000));
      return Array.from({ length: count }, () => {
        let x = Math.round((random() * width) / cell) * cell;
        let y = Math.round((random() * height) / cell) * cell;
        const points: Array<[number, number]> = [[x, y]];
        let dir = directions[Math.floor(random() * 4)];
        let length = 0;
        const turns = 2 + Math.floor(random() * 4);
        for (let t = 0; t < turns; t++) {
          const steps = 1 + Math.floor(random() * 4);
          x += dir[0] * steps * cell;
          y += dir[1] * steps * cell;
          length += Math.hypot(dir[0], dir[1]) * steps * cell;
          points.push([x, y]);
          dir = directions[Math.floor(random() * directions.length)];
        }
        return { points, length, period: 2200 + random() * 4200, offset: random() * 6000 };
      });
    };

    const pointAlong = (points: Array<[number, number]>, distance: number): [number, number] => {
      let remaining = distance;
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        const segment = Math.hypot(bx - ax, by - ay);
        if (remaining <= segment) {
          const k = segment === 0 ? 0 : remaining / segment;
          return [ax + (bx - ax) * k, ay + (by - ay) * k];
        }
        remaining -= segment;
      }
      return points[points.length - 1];
    };

    const drawStars = (time: number, opacity = 0.35) => {
      for (const star of stars) {
        const twinkle = shouldAnimate ? 0.55 + 0.45 * Math.sin(star.phase + time / 900) : 0.7;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(180, 235, 240, ${opacity * twinkle})`;
        context.fill();
        if (shouldAnimate) {
          star.y -= star.speed;
          if (star.y < -2) star.y = height + 2;
        }
      }
    };

    const drawGalaxy = (time: number) => {
      drawStars(time, 0.22);
      const rotation = shouldAnimate ? time / 28000 : 0;
      const radius = Math.min(width, height) * 0.34;
      const random = seededRandom(19);
      context.save();
      context.translate(width * 0.72, height * 0.3);
      context.rotate(-0.25);
      context.scale(1, 0.34);
      for (let i = 0; i < 360; i++) {
        const arm = i % 3;
        const distance = radius * Math.sqrt(random());
        const angle =
          arm * ((Math.PI * 2) / 3) +
          (distance / radius) * 5 +
          rotation +
          random() * 0.35;
        const alpha = (1 - distance / radius) * 0.25 + 0.03;
        context.beginPath();
        context.arc(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance,
          random() * 1.4 + 0.3,
          0,
          Math.PI * 2,
        );
        context.fillStyle = tint(alpha);
        context.fill();
      }
      context.restore();
    };

    const drawPlanet = (time: number) => {
      drawStars(time, 0.3);
      const radius = Math.max(190, Math.min(width, height) * 0.36);
      const x = width * 0.86;
      const y = height + radius * 0.24;
      const glow = context.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.55,
        1,
        x,
        y,
        radius,
      );
      glow.addColorStop(0, tint(0.28));
      glow.addColorStop(0.42, 'rgba(20,70,76,0.75)');
      glow.addColorStop(1, 'rgba(3,8,13,0.98)');
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = tint(0.24);
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(
        x,
        y - radius * 0.12,
        radius * 1.45,
        radius * 0.3,
        -0.08,
        Math.PI,
        Math.PI * 2,
      );
      context.stroke();
    };

    const drawSun = (time: number) => {
      drawStars(time, 0.24);
      const x = width * 0.12;
      const y = height * 0.78;
      const radius = Math.max(width, height) * 0.3;
      const glow = context.createRadialGradient(x, y, 2, x, y, radius);
      glow.addColorStop(0, 'rgba(255,247,198,0.95)');
      glow.addColorStop(0.08, 'rgba(255,188,75,0.5)');
      glow.addColorStop(0.42, 'rgba(201,133,0,0.1)');
      glow.addColorStop(1, 'rgba(201,133,0,0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.strokeStyle = 'rgba(201,133,0,0.16)';
      context.beginPath();
      context.ellipse(x, y, radius * 1.4, radius * 0.35, -0.35, 0, Math.PI * 2);
      context.stroke();
    };

    const drawAsteroids = (time: number) => {
      drawStars(time, 0.28);
      const random = seededRandom(41);
      const drift = shouldAnimate ? (time / 90) % (width + 240) : 0;
      for (let i = 0; i < 18; i++) {
        const radius = 5 + random() * 28;
        const baseX = random() * (width + 240) - 120;
        const x =
          ((baseX + drift * (0.15 + random() * 0.25) + width + 240) % (width + 240)) -
          120;
        const y = random() * height;
        context.beginPath();
        for (let point = 0; point < 8; point++) {
          const angle = (point / 8) * Math.PI * 2;
          const edge = radius * (0.7 + random() * 0.3);
          const px = x + Math.cos(angle) * edge;
          const py = y + Math.sin(angle) * edge;
          if (point === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
        context.fillStyle = 'rgba(70,86,94,0.3)';
        context.strokeStyle = 'rgba(159,180,188,0.22)';
        context.fill();
        context.stroke();
      }
    };

    // Arwes "Dots": a dot lattice lit by an expanding radial wave.
    const drawDots = (time: number) => {
      const spacing = 28;
      const cx = width / 2;
      const cy = height / 2;
      const maxDistance = Math.hypot(cx, cy);
      const wave = shouldAnimate ? ((time / 4200) % 1) * (maxDistance + 200) : -1000;
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const distance = Math.hypot(x - cx, y - cy);
          const lit = Math.max(0, 1 - Math.abs(distance - wave) / 90);
          context.fillStyle = tint(0.1 + lit * 0.55);
          context.fillRect(x - 1, y - 1, 2 + lit, 2 + lit);
        }
      }
    };

    // Arwes "MovingLines": sets of vertical light streaks sliding over a faint lattice.
    const drawMovingLines = (time: number) => {
      const spacing = 30;
      context.strokeStyle = tint(0.035);
      context.lineWidth = 1;
      for (let x = spacing / 2; x < width; x += spacing) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      const random = seededRandom(97);
      const columns = Math.ceil(width / spacing);
      for (let set = 0; set < 4; set++) {
        const period = 5200 + set * 1300;
        const progress = shouldAnimate ? ((time + set * 1700) % period) / period : 0.3 + set * 0.17;
        for (let column = 0; column < columns; column++) {
          if (random() > 0.22) continue;
          const length = 40 + random() * 220;
          const x = column * spacing + spacing / 2;
          const y = (progress + random()) % 1 * (height + length * 2) - length;
          const gradient = context.createLinearGradient(x, y, x, y + length);
          gradient.addColorStop(0, tint(0));
          gradient.addColorStop(1, tint(0.55));
          context.strokeStyle = gradient;
          context.lineWidth = 1.5;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x, y + length);
          context.stroke();
        }
      }
    };

    // Arwes "Puffs": soft energy bursts that bloom and fade at random spots.
    const drawPuffs = (time: number) => {
      drawStars(time, 0.2);
      const cycle = 2600;
      for (let i = 0; i < 12; i++) {
        const t = shouldAnimate ? ((time + i * 413) % cycle) / cycle : 0.35;
        const round = shouldAnimate ? Math.floor((time + i * 413) / cycle) : 0;
        const random = seededRandom(1000 + i * 7919 + round * 104729);
        const x = random() * width;
        const y = random() * height;
        const radius = 18 + t * (50 + random() * 70);
        const alpha = Math.sin(t * Math.PI) * 0.28;
        const glow = context.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, tint(alpha));
        glow.addColorStop(1, tint(0));
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        for (let p = 0; p < 6; p++) {
          const angle = random() * Math.PI * 2;
          const distance = radius * (0.4 + random() * 0.8);
          context.fillStyle = tint(alpha * 1.6);
          context.fillRect(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 1.5, 1.5);
        }
      }
    };

    // Soul Extract-style circuit board with light pulses travelling along traces.
    const drawCircuit = (time: number) => {
      context.lineWidth = 1;
      for (const trace of traces) {
        context.strokeStyle = tint(0.11);
        context.beginPath();
        trace.points.forEach(([x, y], i) => (i === 0 ? context.moveTo(x, y) : context.lineTo(x, y)));
        context.stroke();
        for (const [x, y] of [trace.points[0], trace.points[trace.points.length - 1]]) {
          context.strokeStyle = tint(0.22);
          context.beginPath();
          context.arc(x, y, 3, 0, Math.PI * 2);
          context.stroke();
        }
        if (!shouldAnimate) continue;
        const progress = ((time + trace.offset) % trace.period) / trace.period;
        for (let k = 0; k < 6; k++) {
          const distance = (progress - k * 0.012) * trace.length;
          if (distance < 0) continue;
          const [x, y] = pointAlong(trace.points, distance);
          context.fillStyle = tint(k === 0 ? 0.95 : 0.5 - k * 0.08);
          context.beginPath();
          context.arc(x, y, k === 0 ? 2.2 : 1.6, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    // ZKN-style falling data columns.
    const drawRain = () => {
      context.font = '14px "JetBrains Mono", ui-monospace, monospace';
      context.textBaseline = 'top';
      for (const drop of rain) {
        for (let i = 0; i < drop.glyphs.length; i++) {
          const y = drop.y - i * 16;
          if (y < -16 || y > height) continue;
          context.fillStyle = i === 0 ? tint(0.85, [235, 255, 240]) : tint(0.42 - i * 0.028);
          context.fillText(drop.glyphs[i], drop.x, y);
        }
        if (shouldAnimate) {
          drop.y += drop.speed;
          if (Math.random() < 0.04) {
            drop.glyphs[Math.floor(Math.random() * drop.glyphs.length)] =
              RAIN_GLYPHS[Math.floor(Math.random() * RAIN_GLYPHS.length)];
          }
          if (drop.y - drop.glyphs.length * 16 > height) drop.y = -Math.random() * height * 0.3;
        }
      }
    };

    // glitchy.website-style nebula fog, floating bokeh and a glowing horizon.
    const drawNebula = (time: number) => {
      drawStars(time, 0.2);
      const drift = shouldAnimate ? time / 9000 : 0;
      const clouds: Array<[number, number, number, Rgb, number]> = [
        [0.22 + Math.sin(drift) * 0.03, 0.3, 0.55, neon, 0.13],
        [0.78, 0.22 + Math.cos(drift) * 0.03, 0.45, accent, 0.09],
        [0.6 + Math.cos(drift * 0.7) * 0.04, 0.7, 0.6, neon, 0.08],
      ];
      for (const [fx, fy, fr, color, alpha] of clouds) {
        const radius = Math.max(width, height) * fr;
        const cloud = context.createRadialGradient(fx * width, fy * height, 0, fx * width, fy * height, radius);
        cloud.addColorStop(0, tint(alpha, color));
        cloud.addColorStop(1, tint(0, color));
        context.fillStyle = cloud;
        context.fillRect(0, 0, width, height);
      }
      for (const dot of bokeh) {
        const pulse = 0.5 + 0.5 * Math.sin(dot.phase + time / 1300);
        const glow = context.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius);
        glow.addColorStop(0, tint(0.1 + pulse * 0.18));
        glow.addColorStop(1, tint(0));
        context.fillStyle = glow;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fill();
        if (shouldAnimate) {
          dot.y -= dot.speed;
          if (dot.y < -dot.radius) dot.y = height + dot.radius;
        }
      }
      const horizon = height * 0.74;
      const line = context.createLinearGradient(0, 0, width, 0);
      line.addColorStop(0, tint(0));
      line.addColorStop(0.5, tint(0.55));
      line.addColorStop(1, tint(0));
      context.fillStyle = line;
      context.fillRect(0, horizon, width, 1);
      const haze = context.createLinearGradient(0, horizon - 60, 0, horizon + 60);
      haze.addColorStop(0, tint(0));
      haze.addColorStop(0.5, tint(0.07));
      haze.addColorStop(1, tint(0));
      context.fillStyle = haze;
      context.fillRect(0, horizon - 60, width, 120);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      if (mode === 'galaxy') drawGalaxy(time);
      else if (mode === 'dots') drawDots(time);
      else if (mode === 'moving-lines') drawMovingLines(time);
      else if (mode === 'puffs') drawPuffs(time);
      else if (mode === 'circuit') drawCircuit(time);
      else if (mode === 'data-rain') drawRain();
      else if (mode === 'nebula') drawNebula(time);
      else if (mode === 'planet-orbit') drawPlanet(time);
      else if (mode === 'star-orbit') drawSun(time);
      else if (mode === 'asteroids') drawAsteroids(time);
      else drawStars(time, mode === 'stars' ? 0.35 : 0.18);
      if (shouldAnimate) frame = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (!shouldAnimate) draw(0);
    };

    resize();
    window.addEventListener('resize', onResize);
    if (shouldAnimate) frame = requestAnimationFrame(draw);
    else draw(0);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [animated, mode, palette]);

  return (
    <div className={`space-backdrop space-backdrop--${mode}`} aria-hidden="true">
      <canvas ref={canvasRef} className="starfield" />
      {(mode === 'square-grid' || mode === 'perspective-grid') && <span className="backdrop-grid" />}
    </div>
  );
}
