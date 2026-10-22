import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { BackgroundId, PaletteId } from '../settings';
import { onSoundCue } from '../sound';

interface StarfieldProps {
  mode?: BackgroundId;
  animated?: boolean;
  /** Re-tints the canvas when the palette (and so `--neon`) changes. */
  palette?: PaletteId;
  /** Animation speed multiplier (1 = default); also scales the CSS grid drift. */
  speed?: number;
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

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Tracks the OS reduced-motion preference, including changes while the page is open. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_MOTION).matches);
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Configurable deep-space canvas with two CSS grid overlays. */
export function Starfield({ mode = 'stars', animated = true, palette, speed = 1 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  // Read through a ref so moving the speed slider does not rebuild the scene.
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const styles = getComputedStyle(canvas);
    const neon = parseColor(styles.getPropertyValue('--neon'), FALLBACK_NEON);
    const accent = parseColor(styles.getPropertyValue('--threshold'), FALLBACK_ACCENT);
    const tint = (alpha: number, color: Rgb = neon) =>
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${Math.max(0, Math.min(1, alpha))})`;
    const shouldAnimate = animated && !reducedMotion;
    let stars: Star[] = [];
    let frame = 0;
    // Elapsed time in 60 fps frames, so drift speed does not depend on the display refresh rate.
    let lastTime = 0;
    let step = 1;
    // Scene clock in ms, advanced by real time × speed so every mode honours the speed setting.
    let clock = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let traces: Array<{ points: Array<[number, number]>; length: number; period: number; offset: number }> = [];
    let rain: Array<{ x: number; y: number; speed: number; glyphs: string[] }> = [];
    let bokeh: Array<{ x: number; y: number; radius: number; speed: number; phase: number }> = [];
    let nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let warp: Array<{ angle: number; distance: number; speed: number }> = [];
    // Sound resonance: rings spawned by interaction cues, plus the sparks they shed.
    let ripples: Array<{ x: number; born: number; strength: number }> = [];
    let sparks: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];
    let lastAmbient = 0;

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
      if (mode === 'constellation') {
        nodes = Array.from({ length: Math.min(90, Math.floor((width * height) / 16000)) }, () => ({
          x: random() * width,
          y: random() * height,
          vx: (random() - 0.5) * 0.25,
          vy: (random() - 0.5) * 0.25,
        }));
      }
      if (mode === 'warp') {
        warp = Array.from({ length: 220 }, () => ({
          angle: random() * Math.PI * 2,
          distance: random(),
          speed: 0.002 + random() * 0.006,
        }));
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
          star.y -= star.speed * step;
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
          drop.y += drop.speed * step;
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
          dot.y -= dot.speed * step;
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

    // Aurora curtains: vertical light bands whose crest follows slow travelling sine waves.
    const drawAurora = (time: number) => {
      drawStars(time, 0.22);
      const t = time / 1000;
      const bands: Array<[Rgb, number, number]> = [
        [neon, 0.32, 0.16],
        [accent, 0.42, 0.08],
        [neon, 0.24, 0.1],
      ];
      bands.forEach(([color, baseline, alpha], band) => {
        for (let x = 0; x < width; x += 6) {
          const crest =
            height * baseline +
            Math.sin(x / 180 + t * 0.35 + band * 2) * 40 +
            Math.sin(x / 67 - t * 0.6 + band) * 14;
          const length = 120 + 70 * (0.5 + 0.5 * Math.sin(x / 120 + t * 0.5 + band * 1.7));
          const curtain = context.createLinearGradient(0, crest, 0, crest + length);
          curtain.addColorStop(0, tint(0, color));
          curtain.addColorStop(0.25, tint(alpha, color));
          curtain.addColorStop(1, tint(0, color));
          context.fillStyle = curtain;
          context.fillRect(x, crest, 6, length);
        }
      });
    };

    // Warp: stars streaking out of a vanishing point, longer as they accelerate.
    const drawWarp = () => {
      const cx = width / 2;
      const cy = height / 2;
      const reach = Math.hypot(cx, cy);
      context.lineCap = 'round';
      for (const star of warp) {
        const near = star.distance * star.distance;
        const r = near * reach;
        const tail = Math.min(r, 4 + near * 90);
        const cos = Math.cos(star.angle);
        const sin = Math.sin(star.angle);
        context.strokeStyle = tint(0.08 + near * 0.7, near > 0.6 ? [235, 250, 255] : neon);
        context.lineWidth = 0.6 + near * 1.6;
        context.beginPath();
        context.moveTo(cx + cos * (r - tail), cy + sin * (r - tail));
        context.lineTo(cx + cos * r, cy + sin * r);
        context.stroke();
        if (shouldAnimate) {
          star.distance += star.speed * step * (0.4 + star.distance);
          if (star.distance > 1.05) star.distance = Math.random() * 0.08;
        }
      }
    };

    // Honeycomb lattice with a highlight band sweeping diagonally across it.
    const drawHexagons = (time: number) => {
      const size = 26;
      const w = Math.sqrt(3) * size;
      const h = 1.5 * size;
      const sweep = shouldAnimate ? ((time / 6000) % 1) * (width + height + 400) - 200 : width * 0.5;
      context.lineWidth = 1;
      for (let row = -1; row * h < height + size; row++) {
        for (let col = -1; col * w < width + w; col++) {
          const x = col * w + (row % 2 ? w / 2 : 0);
          const y = row * h;
          const lit = Math.max(0, 1 - Math.abs(x + y - sweep) / 160);
          context.strokeStyle = tint(0.06 + lit * 0.4);
          context.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (Math.PI / 3) * k + Math.PI / 6;
            const px = x + Math.cos(angle) * (size - 2);
            const py = y + Math.sin(angle) * (size - 2);
            if (k === 0) context.moveTo(px, py);
            else context.lineTo(px, py);
          }
          context.closePath();
          context.stroke();
          if (lit > 0.6) {
            context.fillStyle = tint((lit - 0.6) * 0.12);
            context.fill();
          }
        }
      }
    };

    // Radar scope: range rings, a rotating sweep and blips that fade after the beam passes.
    const drawRadar = (time: number) => {
      drawStars(time, 0.16);
      const cx = width * 0.78;
      const cy = height * 0.68;
      const radius = Math.max(220, Math.min(width, height) * 0.46);
      const angle = shouldAnimate ? (time / 4000) * Math.PI * 2 : -0.6;
      context.lineWidth = 1;
      for (let ring = 1; ring <= 4; ring++) {
        context.strokeStyle = tint(0.1);
        context.beginPath();
        context.arc(cx, cy, (radius * ring) / 4, 0, Math.PI * 2);
        context.stroke();
      }
      context.strokeStyle = tint(0.07);
      context.beginPath();
      context.moveTo(cx - radius, cy);
      context.lineTo(cx + radius, cy);
      context.moveTo(cx, cy - radius);
      context.lineTo(cx, cy + radius);
      context.stroke();
      const trail = 0.9;
      for (let k = 0; k < 24; k++) {
        const a0 = angle - (trail * k) / 24;
        context.fillStyle = tint(0.16 * (1 - k / 24));
        context.beginPath();
        context.moveTo(cx, cy);
        context.arc(cx, cy, radius, a0 - trail / 24, a0);
        context.closePath();
        context.fill();
      }
      const random = seededRandom(211);
      for (let i = 0; i < 14; i++) {
        const blipAngle = random() * Math.PI * 2;
        const blipDistance = (0.15 + random() * 0.8) * radius;
        const since = (((angle - blipAngle) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const alpha = Math.max(0, 1 - since / 3.5);
        context.fillStyle = tint(0.05 + alpha * 0.85);
        context.beginPath();
        context.arc(cx + Math.cos(blipAngle) * blipDistance, cy + Math.sin(blipAngle) * blipDistance, 2.2, 0, Math.PI * 2);
        context.fill();
      }
    };

    // Constellation: drifting nodes joined by lines that fade with distance.
    const drawConstellation = (time: number) => {
      drawStars(time, 0.18);
      const link = 150;
      context.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > link) continue;
          context.strokeStyle = tint((1 - distance / link) * 0.28);
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
      for (const node of nodes) {
        context.fillStyle = tint(0.75);
        context.beginPath();
        context.arc(node.x, node.y, 1.6, 0, Math.PI * 2);
        context.fill();
        if (shouldAnimate) {
          node.x += node.vx * step;
          node.y += node.vy * step;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }
    };

    // Arwes "GridLines": dashed horizontals over solid verticals, the dashes slowly marching.
    const drawGridLines = (time: number) => {
      const distance = 30;
      context.lineWidth = 1;
      context.strokeStyle = tint(0.07);
      context.setLineDash([]);
      context.beginPath();
      for (let x = distance / 2; x < width; x += distance) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      context.stroke();
      context.strokeStyle = tint(0.12);
      context.setLineDash([4, 4]);
      context.lineDashOffset = shouldAnimate ? -(time / 120) % 8 : 0;
      context.beginPath();
      for (let y = distance / 2; y < height; y += distance) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();
      context.setLineDash([]);
      context.lineDashOffset = 0;
    };

    // Soul Extract-style signal rails: a fine scanline field, dotted column rails, solid row
    // rails and lights running along them under a soft corner glow.
    const drawRails = (time: number) => {
      const glow = context.createRadialGradient(
        width * 0.25,
        height * 0.25,
        0,
        width * 0.25,
        height * 0.25,
        Math.max(width, height) * 0.6,
      );
      glow.addColorStop(0, tint(0.09));
      glow.addColorStop(1, tint(0));
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.fillStyle = tint(0.025);
      for (let y = 0; y < height; y += 10) context.fillRect(0, y, width, 1);
      context.lineWidth = 1;
      context.strokeStyle = tint(0.13);
      context.setLineDash([3, 7]);
      context.beginPath();
      for (let x = 100; x < width; x += 100) {
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, height);
      }
      context.stroke();
      context.setLineDash([]);
      context.strokeStyle = tint(0.08);
      context.beginPath();
      for (let y = 200; y < height; y += 200) {
        context.moveTo(0, y + 0.5);
        context.lineTo(width, y + 0.5);
      }
      context.stroke();
      if (!shouldAnimate) return;
      const random = seededRandom(331);
      const columns = Math.floor(width / 100);
      for (let column = 1; column <= columns; column++) {
        if (random() > 0.45) continue;
        const period = 3800 + random() * 5200;
        const y = (((time + random() * period) % period) / period) * (height + 160) - 80;
        const light = context.createLinearGradient(0, y - 80, 0, y);
        light.addColorStop(0, tint(0));
        light.addColorStop(1, tint(0.7));
        context.fillStyle = light;
        context.fillRect(column * 100, y - 80, 1.5, 80);
      }
      const rows = Math.floor(height / 200);
      for (let row = 1; row <= rows; row++) {
        const period = 6000 + random() * 6000;
        const x = (((time + random() * period) % period) / period) * (width + 240) - 120;
        const light = context.createLinearGradient(x - 120, 0, x, 0);
        light.addColorStop(0, tint(0));
        light.addColorStop(1, tint(0.6));
        context.fillStyle = light;
        context.fillRect(x - 120, row * 200, 120, 1.5);
      }
    };

    // glitchy.website-style sound resonance: a slowly breathing ring that sends out ripples
    // and sparks whenever the interface makes a sound (and a quiet ambient pulse otherwise).
    const drawResonance = (time: number) => {
      drawStars(time, 0.16);
      const cy = height * 0.55;
      const base = Math.min(width, height) * 0.18;
      context.lineWidth = 1;
      context.strokeStyle = tint(0.22);
      context.beginPath();
      for (let k = 0; k <= 180; k++) {
        const angle = (k / 180) * Math.PI * 2;
        const wobble = shouldAnimate
          ? Math.sin(angle * 6 + time / 700) * 3 + Math.sin(angle * 11 - time / 460) * 1.5
          : 0;
        const x = width / 2 + Math.cos(angle) * (base + wobble);
        const y = cy + Math.sin(angle) * (base + wobble);
        if (k === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      if (!shouldAnimate) return;
      if (time - lastAmbient > 2500) {
        lastAmbient = time;
        ripples.push({ x: width / 2, born: time, strength: 0.35 });
      }
      const life = 2600;
      ripples = ripples.filter((ripple) => time - ripple.born < life);
      for (const ripple of ripples) {
        const t = (time - ripple.born) / life;
        const radius = base + t * Math.max(width, height) * 0.55;
        context.strokeStyle = tint((1 - t) * 0.5 * ripple.strength);
        context.lineWidth = 1 + (1 - t) * 1.5;
        context.beginPath();
        context.arc(ripple.x, cy, radius, 0, Math.PI * 2);
        context.stroke();
      }
      sparks = sparks.filter((spark) => spark.life > 0);
      for (const spark of sparks) {
        context.fillStyle = tint(spark.life * 0.8);
        context.fillRect(spark.x, spark.y, 1.6, 1.6);
        spark.x += spark.vx * step;
        spark.y += spark.vy * step;
        spark.life -= 0.012 * step;
      }
    };

    const resonate = (pan: number, strength: number) => {
      if (!shouldAnimate || ripples.length > 24) return;
      const x = width / 2 + pan * width * 0.3;
      ripples.push({ x, born: clock, strength });
      const base = Math.min(width, height) * 0.18;
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 1.6;
        sparks.push({
          x: x + Math.cos(angle) * base,
          y: height * 0.55 + Math.sin(angle) * base,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
        });
      }
      if (sparks.length > 240) sparks = sparks.slice(-240);
    };

    const draw = (time: number) => {
      const elapsed = lastTime ? Math.min(66, time - lastTime) : 1000 / 60;
      lastTime = time;
      const rate = Math.max(0, speedRef.current);
      step = (elapsed / (1000 / 60)) * rate;
      clock += elapsed * rate;
      time = shouldAnimate ? clock : 0;
      context.clearRect(0, 0, width, height);
      if (mode === 'galaxy') drawGalaxy(time);
      else if (mode === 'aurora') drawAurora(time);
      else if (mode === 'warp') drawWarp();
      else if (mode === 'hexagons') drawHexagons(time);
      else if (mode === 'radar') drawRadar(time);
      else if (mode === 'constellation') drawConstellation(time);
      else if (mode === 'dots') drawDots(time);
      else if (mode === 'moving-lines') drawMovingLines(time);
      else if (mode === 'puffs') drawPuffs(time);
      else if (mode === 'circuit') drawCircuit(time);
      else if (mode === 'data-rain') drawRain();
      else if (mode === 'nebula') drawNebula(time);
      else if (mode === 'planet-orbit') drawPlanet(time);
      else if (mode === 'star-orbit') drawSun(time);
      else if (mode === 'asteroids') drawAsteroids(time);
      else if (mode === 'grid-lines') drawGridLines(time);
      else if (mode === 'rails') drawRails(time);
      else if (mode === 'resonance') drawResonance(time);
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
    // Hover cues are frequent and soft; clicks, toggles and notifications ring out harder.
    const unsubscribe =
      mode === 'resonance'
        ? onSoundCue(({ event, pan }) =>
            resonate(pan, event === 'hover' || event === 'type' ? 0.45 : 1),
          )
        : undefined;

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      unsubscribe?.();
    };
  }, [animated, mode, palette, reducedMotion]);

  return (
    <div
      className={`space-backdrop space-backdrop--${mode}`}
      style={{ '--bg-speed': Math.max(0.05, speed) } as CSSProperties}
      data-frozen={speed <= 0 ? 'true' : undefined}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="starfield" />
      {(mode === 'square-grid' || mode === 'perspective-grid') && <span className="backdrop-grid" />}
    </div>
  );
}
