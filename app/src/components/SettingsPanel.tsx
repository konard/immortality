import { useEffect, useRef, useState } from 'react';
import {
  AXES,
  PRESETS,
  REFERENCES,
  SETTING_GROUPS,
  SOUND_EVENTS,
  SOUND_PRESETS,
  countCustomized,
  encodeShareHash,
  randomizeSettings,
  type Axis,
  type Preset,
  type ReferenceId,
  type SettingGroupId,
  type SoundEventId,
  type SoundPresetId,
  type UiSettings,
} from '../settings';
import { sounds } from '../sound';

interface SettingsPanelProps {
  open: boolean;
  settings: UiSettings;
  onChange: (next: UiSettings) => void;
  onClose: () => void;
  onReset: () => void;
  onPlayIntro?: () => void;
}

/** Comfort settings a preset never overrides. */
const applyPreset = (preset: Preset, current: UiSettings): UiSettings => ({
  ...preset.settings,
  animations: current.animations,
  volume: current.volume,
});

const isPresetActive = (preset: Preset, current: UiSettings) =>
  JSON.stringify(applyPreset(preset, current)) === JSON.stringify(current);

function SourceLinks({ sources }: { sources?: readonly ReferenceId[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <span className="axis-sources">
      {[...new Set(sources)].map((id) => (
        <a key={id} href={REFERENCES[id].url} target="_blank" rel="noreferrer">
          {REFERENCES[id].label} ↗
        </a>
      ))}
    </span>
  );
}

function AxisControl({
  axis,
  settings,
  onChange,
}: {
  axis: Axis;
  settings: UiSettings;
  onChange: (next: UiSettings) => void;
}) {
  const id = `axis-${axis.key}`;
  const set = (value: string | number | boolean) => onChange({ ...settings, [axis.key]: value });
  const value = settings[axis.key];

  if (axis.kind === 'toggle') {
    return (
      <div className="axis axis--toggle">
        <button
          type="button"
          className="switch-row"
          aria-pressed={value === true}
          onPointerEnter={() => sounds.hover()}
          onClick={() => {
            set(!value);
            sounds.click();
          }}
        >
          <span>
            {axis.label}
            {axis.description && <small>{axis.description}</small>}
          </span>
          <span className="switch" aria-hidden="true" />
        </button>
        <SourceLinks sources={axis.sources} />
      </div>
    );
  }

  if (axis.kind === 'range') {
    return (
      <div className="axis axis--range">
        <div className="axis-head">
          <label htmlFor={id}>{axis.label}</label>
          <output htmlFor={id}>
            {String(value)}
            {axis.unit}
          </output>
        </div>
        <input
          id={id}
          type="range"
          min={axis.min}
          max={axis.max}
          step={axis.step}
          value={Number(value)}
          onChange={(event) => set(Number(event.target.value))}
          onPointerUp={() => sounds.select()}
        />
        {axis.description && <p className="settings-note">{axis.description}</p>}
        <SourceLinks sources={axis.sources} />
      </div>
    );
  }

  const current = axis.options.find((option) => option.id === value);
  if (axis.display === 'buttons') {
    return (
      <fieldset className="axis axis--choice">
        <legend>{axis.label}</legend>
        <div className={axis.key === 'palette' ? 'palette-options' : 'choice-options'}>
          {axis.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="choice-button"
              aria-pressed={value === option.id}
              title={option.description}
              onPointerEnter={() => sounds.hover()}
              onClick={() => {
                set(option.id);
                sounds.click();
              }}
            >
              {axis.key === 'palette' && (
                <span
                  className={`palette-swatch palette-swatch--${option.id}`}
                  aria-hidden="true"
                />
              )}
              {option.label}
            </button>
          ))}
        </div>
        {current?.description && <p className="settings-note">{current.description}</p>}
        <SourceLinks sources={axis.sources} />
      </fieldset>
    );
  }

  return (
    <div className="axis axis--select">
      <label className="select-label" htmlFor={id}>
        {axis.label}
      </label>
      <select
        id={id}
        value={String(value)}
        onPointerEnter={() => sounds.hover()}
        onChange={(event) => {
          set(event.target.value);
          sounds.select();
        }}
      >
        {axis.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {current?.description && <p className="settings-note">{current.description}</p>}
      <SourceLinks
        sources={current?.source ? [current.source, ...(axis.sources ?? [])] : axis.sources}
      />
    </div>
  );
}

/**
 * Docked, non-modal settings drawer: the dashboard stays visible and interactive
 * next to it so every axis can be compared live.
 */
