// Renders every sound in the library through the real master bus with an
// OfflineAudioContext and reports peak / RMS, so we can check that nothing clips
// (peak < 1) and nothing is silent. Run with the dev server up (npm run dev -- --port 5179):
//   Playwright MCP: browser_run_code_unsafe with filename experiments/sound-render.js
async (page) => {
  await page.goto('http://localhost:5179/');
  return await page.evaluate(async () => {
    const { SOUND_SPECS, createBus, playSpec } = await import('/src/sound.ts');
    const rows = [];
    for (const [id, spec] of Object.entries(SOUND_SPECS)) {
      const rate = 48000;
      const audio = new OfflineAudioContext(2, rate * 2.5, rate);
      const bus = createBus(audio);
      bus.wet.gain.value = 0.18;
      // Layered worst case: three overlapping plays at full gain.
      for (let i = 0; i < 3; i++) playSpec(spec, audio, bus.input, { at: 0.02 + i * 0.01 });
      const buffer = await audio.startRendering();
      let peak = 0;
      let sum = 0;
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        const data = buffer.getChannelData(c);
        for (let i = 0; i < data.length; i++) {
          const v = Math.abs(data[i]);
          if (v > peak) peak = v;
          sum += data[i] * data[i];
        }
      }
      const rms = Math.sqrt(sum / (buffer.length * buffer.numberOfChannels));
      rows.push({ id, label: spec.label, peak: +peak.toFixed(3), rmsDb: +(20 * Math.log10(rms || 1e-9)).toFixed(1) });
    }
    return {
      rows,
      clipped: rows.filter((r) => r.peak >= 1).map((r) => r.id),
      silent: rows.filter((r) => r.peak < 0.01).map((r) => r.id),
    };
  });
}
