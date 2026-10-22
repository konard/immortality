import { describe, expect, it } from 'vitest';
import { onSoundCue, sounds, type SoundCue } from './sound';

describe('sound cues', () => {
  it('reports interaction cues to listeners even while muted, until unsubscribed', () => {
    const cues: SoundCue[] = [];
    const unsubscribe = onSoundCue((cue) => cues.push(cue));
    sounds.setEnabled(false);
    sounds.click();
    sounds.notify();
    unsubscribe();
    sounds.hover();
    expect(cues.map(({ event }) => event)).toEqual(['activate', 'notify']);
    expect(cues[0].pan).toBeGreaterThanOrEqual(-1);
    expect(cues[0].pan).toBeLessThanOrEqual(1);
  });
});
