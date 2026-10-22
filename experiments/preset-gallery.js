// Renders every UI preset, the settings drawer tabs, both intros, a mobile view and the
// issue #7 views (panel materials, skinned dropdown, data table).
// Usage: start `npm run dev -- --port 5179` in app/, set `root` below to your checkout,
// then run this file with the Playwright MCP `browser_run_code_unsafe` tool
// (filename: experiments/preset-gallery.js).
async (page) => {
  const root = '/tmp/gh-issue-solver-1792691378975';
  const base = 'http://localhost:5179/';
  const out = `${root}/docs/screenshots/`;
  const key = 'immortality.ui-settings.v2';
  const settle = (ms) => page.waitForTimeout(ms);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  const { presets, defaults, surfaces } = await page.evaluate(async () => {
    const mod = await import('/src/settings.ts');
    return {
      presets: mod.PRESETS.map((p) => ({ id: p.id, settings: p.settings })),
      defaults: mod.DEFAULT_SETTINGS,
      surfaces: mod.SURFACES.map((s) => ({ id: s.id, label: s.label })),
    };
  });

  const load = async (settings) => {
    await page.goto('about:blank');
    await page.goto(base);
    await page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [key, settings]);
    await page.reload();
  };

  const shots = [];
  const shot = async (name, options = {}) => {
    await page.mouse.move(2, 2);
    await page.screenshot({ path: `${out}${name}`, ...options });
    shots.push(name);
  };

  for (const preset of presets) {
    await load({ ...preset.settings, intro: 'none' });
    await settle(3500);
    await shot(`preset-${preset.id}.png`);
  }
  // The default look doubles as the README hero image.
  await load({ ...defaults, intro: 'none' });
  await settle(3500);
  await shot('dashboard-world.png');

  // Every panel material side by side, painted with the same layers as the panels.
  await page.evaluate((list) => {
    const grid = document.createElement('div');
    grid.id = 'material-sheet';
    grid.style.cssText =
      'position:fixed;inset:0;z-index:100;display:grid;gap:14px;padding:28px;' +
      'grid-template-columns:repeat(5,1fr);align-content:start;background:var(--page)';
    for (const { id, label } of list) {
      const tile = document.createElement('div');
      tile.className = 'material-swatch';
      tile.dataset.material = id;
      tile.style.cssText =
        'width:auto;height:150px;display:flex;align-items:flex-end;padding:12px;' +
        'border:1px solid var(--neon-dim);color:var(--text-primary);font-size:13px;' +
        'letter-spacing:.12em;text-transform:uppercase;text-shadow:0 1px 2px #000';
      tile.textContent = label;
      grid.append(tile);
    }
    document.querySelector('.app-shell').append(grid);
  }, surfaces);
  await settle(300);
  await shot('materials.png', { clip: { x: 0, y: 0, width: 1440, height: 560 } });
  await page.evaluate(() => document.getElementById('material-sheet').remove());

  // Skinned dropdown, open.
  await page.locator('.entity-select .select-button').first().click();
  await settle(400);
  await shot('select-open.png', { clip: { x: 0, y: 120, width: 1000, height: 460 } });
  await page.keyboard.press('Escape');

  // Data table with its sticky header, scrolled.
  const table = page.locator('.data-table-wrap');
  await table.scrollIntoViewIfNeeded();
  await table.evaluate((el) => (el.scrollTop = 160));
  await settle(300);
  const box = await table.boundingBox();
  await shot('data-table.png', {
    clip: { x: box.x - 40, y: box.y - 110, width: box.width + 80, height: box.height + 150 },
  });

  // Settings drawer tabs.
  await load({ ...defaults, intro: 'none' });
  await settle(2500);
  await page.getByRole('button', { name: /settings/i }).first().click();
  await settle(800);
  await shot('settings-drawer.png');
  for (const [tab, name] of [
    [/^panels$/i, 'settings-drawer-panels.png'],
    [/scene/i, 'settings-drawer-scene.png'],
    [/audio/i, 'settings-drawer-audio.png'],
  ]) {
    await page.getByRole('tab', { name: tab }).click();
    await settle(500);
    await page.locator('.settings-panel').evaluate((el) => (el.scrollTop = 420));
    await settle(300);
    await shot(name);
  }

  for (const intro of ['boot', 'transmission']) {
    await load({ ...defaults, intro });
    await settle(intro === 'boot' ? 900 : 1500);
    await shot(`intro-${intro}.png`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const zknet = presets.find((p) => p.id === 'zknet').settings;
  await load({ ...zknet, intro: 'none' });
  await settle(3000);
  await shot('mobile-zknet.png');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => localStorage.clear());
  return shots;
}
