"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";
import { readConsent, type ConsentState } from "./CookieConsent";

type Props = {
  slot: string;
  format?: string;
  className?: string;
};

type AdsByGoogle = unknown[] & {
  requestNonPersonalizedAds?: number;
  push: (...args: unknown[]) => number;
};

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogle;
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

function getAdsByGoogle(): AdsByGoogle {
  const existing = window.adsbygoogle;
  if (existing) return existing;
  const created = [] as unknown as AdsByGoogle;
  window.adsbygoogle = created;
  return created;
}

/**
 * Model B: ads always render when AdSense is enabled.
 * - No advertising consent → non-personalized ads (NPA)
 * - Advertising consent → personalized ads
 */
export function AdSlot({ slot, format = "auto", className = "" }: Props) {
  const pushed = useRef(false);
  const lastPersonalized = useRef<boolean | null>(null);
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const handler = (e: Event) => setConsent((e as CustomEvent<ConsentState>).detail);
    window.addEventListener("consent-updated", handler);
    return () => window.removeEventListener("consent-updated", handler);
  }, []);

  const personalized = consent?.advertising === true;

  useEffect(() => {
    if (!ready) return;
    if (!SITE.adsenseEnabled || !SITE.adsenseClient || !slot) return;

    ensureAdSenseScript(SITE.adsenseClient);
    const ads = getAdsByGoogle();
    ads.requestNonPersonalizedAds = personalized ? 0 : 1;

    // Consent changed after an ad was already requested — reload so AdSense can switch mode.
    if (
      pushed.current &&
      lastPersonalized.current !== null &&
      lastPersonalized.current !== personalized
    ) {
      window.location.reload();
      return;
    }

    lastPersonalized.current = personalized;

    if (pushed.current) return;
    try {
      ads.push({});
      pushed.current = true;
    } catch {
      // ignore
    }
  }, [ready, consent, personalized, slot]);

  if (!SITE.adsenseEnabled || !SITE.adsenseClient || !slot) {
    return null;
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
