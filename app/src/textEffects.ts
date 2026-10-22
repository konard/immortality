// Frame-by-frame text transitions. Pure functions so they can be unit tested
// and driven by any clock (requestAnimationFrame in the UI, fixed steps in tests).
//
// Algorithms follow Arwes `animateTextDecipher` / `animateTextSequence`
// (https://github.com/arwes/arwes/tree/bdbaa0324900ee978d42036d1304a053c1fe54b5/packages/text)
// and Soul Extract's "transform"/"transition" text schemes.

export const DECIPHER_CHARACTERS =
  '    ----____abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Random order in which character positions are revealed. Whitespace is excluded. */
export function revealOrder(text: string, random: () => number = Math.random): number[] {
  const indexes: number[] = [];
  for (let i = 0; i < text.length; i++) if (!/\s/.test(text[i])) indexes.push(i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

/**
 * Text at `progress` (0–1) of a decipher transition: revealed positions show the
 * real character, the rest cycle through random glyphs, whitespace is preserved.
 */
export function decipherFrame(
  text: string,
  progress: number,
  order: readonly number[],
  random: () => number = Math.random
): string {
  if (progress >= 1) return text;
  const revealedCount = Math.floor(Math.max(0, progress) * order.length);
  const revealed = new Set(order.slice(0, revealedCount));
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/\s/.test(ch) || revealed.has(i)) out += ch;
    else out += DECIPHER_CHARACTERS[Math.floor(random() * DECIPHER_CHARACTERS.length)];
  }
  return out;
}

/** Typewriter transition: the visible prefix at `progress` (0–1). */
export function sequenceFrame(text: string, progress: number): string {
  if (progress >= 1) return text;
  return text.slice(0, Math.floor(Math.max(0, progress) * text.length));
}

/** Transition length in ms that scales with text size, bounded for very short or long text. */
export function effectDuration(text: string, speedPercent = 100): number {
  const base = Math.min(1400, Math.max(450, text.length * 45));
  return base / (Math.max(1, speedPercent) / 100);
}