export function SettingsPanel({
  open,
  settings,
  onChange,
  onClose,
  onReset,
  onPlayIntro,
}: SettingsPanelProps) {
  const [group, setGroup] = useState<SettingGroupId>('color');
  const [shareStatus, setShareStatus] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!shareStatus) return;
    const timer = window.setTimeout(() => setShareStatus(''), 4000);
    return () => window.clearTimeout(timer);
  }, [shareStatus]);

  if (!open) return null;

  const customized = countCustomized(settings);

  const updateEffect = (event: SoundEventId, preset: SoundPresetId) => {
    onChange({ ...settings, effects: { ...settings.effects, [event]: preset } });
    sounds.preview(preset);
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}${encodeShareHash(settings)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Share link copied to the clipboard.');
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); expose the link in the URL instead.
      window.history.replaceState(null, '', url);
      setShareStatus('Clipboard unavailable — the share link is now in the address bar.');
    }
    sounds.select();
  };

  const tabId = (id: SettingGroupId) => `settings-tab-${id}`;
  const groupAxes = AXES.filter((axis) => axis.group === group);

  return (
    <aside
      className="frame settings-panel settings-drawer"
      role="dialog"
      aria-modal="false"
      aria-labelledby="settings-title"
    >
      <span className="corner" aria-hidden="true" />
      <header className="settings-header">
        <div>
          <p className="settings-eyebrow">Interface control</p>
          <h2 id="settings-title">Display &amp; audio settings</h2>
          <p className="settings-note" aria-live="polite">
            {customized === 0
              ? 'All axes at their defaults.'
              : `${customized} ${customized === 1 ? 'axis' : 'axes'} customized.`}
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          className="icon-button"
          aria-label="Close settings"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <section className="settings-presets" aria-labelledby="settings-presets-title">
        <h3 id="settings-presets-title">Presets</h3>
        <div className="preset-options">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="choice-button preset-button"
              aria-pressed={isPresetActive(preset, settings)}
              title={preset.description}
              onPointerEnter={() => sounds.hover()}
              onClick={() => {
                onChange(applyPreset(preset, settings));
                sounds.select();
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="settings-tools">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              onChange(randomizeSettings(settings));
              sounds.select();
            }}
          >
            ⚄ Randomize
          </button>
          <button type="button" className="secondary-button" onClick={share}>
            ⧉ Copy share link
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onReset}
            disabled={customized === 0}
          >
            Restore defaults
          </button>
        </div>
        <p className="settings-note settings-share-status" role="status">
          {shareStatus}
        </p>
      </section>

      <div className="settings-tabs" role="tablist" aria-label="Setting groups">
        {SETTING_GROUPS.map(({ id, label }) => (
          <button
            key={id}
            id={tabId(id)}
            type="button"
            role="tab"
            aria-selected={group === id}
            aria-controls="settings-tabpanel"
            tabIndex={group === id ? 0 : -1}
            onClick={() => {
              setGroup(id);
              sounds.click();
            }}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              const index = SETTING_GROUPS.findIndex((g) => g.id === group);
              const step = event.key === 'ArrowRight' ? 1 : -1;
              const next = SETTING_GROUPS[(index + step + SETTING_GROUPS.length) % SETTING_GROUPS.length];
              setGroup(next.id);
              document.getElementById(tabId(next.id))?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        id="settings-tabpanel"
        className="settings-grid"
        role="tabpanel"
        aria-labelledby={tabId(group)}
      >
        {groupAxes.map((axis) => (
          <AxisControl key={axis.key} axis={axis} settings={settings} onChange={onChange} />
        ))}

        {group === 'hud' && onPlayIntro && (
          <button
            type="button"
            className="secondary-button"
            disabled={settings.intro === 'none'}
            onClick={onPlayIntro}
          >
            ▶ Play intro now
          </button>
        )}

        {group === 'audio' && (
          <fieldset className="sound-map">
            <legend>Audio effect map</legend>
            <p className="settings-note">
              Every interaction can use a different synthesized cue. Sound starts after the first
              browser interaction.
            </p>
            {SOUND_EVENTS.map((soundEvent) => {
              const preset = SOUND_PRESETS.find(({ id }) => id === settings.effects[soundEvent.id])!;
              return (
                <div className="sound-row" key={soundEvent.id}>
                  <label htmlFor={`sound-${soundEvent.id}`}>{soundEvent.label}</label>
                  <select
                    id={`sound-${soundEvent.id}`}
                    value={preset.id}
                    disabled={!settings.sound}
                    onChange={(event) =>
                      updateEffect(soundEvent.id, event.target.value as SoundPresetId)
                    }
                  >
                    {SOUND_PRESETS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {preset.sourceUrl ? (
                    <a href={preset.sourceUrl} target="_blank" rel="noreferrer">
                      {preset.sourceLabel} ↗
                    </a>
                  ) : (
                    <span className="source-placeholder">No sound</span>
                  )}
                </div>
              );
            })}
          </fieldset>
        )}
      </div>

      <footer className="settings-actions">
        <button type="button" className="primary-button" onClick={onClose}>
          Done
        </button>
      </footer>
    </aside>
  );
}
