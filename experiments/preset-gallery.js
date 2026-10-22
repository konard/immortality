// Renders every UI preset, the settings drawer, both intros and a mobile view.
// Usage: start `npm run dev -- --port 5179` in app/, then run this file with the
// Playwright MCP `browser_run_code_unsafe` tool (filename: experiments/preset-gallery.js).
async (page) => {
  const base = 'http://localhost:5179/';
  const out = '/tmp/gh-issue-solver-1792674524779/docs/screenshots/';
  const key = 'immortality.ui-settings.v1';
  const settle = (ms) => page.waitForTimeout(ms);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  const presets = await page.evaluate(async () => {
    const mod = await import('/src/settings.ts');
    return mod.PRESETS.map((p) => ({ id: p.id, settings: p.settings }));
  });

  const load = async (settings) => {
    await page.goto('about:blank');
    await page.goto(base);
    await page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [key, settings]);
    await page.reload();
  };

  const shots = [];
  for (const preset of presets) {
    await load({ ...preset.settings, intro: 'none' });
    await settle(3500);
    await page.screenshot({ path: `${out}preset-${preset.id}.png` });
    shots.push(`preset-${preset.id}.png`);
  }

  const mission = presets.find((p) => p.id === 'mission').settings;
  await load({ ...mission, intro: 'none' });
  await settle(2500);
  await page.getByRole('button', { name: /settings/i }).first().click();
  await settle(800);
  await page.screenshot({ path: `${out}settings-drawer.png` });
  shots.push('settings-drawer.png');
  await page.getByRole('tab', { name: /scene/i }).click();
  await settle(500);
  await page.screenshot({ path: `${out}settings-drawer-scene.png` });
  shots.push('settings-drawer-scene.png');

  for (const intro of ['boot', 'transmission']) {
    await load({ ...mission, intro });
    await settle(intro === 'boot' ? 900 : 1500);
    await page.screenshot({ path: `${out}intro-${intro}.png` });
    shots.push(`intro-${intro}.png`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const zknet = presets.find((p) => p.id === 'zknet').settings;
  await load({ ...zknet, intro: 'none' });
  await settle(3000);
  await page.screenshot({ path: `${out}mobile-zknet.png` });
  shots.push('mobile-zknet.png');
  await page.setViewportSize({ width: 1440, height: 1000 });
  return shots;
}
