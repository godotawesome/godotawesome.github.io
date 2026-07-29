"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { readConsent, type ConsentState } from "./CookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function loadGtag(id: string) {
  if (window.gtag) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

function loadClarity(id: string) {
  if (window.clarity) return;
  (function (c: Window, l: Document, a: string, r: string, i: string) {
    // @ts-expect-error clarity bootstrap
    c[a] =
      // @ts-expect-error clarity bootstrap
      c[a] ||
      function (...args: unknown[]) {
        // @ts-expect-error clarity bootstrap
        (c[a].q = c[a].q || []).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = `https://www.clarity.ms/tag/${i}`;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}

export function Analytics() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      setConsent(detail);
    };
    window.addEventListener("consent-updated", handler);
    return () => window.removeEventListener("consent-updated", handler);
  }, []);

  useEffect(() => {
    if (!consent?.analytics) return;
    if (SITE.googleAnalyticsId) loadGtag(SITE.googleAnalyticsId);
    if (SITE.microsoftClarityId) loadClarity(SITE.microsoftClarityId);
  }, [consent]);

  return (
    <>
      {SITE.umamiWebsiteId ? (
        <Script
          defer
          src={SITE.umamiScriptUrl}
          data-website-id={SITE.umamiWebsiteId}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
