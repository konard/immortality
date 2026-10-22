import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS, type UiSettings } from './settings';

/** Current interface settings, for components whose markup (not just CSS) varies. */
export const UiSettingsContext = createContext<UiSettings>(DEFAULT_SETTINGS);

export const useUiSettings = (): UiSettings => useContext(UiSettingsContext);

/** True when motion is allowed by both the user setting and the OS preference. */
export function motionAllowed(settings: UiSettings): boolean {
  if (!settings.animations) return false;
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
