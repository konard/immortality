// Prints every UI configuration axis, its options and the presets.
// Usage (from app/): npx vite-node ../experiments/list-axes.ts
import { AXES, PRESETS, SETTING_GROUPS, SOUND_EVENTS, SOUND_PRESETS } from '../app/src/settings';
for (const g of SETTING_GROUPS) {
  console.log(`## ${g.label}`);
  for (const a of AXES.filter((x) => x.group === g.id)) {
    const opts = a.kind === 'choice' ? a.options.map((o) => o.label).join(', ') : a.kind === 'range' ? `${a.min}–${a.max}${a.unit ?? ''}` : 'on/off';
    console.log(`- ${a.label}: ${opts}`);
  }
}
console.log('PRESETS', PRESETS.map((p) => `${p.label} (${p.description})`).join(' | '));
console.log('SOUNDS', SOUND_EVENTS.length, SOUND_PRESETS.length, AXES.length);
