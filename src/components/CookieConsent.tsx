"use client";

import { useEffect, useState } from "react";

export type ConsentState = {
  analytics: boolean;
  advertising: boolean;
  timestamp: number;
};

const STORAGE_KEY = "godotawesome_cookie_consent";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(state))};path=/;max-age=31536000;SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("consent-updated", { detail: state }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setVisible(true);
  }, []);

  const acceptAll = () => {
    writeConsent({ analytics: true, advertising: true, timestamp: Date.now() });
    setVisible(false);
    setSettingsOpen(false);
  };

  const rejectOptional = () => {
    writeConsent({ analytics: false, advertising: false, timestamp: Date.now() });
    setVisible(false);
    setSettingsOpen(false);
  };

  const saveSettings = () => {
    writeConsent({ analytics, advertising, timestamp: Date.now() });
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible && !settingsOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          const c = readConsent();
          setAnalytics(c?.analytics ?? false);
          setAdvertising(c?.advertising ?? false);
          setSettingsOpen(true);
        }}
        className="fixed bottom-4 left-4 z-50 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium shadow-md"
      >
        Cookie Settings
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="site-container">
        {!settingsOpen ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm text-black/70">
              We use privacy-friendly Umami analytics without cookies. Ads may show as
              non-personalized by default; opt in for personalized ads. Google Analytics and
              Microsoft Clarity load only if you accept Analytics.{" "}
              <a href="/cookie-policy/" className="underline">
                Cookie Policy
              </a>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const c = readConsent();
                  setAnalytics(c?.analytics ?? false);
                  setAdvertising(c?.advertising ?? false);
                  setSettingsOpen(true);
                }}
                className="rounded border border-black/15 px-3 py-2 text-sm"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={rejectOptional}
                className="rounded border border-black/15 px-3 py-2 text-sm"
              >
                Reject optional
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-sans text-base font-bold">Cookie settings</h2>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <strong>Necessary</strong> — required for basic site function. Always on.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Analytics</strong> — Google Analytics and Microsoft Clarity (optional).
                Umami runs without cookies regardless of this setting.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={advertising}
                onChange={(e) => setAdvertising(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Advertising</strong> — allow personalized Google AdSense ads (optional).
                Non-personalized ads may still show when AdSense is enabled.
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen(false);
                  if (readConsent()) setVisible(false);
                }}
                className="rounded border border-black/15 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="rounded bg-primary px-3 py-2 text-sm font-medium text-white"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
