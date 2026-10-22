import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  AXES,
  PRESETS,
  REFERENCES,
  SETTING_GROUPS,
  MAX_SOUNDS_PER_EVENT,
  SOUND_EVENTS,
  SOUNDS,
  applyPreset,
  countCustomized,
  encodeShareHash,
  isPresetActive,
  randomizeSettings,
  type Axis,
  type ReferenceId,
  type SettingGroupId,
  type SoundEventId,
  type SoundId,
  type UiSettings,
} from '../settings';
import { sounds } from '../sound';
import { Select } from './Select';

const SOUND_BY_ID = Object.fromEntries(SOUNDS.map((sound) => [sound.id, sound])) as Record<
  SoundId,
  (typeof SOUNDS)[number]
>;

interface SettingsPanelProps {
  open: boolean;
  settings: UiSettings;
  onChange: (next: UiSettings) => void;
  onClose: () => void;
  onReset: () => void;
  onPlayIntro?: () => void;
}

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
            sounds.toggle();
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
          style={
            {
              '--fill': `${((Number(value) - axis.min) / (axis.max - axis.min)) * 100}%`,
            } as CSSProperties
          }
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
        <div
          className={
            axis.key === 'palette' || axis.key === 'surface' ? 'palette-options' : 'choice-options'
          }
        >
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
                sounds.select();
              }}
            >
              {axis.key === 'palette' && (
                <span
                  className={`palette-swatch palette-swatch--${option.id}`}
                  aria-hidden="true"
                />
              )}
              {axis.key === 'surface' && (
                <span className="material-swatch" data-material={option.id} aria-hidden="true" />
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
      <Select
        id={id}
        value={String(value)}
        options={axis.options}
        onChange={(next) => set(next)}
      />
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

  const setEffect = (event: SoundEventId, list: readonly SoundId[]) =>
    onChange({ ...settings, effects: { ...settings.effects, [event]: list } });

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}${encodeShareHash(settings)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Share link copied to the clipboard.');
      sounds.notify();
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); expose the link in the URL instead.
      window.history.replaceState(null, '', url);
      setShareStatus('Clipboard unavailable — the share link is now in the address bar.');
      sounds.notify();
    }
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
      <span className="frame-material" aria-hidden="true" />
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
          onPointerEnter={() => sounds.hover()}
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
              sounds.click();
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
              sounds.select();
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
              Map up to {MAX_SOUNDS_PER_EVENT} sounds to every interaction; the playback mode
              above decides whether they rotate, randomize or layer. Sound starts after the first
              browser interaction.
            </p>
            {SOUND_EVENTS.map((soundEvent) => {
              const list = settings.effects[soundEvent.id];
              const available = SOUNDS.filter((sound) => !list.includes(sound.id));
              const full = list.length >= MAX_SOUNDS_PER_EVENT;
              return (
                <div className="sound-row" key={soundEvent.id}>
                  <span className="sound-row-label" id={`sound-${soundEvent.id}-label`}>
                    {soundEvent.label}
                  </span>
                  <ul className="sound-chips" aria-labelledby={`sound-${soundEvent.id}-label`}>
                    {list.length === 0 && <li className="sound-chip sound-chip--empty">Silent</li>}
                    {list.map((soundId) => (
                      <li className="sound-chip" key={soundId}>
                        <button
                          type="button"
                          className="sound-chip-play"
                          title={SOUND_BY_ID[soundId].character}
                          aria-label={`Preview ${SOUND_BY_ID[soundId].label}`}
                          disabled={!settings.sound}
                          onClick={() => sounds.preview(soundId)}
                        >
                          ▶ {SOUND_BY_ID[soundId].label}
                        </button>
                        <button
                          type="button"
                          className="sound-chip-remove"
                          aria-label={`Remove ${SOUND_BY_ID[soundId].label} from ${soundEvent.label}`}
                          onClick={() => {
                            setEffect(
                              soundEvent.id,
                              list.filter((id) => id !== soundId),
                            );
                            sounds.close();
                          }}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  <Select
                    className="sound-add"
                    ariaLabel={`Add a sound to ${soundEvent.label}`}
                    value=""
                    placeholder={full ? `Maximum ${MAX_SOUNDS_PER_EVENT} sounds` : '+ Add sound'}
                    disabled={!settings.sound || full}
                    options={available.map((sound) => ({
                      id: sound.id,
                      label: sound.label,
                      description: sound.character,
                    }))}
                    onChange={(soundId) => {
                      setEffect(soundEvent.id, [...list, soundId]);
                      sounds.preview(soundId);
                    }}
                  />
                </div>
              );
            })}
          </fieldset>
        )}

        {group === 'audio' && (
          <fieldset className="sound-library">
            <legend>Sound library</legend>
            <p className="settings-note">
              Every sound is synthesized in the browser with the Web Audio API (oscillators, FM,
              filtered noise and a convolution room) after the cited references.
            </p>
            <ul>
              {SOUNDS.map((sound) => (
                <li key={sound.id}>
                  <button
                    type="button"
                    className="sound-chip-play"
                    aria-label={`Preview ${sound.label}`}
                    disabled={!settings.sound}
                    onPointerEnter={() => sounds.hover()}
                    onClick={() => sounds.preview(sound.id)}
                  >
                    ▶
                  </button>
                  <span className="sound-library-name">{sound.label}</span>
                  <span className="sound-library-character">{sound.character}</span>
                  <a href={sound.sourceUrl} target="_blank" rel="noreferrer">
                    {sound.sourceLabel} ↗
                  </a>
                </li>
              ))}
            </ul>
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
