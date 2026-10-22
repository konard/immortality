import { useEffect, useState } from 'react';
import { useUiSettings } from '../uiContext';

const pad = (n: number) => String(n).padStart(2, '0');
const utcClock = (date: Date) =>
  `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;

interface HudBarProps {
  entity: string;
  year?: number;
}

/** thegridcn-style status rail: system name, sector readout and a live UTC clock. */
export function HudBar({ entity, year }: HudBarProps) {
  const settings = useUiSettings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!settings.statusBar) return;
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [settings.statusBar]);

  if (!settings.statusBar) return null;

  return (
    <div className="hud-bar" role="status" aria-label="System status">
      <span className="hud-bar-cell hud-bar-system">IMMORTALITY // LEV MONITOR</span>
      <span className="hud-bar-cell">
        <span className="hud-bar-dot" aria-hidden="true" />
        SECTOR {entity.toUpperCase()} // ONLINE
      </span>
      {year ? <span className="hud-bar-cell hud-bar-optional">DATA {year}</span> : null}
      <span className="hud-bar-cell hud-bar-clock" aria-hidden="true">
        {utcClock(now)}
      </span>
    </div>
  );
}
