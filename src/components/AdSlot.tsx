/**
 * DORMANT ad component. Not mounted anywhere while ads are off.
 *
 * Before re-enabling:
 * 1. Update content/pages/privacy-policy.md + cookie-policy.md
 * 2. Restore Advertising toggle in CookieConsent.tsx
 * 3. Uncomment google-adsense-account meta in app/layout.tsx
 * 4. Uncomment SITE ad fields in src/lib/site.ts
 * 5. Set ADSENSE_LIVE = true and restore the implementation below
 * 6. Mount this component in app/[slug]/page.tsx (and home if needed)
 */

type Props = {
  slot: string;
  format?: string;
  className?: string;
};

// Ads are off site-wide. Do not set to true without the policy checklist above.
const ADSENSE_LIVE = false;

export function AdSlot(_props: Props) {
  if (!ADSENSE_LIVE) return null;
  return null;
}

/*
 * Previous live implementation (restore when ads return):
 *
 * "use client";
 * import { useEffect, useRef, useState } from "react";
 * import { SITE } from "@/lib/site";
 * import { readConsent, type ConsentState } from "./CookieConsent";
 *
 * Model B: ads render when SITE.adsenseEnabled.
 * - No advertising consent → non-personalized ads (NPA)
 * - Advertising consent → personalized ads
 *
 * ensureAdSenseScript(client) loads pagead2.googlesyndication.com
 * Uses window.adsbygoogle push + requestNonPersonalizedAds
 * Reloads page if consent personalization mode changes after a push
 */
