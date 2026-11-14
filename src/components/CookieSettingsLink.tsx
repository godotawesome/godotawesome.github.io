"use client";

import { OPEN_SETTINGS_EVENT } from "./CookieConsent";

/** Footer link that opens the cookie settings panel rendered by CookieConsent. */
export function CookieSettingsLink({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
      className={`cursor-pointer bg-transparent p-0 ${className}`}
    >
      Cookie settings
    </button>
  );
}
