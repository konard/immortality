import { useEffect, useRef, useState } from 'react';
import { sounds } from '../sound';
import type { IntroId } from '../settings';

export const BOOT_LINES = [
  'BOOT  immortality-os v0.1 // lev monitor',
  'LINK  our world in data ........ OK',
  'CALC  velocity / acceleration .. OK',
  'SYNC  escape-velocity threshold  OK',
  'HUD   frames, charts, audio .... READY',
];

interface IntroProps {
  mode: Exclude<IntroId, 'none'>;
  /** Animation speed in percent; 200 halves every delay. */
  speed: number;
  /** Whether to animate; when false the sequence is shown complete. */
  animate: boolean;
  onDone: () => void;
  /** Transmission prompt answer: true enables audio, false mutes it. */
  onAnswer: (soundOn: boolean) => void;
}

/**
 * Opening sequences. "boot" types a short system log (thegridcn terminal); "transmission"
 * recreates glitchy.website's "Intercept incoming transmission?" gate, which doubles as
 * the user gesture browsers require before audio can start.
 */
export function Intro({ mode, speed, animate, onDone, onAnswer }: IntroProps) {
  const scale = 100 / Math.max(25, speed);
  const [step, setStep] = useState(animate ? 0 : BOOT_LINES.length);
  const [ready, setReady] = useState(!animate);
  const [leaving, setLeaving] = useState(false);
  const yesRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const leavingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const finishTimer = useRef<number>();

  // Idempotent: timers, clicks and key presses may all race to close the intro.
  const finish = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    finishTimer.current = window.setTimeout(() => doneRef.current(), animate ? 260 * scale : 0);
  };

  // A real modal: everything behind the intro is inert until it closes, then focus
  // returns to where it was (when that element still exists).
  useEffect(() => {
    const previous = document.activeElement;
    const root = rootRef.current;
    const siblings = root?.parentElement
      ? Array.from(root.parentElement.children).filter(
          (element): element is HTMLElement =>
            element !== root && element instanceof HTMLElement && !element.inert
        )
      : [];
    for (const element of siblings) element.inert = true;
    root?.focus();
    return () => {
      window.clearTimeout(finishTimer.current);
      for (const element of siblings) element.inert = false;
      if (previous instanceof HTMLElement && previous !== document.body && previous.isConnected) {
        previous.focus();
      }
    };
  }, []);

  useEffect(() => {
    if (mode === 'boot') {
      if (step < BOOT_LINES.length) {
        const timer = window.setTimeout(() => setStep((s) => s + 1), 360 * scale);
        return () => window.clearTimeout(timer);
      }
      const timer = window.setTimeout(finish, 600 * scale);
      return () => window.clearTimeout(timer);
    }
    if (!ready) {
      const timer = window.setTimeout(() => setReady(true), 1100 * scale);
      return () => window.clearTimeout(timer);
    }
    yesRef.current?.focus();
    return undefined;
  }, [mode, step, ready, scale]);

  useEffect(() => {
    if (mode !== 'boot') return;
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [mode]);

  const answer = (soundOn: boolean) => {
    onAnswer(soundOn);
    if (soundOn) {
      sounds.setEnabled(true);
      sounds.intro();
    }
    finish();
  };

  const progress = Math.round((Math.min(step, BOOT_LINES.length) / BOOT_LINES.length) * 100);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={`intro intro--${mode}${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'boot' ? 'System boot' : 'Incoming transmission'}
      onClick={mode === 'boot' ? finish : undefined}
    >
      {mode === 'boot' ? (
        <div className="intro-panel intro-boot">
          <pre className="intro-log" aria-live="polite">
            {BOOT_LINES.slice(0, step).join('\n')}
            <span className="intro-caret" aria-hidden="true" />
          </pre>
          <div
            className="intro-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="intro-hint">Click or press any key to skip</p>
        </div>
      ) : (
        <div className="intro-panel intro-transmission">
          {!ready ? (
            <p className="intro-status" aria-live="polite">
              Initializing Human Interface<span className="intro-ellipsis" aria-hidden="true" />
            </p>
          ) : (
            <>
              <p className="intro-greeting">Willkommen.</p>
              <p className="intro-question">Intercept incoming transmission?</p>
              <div className="intro-actions">
                <button ref={yesRef} type="button" className="primary-button" onClick={() => answer(true)}>
                  Yes — with sound
                </button>
                <button type="button" className="secondary-button" onClick={() => answer(false)}>
                  No — silent
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
