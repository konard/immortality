// Browser checks for the review fixes (run with Playwright MCP browser_run_code_unsafe
// against the Vite dev server on http://localhost:5179):
//  1. share links keep the viewer's motion/audio settings,
//  2. staggered panels are visible immediately with motion off,
//  3. the intro makes the page inert and returns focus after a replay.
async (page) => {
  const base = 'http://localhost:5179/';
  const key = 'immortality.ui-settings.v1';
  const results = {};

  // 1. Viewer has motion + sound off; open a share link from a sender with sound on.
  await page.goto(base);
  await page.evaluate((k) => {
    localStorage.setItem(k, JSON.stringify({ animations: false, sound: false, volume: 15, intro: 'none' }));
  }, key);
  const shared = encodeURIComponent(JSON.stringify({ palette: 'ares', stagger: true, sound: true, animations: true, volume: 100 }));
  await page.goto('about:blank');
  await page.goto(`${base}#ui=${shared}`);
  await page.waitForSelector('.app-shell');
  results.share = await page.evaluate((k) => {
    const saved = JSON.parse(localStorage.getItem(k));
    const shell = document.querySelector('.app-shell');
    return {
      palette: shell.getAttribute('data-palette'),
      motionOff: shell.classList.contains('motion-off'),
      saved: { animations: saved.animations, sound: saved.sound, volume: saved.volume },
      hash: location.hash,
    };
  }, key);

  // 2. Motion off + stagger on: every frame is visible right away (no delayed fill).
  await page.waitForSelector('.frame');
  results.stagger = await page.evaluate(() => {
    const frames = [...document.querySelectorAll('.layout > *, .hero > *')];
    const hidden = frames.filter((el) => Number(getComputedStyle(el).opacity) < 0.99);
    const delays = [...new Set(frames.map((el) => getComputedStyle(el).animationDelay))];
    return { frames: frames.length, hidden: hidden.length, delays };
  });

  // 3. Intro replay from the drawer: siblings inert while open, focus back on the toggle.
  await page.evaluate((k) => {
    const saved = JSON.parse(localStorage.getItem(k));
    localStorage.setItem(k, JSON.stringify({ ...saved, intro: 'boot', animations: true }));
  }, key);
  await page.goto('about:blank');
  await page.goto(base);
  await page.waitForSelector('.intro');
  results.introOnLoad = await page.evaluate(() => {
    const intro = document.querySelector('.intro');
    const siblings = [...intro.parentElement.children].filter((el) => el !== intro);
    return {
      inertSiblings: siblings.filter((el) => el.inert).length,
      siblings: siblings.length,
      focusInIntro: intro.contains(document.activeElement),
    };
  });
  await page.keyboard.press('Space');
  await page.waitForSelector('.intro', { state: 'detached' });
  results.afterLoadIntro = await page.evaluate(() => ({
    inertLeft: document.querySelectorAll('[inert]').length,
  }));

  await page.getByRole('button', { name: /settings/i }).first().click();
  await page.getByRole('tab', { name: /hud/i }).click();
  await page.getByRole('button', { name: /play intro now/i }).click();
  await page.waitForSelector('.intro');
  results.replayInert = await page.evaluate(() => document.querySelectorAll('[inert]').length);
  await page.keyboard.press('Escape');
  await page.waitForSelector('.intro', { state: 'detached' });
  await page.waitForTimeout(100);
  results.afterReplay = await page.evaluate(() => ({
    inertLeft: document.querySelectorAll('[inert]').length,
    focused: document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim(),
  }));

  await page.evaluate((k) => localStorage.removeItem(k), key);
  return results;
}
