import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  acceleration,
  assessLev,
  toPoints,
  velocity,
  LEV_THRESHOLD,
  type Point,
} from './analytics';
import { RANGE_PRESETS, type Snapshot } from './types';
import { sounds } from './sound';
import { Starfield } from './components/Starfield';
import { Frame } from './components/Frame';
import { Gauge } from './components/Gauge';
import { StatTile } from './components/StatTile';
import { LineChart } from './components/LineChart';
import { DataTable } from './components/DataTable';
import { SettingsPanel } from './components/SettingsPanel';
import { Overlays } from './components/Overlays';
import { HudBar } from './components/HudBar';
import { Intro } from './components/Intro';
import { FxText } from './components/FxText';
import { Select } from './components/Select';
import { UiSettingsContext, motionAllowed } from './uiContext';
import {
  DEFAULT_SETTINGS,
  LEGACY_SETTINGS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  TRANSLUCENT_SURFACES,
  applySharedLook,
  decodeShareHash,
  migrateLegacySettings,
  parseStoredSettings,
  type UiSettings,
} from './settings';

const SMOOTH_WINDOW = 10;

/** Peer-reviewed sources behind the verdict text (see docs/case-studies/issue-7). */
const EVIDENCE = [
  { label: 'de Grey 2004, PLoS Biol (UK)', doi: '10.1371/journal.pbio.0020187' },
  { label: 'Warner et al. 2005, EMBO Rep (28 biogerontologists)', doi: '10.1038/sj.embor.7400555' },
  { label: 'Oeppen & Vaupel 2002, Science (UK/DE)', doi: '10.1126/science.1069675' },
  { label: 'Vaupel et al. 2021, PNAS (DK/ES)', doi: '10.1073/pnas.2019536118' },
  { label: 'Olshansky et al. 2024, Nat Aging (US)', doi: '10.1038/s43587-024-00702-3' },
  { label: 'GBD 2021 Forecasting 2024, Lancet (global)', doi: '10.1016/S0140-6736(24)00685-8' },
  { label: 'Kannisto et al. 1994, PDR (DK/US/UK)', doi: '10.2307/2137662' },
  { label: 'Moqri et al. 2023, Cell (international)', doi: '10.1016/j.cell.2023.08.003' },
] as const;

/** Palette variables the document root needs for its own scrollbar and overscroll colour. */
const ROOT_VARIABLES = [
  '--page',
  '--surface-1',
  '--surface-2',
  '--gridline',
  '--neon',
  '--neon-dim',
  '--neon-faint',
] as const;

/** A palette-coloured targeting reticle (Arwes-style) with a dark halo for contrast. */
export const reticleCursor = (color: string): string => {
  const marks = "<circle cx='12' cy='12' r='6'/><path d='M12 1v6M12 17v6M1 12h6M17 12h6'/>";
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>" +
    `<g stroke='rgba(0,0,0,0.65)' stroke-width='3'>${marks}</g>` +
    `<g stroke='${color}' stroke-width='1.4'>${marks}</g>` +
    `<circle cx='12' cy='12' r='1.2' fill='${color}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 12 12, crosshair`;
};

const inRange = (points: Point[], fromYear: number) => points.filter((p) => p.year >= fromYear);

const initialSettings = (): UiSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  let stored = DEFAULT_SETTINGS;
  try {
    const current = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    const legacy = window.localStorage.getItem(LEGACY_SETTINGS_STORAGE_KEY);
    // First visit after the v2 schema: keep what the viewer customized, adopt the new look
    // for everything they never touched, then retire the old key.
    stored = current === null && legacy !== null
      ? migrateLegacySettings(legacy)
      : parseStoredSettings(current);
    if (legacy !== null) window.localStorage.removeItem(LEGACY_SETTINGS_STORAGE_KEY);
  } catch {
    // Storage may be disabled; fall back to the defaults.
  }
  // A shared `#ui=` link wins over the saved look (and is then saved), but never over
  // the viewer's own motion and audio preferences.
  const shared = decodeShareHash(window.location.hash);
  return shared ? applySharedLook(stored, shared) : stored;
};

/**
 * Root element carrying every visual axis as a data attribute or CSS variable, so the
 * stylesheet can switch looks without React re-rendering the dashboard markup.
 */
