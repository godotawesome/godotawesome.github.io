"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { readConsent, type ConsentState } from "./CookieConsent";

type Props = {
  slot: string;
  format?: string;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function ensureAdSenseScript(client: string) {
  if (document.querySelector(`script[data-ad-client="${client}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  script.crossOrigin = "anonymous";
  script.dataset.adClient = client;
  document.head.appendChild(script);
}

export function AdSlot({ slot, format = "auto", className = "" }: Props) {
  const pushed = useRef(false);
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const handler = (e: Event) => setConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener("consent-updated", handler);
    return () => window.removeEventListener("consent-updated", handler);
  }, []);

  useEffect(() => {
    if (!SITE.adsenseEnabled || !SITE.adsenseClient || !slot) return;
    if (!consent?.advertising) return;
    ensureAdSenseScript(SITE.adsenseClient);
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // ignore
    }
  }, [consent, slot]);

  if (!SITE.adsenseEnabled || !SITE.adsenseClient || !slot) {
    return null;
  }

  if (!consent?.advertising) {
    return (
      <div className={`ad-slot ${className}`} aria-hidden="true">
        <span className="text-xs text-black/30">Ad placeholder (consent required)</span>
      </div>
    );
  }

  return (
    <div className={`ad-slot ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={SITE.adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