function Shell({
  settings,
  settingsOpen = false,
  children,
}: {
  settings: UiSettings;
  settingsOpen?: boolean;
  children: ReactNode;
}) {
  const style: Record<string, string> = {
    '--corner': `${settings.cornerSize}px`,
    '--border-width': `${settings.borderWidth}px`,
    '--surface-opacity': String(settings.surfaceOpacity / 100),
    '--surface-blur': `${settings.surfaceBlur}px`,
    '--font-scale': String(settings.fontScale / 100),
    '--chart-line': `${settings.chartLineWidth}px`,
  };
  if (settings.backgroundSpeed !== 100) {
    style['--bg-speed'] = String(settings.backgroundSpeed / 100);
  }
  if (settings.animationSpeed !== 100) {
    style['--motion-scale'] = String(100 / settings.animationSpeed);
  }
  if (settings.backgroundIntensity !== 100) {
    style['--bg-opacity'] = String(Math.min(1, settings.backgroundIntensity / 100));
    style['--bg-brightness'] = String(Math.max(1, settings.backgroundIntensity / 100));
  }
  const shellRef = useRef<HTMLDivElement>(null);
  // The page scrollbar and overscroll area belong to <html>, outside the shell, so mirror
  // the palette colours and scrollbar style onto the document element.
  useLayoutEffect(() => {
    const element = shellRef.current;
    if (!element) return;
    const root = document.documentElement;
    const computed = getComputedStyle(element);
    for (const name of ROOT_VARIABLES) {
      const value = computed.getPropertyValue(name).trim();
      if (value) root.style.setProperty(name, value);
    }
    root.style.setProperty('--cursor-reticle', reticleCursor(computed.getPropertyValue('--neon').trim()));
    root.dataset.scrollbar = settings.scrollbarStyle;
  }, [settings.palette, settings.scrollbarStyle]);

  const classes = ['app-shell'];
  if (!settings.animations) classes.push('motion-off');
  if (settingsOpen) classes.push('settings-open');
  return (
    <UiSettingsContext.Provider value={settings}>
      <div
        ref={shellRef}
        className={classes.join(' ')}
        data-palette={settings.palette}
        data-glow={settings.glow}
        data-frame={settings.frame}
        data-surface={settings.surface}
        data-density={settings.density}
        data-meter={settings.meter}
        data-font={settings.font}
        data-heading-case={settings.headingCase}
        data-title={settings.titleStyle}
        data-text-effect={settings.textEffect}
        data-entrance={settings.entrance}
        data-stagger={settings.stagger ? 'on' : 'off'}
        data-chart={settings.chartStyle}
        data-status-bar={settings.statusBar ? 'on' : 'off'}
        data-panel-shadow={settings.panelShadow}
        data-hover={settings.hoverEffect}
        data-cursor={settings.cursor}
        data-table={settings.tableStyle}
        data-scrollbar={settings.scrollbarStyle}
        data-backdrop={settings.backdropGradient}
        data-translucent={
          TRANSLUCENT_SURFACES.has(settings.surface) ||
          (settings.surface !== 'transparent' && settings.surfaceOpacity < 100)
            ? 'on'
            : 'off'
        }
        style={style as CSSProperties}
      >
        <div className="backdrop-gradient" aria-hidden="true" />
        <Starfield
          mode={settings.background}
          animated={settings.animations}
          palette={settings.palette}
          speed={settings.backgroundSpeed / 100}
        />
        <Overlays />
        {children}
      </div>
    </UiSettingsContext.Provider>
  );
}

export default function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [entity, setEntity] = useState('World');
  const [rangeId, setRangeId] = useState('all');
  const [uiSettings, setUiSettings] = useState<UiSettings>(initialSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // The intro plays once per page load (and on demand from the settings drawer).
  const [introVisible, setIntroVisible] = useState(() => uiSettings.intro !== 'none');
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const introReplayed = useRef(false);

  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
    sounds.close();
    requestAnimationFrame(() => settingsButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/life-expectancy.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<Snapshot>;
      })
      .then(setSnapshot)
      .catch((error: unknown) => setLoadError(String(error)));
  }, []);

  useEffect(() => {
    // Drop the applied share link so reloads use the (now saved) preference.
    const dropShareHash = () =>
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    if (decodeShareHash(window.location.hash)) dropShareHash();
    // A share link pasted into an already open tab only changes the hash (no reload).
    const onHashChange = () => {
      const shared = decodeShareHash(window.location.hash);
      if (!shared) return;
      setUiSettings((current) => applySharedLook(current, shared));
      dropShareHash();
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    sounds.configure(uiSettings);
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(uiSettings));
    } catch {
      // Storage may be disabled; settings still work for this session.
    }
  }, [uiSettings]);

  const analysis = useMemo(() => {
    if (!snapshot) return null;
    const series = toPoints(snapshot.series[entity] ?? []);
    const v = velocity(series, SMOOTH_WINDOW);
    const a = acceleration(series, SMOOTH_WINDOW);
    const lev = assessLev(v);
    const peak = v.length > 0 ? v.reduce((best, p) => (p.value > best.value ? p : best)) : null;
    return { series, v, a, lev, peak };
  }, [snapshot, entity]);

  if (loadError) {
    return (
      <Shell settings={uiSettings}>
        <div className="layout">
          <p className="load-error">Data link failure — {loadError}</p>
        </div>
      </Shell>
    );
  }
  if (!snapshot || !analysis) {
    return (
      <Shell settings={uiSettings}>
        <div className="layout loading-layout">
          <div className="loading" role="status">
            <span className="busy-indicator" aria-hidden="true">
              <span />
            </span>
            Establishing data link…
          </div>
        </div>
      </Shell>
    );
  }

  const { series, v, a, lev, peak } = analysis;
  const latestYear = series.length > 0 ? series[series.length - 1].year : 0;
  const preset = RANGE_PRESETS.find((r) => r.id === rangeId) ?? RANGE_PRESETS[0];
  const fromYear = preset.fromYear(latestYear);
  const latest = series[series.length - 1];
  // Sparklines show the last few decades behind each headline number.
  const recent = (points: Point[]) => points.slice(-40).map((point) => point.value);

  const toggleSound = () => {
    const next = !uiSettings.sound;
    setUiSettings({ ...uiSettings, sound: next });
    sounds.setEnabled(next);
  };

  return (
    <Shell settings={uiSettings} settingsOpen={settingsOpen}>
      <HudBar entity={entity} year={latestYear} />
      <div className="layout">
        <header className="masthead">
          <div>
            <h1>
              <FxText text="Immortality" />
            </h1>
            <p className="subtitle">Longevity escape velocity monitor · mission year {latestYear}</p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="sound-toggle"
              aria-pressed={uiSettings.sound}
              onPointerEnter={() => sounds.hover()}
              onClick={toggleSound}
            >
              {uiSettings.sound ? '♪ Sound on' : '♪ Sound off'}
            </button>
            <button
              ref={settingsButtonRef}
              type="button"
              className="settings-button"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              onPointerEnter={() => sounds.hover()}
              onClick={() => {
                setSettingsOpen(true);
                sounds.open();
              }}
            >
              ⚙ Settings
            </button>
          </div>
        </header>

        {/* One filter row scoping everything below it */}
        <div className="filters" role="group" aria-label="Data filters">
          <label htmlFor="entity-select">Entity</label>
          <Select
            id="entity-select"
            className="entity-select"
            value={entity}
            options={snapshot.entities.map((name) => ({ id: name, label: name }))}
            onChange={setEntity}
          />
          <label id="range-label">Range</label>
          <div className="range-group" role="group" aria-labelledby="range-label">
            {RANGE_PRESETS.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={r.id === rangeId}
                onPointerEnter={() => sounds.hover()}
                onClick={() => {
                  setRangeId(r.id);
                  sounds.click();
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hero">
          <Gauge entity={entity} lev={lev} />
          <StatTile
            label="Life expectancy"
            value={latest ? latest.value.toFixed(1) : '—'}
            unit="years"
            hint={latest ? `at birth, ${latest.year}` : undefined}
            spark={recent(series)}
          />
          <StatTile
            label="Velocity"
            value={lev ? lev.currentVelocity.toFixed(3) : '—'}
            unit="yr / yr"
            hint={`${SMOOTH_WINDOW}-year smoothed`}
            spark={recent(v)}
          />
          <StatTile
            label="Velocity trend"
            value={lev ? `${lev.velocityTrend >= 0 ? '+' : ''}${lev.velocityTrend.toFixed(4)}` : '—'}
            unit="yr / yr²"
            hint={
              lev ? (
                <span className={lev.velocityTrend >= 0 ? 'delta-up' : 'delta-down'}>
                  {lev.velocityTrend >= 0 ? '▲ accelerating' : '▼ decelerating'} (30-yr fit)
                </span>
              ) : undefined
            }
            spark={recent(a)}
          />
          <StatTile
            label="ETA to escape velocity"
            value={lev?.reached ? 'Reached' : lev?.etaYear ? String(lev.etaYear) : 'Never'}
            count={false}
            hint={
              lev?.reached
                ? 'threshold crossed'
                : lev?.etaYear
                  ? 'if the current trend holds'
                  : 'on the current trajectory'
            }
          />
        </div>

        <LineChart
          title="Life expectancy"
          subtitle={`${entity} — period life expectancy at birth, years`}
          points={inRange(series, fromYear)}
          unit="years"
          precision={1}
        />

        <LineChart
          title="Velocity"
          subtitle={`${entity} — life-expectancy years gained per calendar year (${SMOOTH_WINDOW}-year smoothed)`}
          points={inRange(v, fromYear)}
          unit="yr / yr"
          precision={2}
          threshold={{ value: LEV_THRESHOLD, label: 'Escape velocity' }}
          zeroLine
          yClamp={[-2, 2.4]}
        />

        <LineChart
          title="Acceleration"
          subtitle={`${entity} — change of that velocity per year (${SMOOTH_WINDOW}-year smoothed)`}
          points={inRange(a, fromYear)}
          unit="yr / yr²"
          precision={3}
          zeroLine
          yClamp={[-1.2, 1.2]}
        />

        <Frame title="Mission assessment" className="verdict">
          {lev && latest && peak ? (
            <>
              <p>
                <strong>{entity}</strong> gains life expectancy at{' '}
                <strong>
                  {lev.currentVelocity.toFixed(3)} years per year — {(lev.progress * 100).toFixed(1)}
                  % of escape velocity
                </strong>{' '}
                (a simplified proxy for “longevity escape velocity”: period life expectancy at birth
                rising one year per calendar year. De Grey’s original “actuarial escape velocity” is
                a different, stricter test — age-specific death rates falling about 10% a year, so
                that a living person’s remaining life expectancy grows. Escape velocity is a
                speculative hypothesis, not a demographic forecast.)
              </p>
              <p>
                Velocity peaked at <strong>{peak.value.toFixed(2)} yr / yr around {peak.year}</strong>
                . In single-country series such peaks are often rebounds after wars, famines or
                pandemics; globally, the fastest sustained gains came in the mid-20th century, as
                sanitation, public health, vaccines, antibiotics and malaria control cut infant and
                child deaths. The 30-year trend is currently{' '}
                <strong>
                  {lev.velocityTrend >= 0 ? 'positive' : 'negative'} (
                  {lev.velocityTrend >= 0 ? '+' : ''}
                  {lev.velocityTrend.toFixed(4)} yr / yr per year)
                </strong>
                .{' '}
                {lev.reached
                  ? 'Escape velocity is currently met — an extraordinary, likely transient, artifact of rebound years.'
                  : lev.etaYear
                    ? `If that trend simply continued, the threshold would be crossed around ${lev.etaYear} — but a positive trend in a country recovering from a crisis reflects a rebound, not acceleration toward escape velocity.`
                    : 'Extrapolated forward, that trend never crosses the threshold: on the current demographic trajectory, escape velocity is not being approached.'}{' '}
                The latest values are still depressed by the COVID-19 dip inside the{' '}
                {SMOOTH_WINDOW}-year window; the world gained about 0.25–0.33 years per year in
                2000–2019.
              </p>
              <p>
                Honest caveat: this instrument measures <strong>period life expectancy</strong> —
                the mortality of the present, not a forecast. Longevity escape velocity is a
                speculative hypothesis, not a scientific consensus, and no therapy is approved to
                slow or reverse human aging. As of 2026, senolytics, partial reprogramming and gene
                editing have only small, early-phase human studies, mostly on surrogate endpoints
                and with mixed results; none has shown a reduction in deaths from aging. Major
                forecasts (UN World Population Prospects 2024; Global Burden of Disease 2021) project
                world gains of roughly 0.15 years per year to 2050, and even the best-performing
                countries have gained only about 0.25 years per year since 1840 (Oeppen &amp; Vaupel
                2002; Vaupel et al. 2021). Any future breakthrough would register here only once it
                measurably cut death rates at scale. The gauge tells us where we are, not what is
                about to be invented.
              </p>
            </>
          ) : (
            <p>Not enough data to assess this entity.</p>
          )}
        </Frame>

        <DataTable
          entity={entity}
          series={inRange(series, fromYear)}
          velocity={inRange(v, fromYear)}
          acceleration={inRange(a, fromYear)}
        />

        <Frame title="Methodology" className="methodology">
          <ul>
            <li>
              <strong>Source:</strong>{' '}
              <a href={snapshot.sourceUrl} target="_blank" rel="noreferrer">
                {snapshot.source}
              </a>{' '}
              (UN World Population Prospects; long-run historical estimates via Our World in
              Data). Snapshot fetched {new Date(snapshot.fetchedAt).toISOString().slice(0, 10)};
              refreshed automatically on every deployment.
            </li>
            <li>
              <strong>Velocity</strong> v(t) = de/dt: the slope of an ordinary-least-squares fit
              over a trailing {SMOOTH_WINDOW}-year window, which absorbs single-year shocks (wars,
              pandemics) that make raw year-over-year differences unreadable.
            </li>
            <li>
              <strong>Acceleration</strong> a(t) = dv/dt: the same trailing-window slope applied
              to the velocity series.
            </li>
            <li>
              <strong>Escape velocity (proxy):</strong> v(t) ≥ {LEV_THRESHOLD} year of period life
              expectancy at birth per calendar year. This is a simplification of de Grey’s
              “actuarial escape velocity”, which requires age-specific death rates to fall about
              10% per year. The ETA linearly extrapolates the 30-year trend of the velocity;
              rebounds after wars, famines or pandemics can produce spurious ETAs. It is a
              trajectory readout, not a prophecy. The latest data year is {latestYear}.
            </li>
            <li>
              <strong>Limitation:</strong> period life expectancy summarizes current death rates.
              A true immortality probability would need cohort projections and age-specific
              mortality trends; biological-aging biomarkers (epigenetic clocks) are not yet
              validated as surrogate endpoints. This dashboard deliberately sticks to what is
              actually measured today.
            </li>
            <li>
              <strong>Evidence base:</strong> conclusions follow the agreement of independent teams
              from several countries rather than any single study —{' '}
              {EVIDENCE.map((ref, index) => (
                <span key={ref.doi}>
                  {index > 0 && '; '}
                  <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noreferrer">
                    {ref.label}
                  </a>
                </span>
              ))}
              . The full claim-by-claim review with 108 references lives in{' '}
              <a
                href="https://github.com/konard/immortality/blob/main/docs/case-studies/issue-7/science-verification.md"
                target="_blank"
                rel="noreferrer"
              >
                docs/case-studies/issue-7
              </a>
              .
            </li>
          </ul>
        </Frame>

        <footer className="site-footer">
          <p>
            Data: <a href="https://ourworldindata.org/life-expectancy">Our World in Data</a> ·
            Source code: <a href="https://github.com/konard/immortality">konard/immortality</a> · UI
            inspired by <a href="https://glitchy.website/">glitchy.website</a>,{' '}
            <a href="https://arwes.dev">Arwes</a> and{' '}
            <a href="https://github.com/educlopez/thegridcn-ui">thegridcn-ui</a>
          </p>
        </footer>
      </div>
      <SettingsPanel
        open={settingsOpen}
        settings={uiSettings}
        onChange={setUiSettings}
        onClose={closeSettings}
        onReset={() => {
          setUiSettings(DEFAULT_SETTINGS);
          sounds.select();
        }}
        onPlayIntro={() => {
          introReplayed.current = true;
          setSettingsOpen(false);
          setIntroVisible(true);
        }}
      />
      {introVisible && uiSettings.intro !== 'none' && (
        <Intro
          mode={uiSettings.intro}
          speed={uiSettings.animationSpeed}
          animate={motionAllowed(uiSettings)}
          onAnswer={(soundOn) => setUiSettings((current) => ({ ...current, sound: soundOn }))}
          onDone={() => {
            setIntroVisible(false);
            // Replayed from the (now closed) drawer: the trigger is gone, so land on its toggle.
            if (!introReplayed.current) return;
            introReplayed.current = false;
            requestAnimationFrame(() => settingsButtonRef.current?.focus());
          }}
        />
      )}
    </Shell>
  );
}
