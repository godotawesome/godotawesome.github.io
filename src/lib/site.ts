export const SITE = {
  name: "GodotAwesome",
  title: "GodotAwesome",
  description:
    "Your place for Godot Engine content: tutorials, projects, and community insights for indie developers and open-source creators.",
  url: "https://godotawesome.com",
  legalName: "MgonnacrushT Limited",
  companyUrl: "https://mgonnacrusht.co.uk",
  contactEmail: "godotawesome@mgonnacrusht.co.uk",
  helloEmail: "hello@mgonnacrusht.co.uk",
  legalEmail: "legal@mgonnacrusht.co.uk",
  logo: "/assets/images/logo.png",
  postsPerPage: 6,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "G-BH9P4LY6E7",
  microsoftClarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "t4k6d20q9f",
  umamiScriptUrl:
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js",
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "",
  // ---------------------------------------------------------------------------
  // Ads: OFF. Do not enable via a casual env flip.
  // Before turning ads on again:
  //   1. Update content/pages/privacy-policy.md + cookie-policy.md
  //   2. Restore Advertising consent in CookieConsent.tsx
  //   3. Uncomment google-adsense-account meta in app/layout.tsx
  //   4. Uncomment AdSlot placements (see app/[slug]/page.tsx)
  //   5. Uncomment the block below and wire AdSlot / SITE fields
  // ---------------------------------------------------------------------------
  // aadsEnabled: process.env.NEXT_PUBLIC_AADS_ENABLED !== "false",
  // aadsUnitId: process.env.NEXT_PUBLIC_AADS_UNIT_ID ?? "2450355",
  // adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-8385867136303768",
  // adsenseSlotUnderImage: process.env.NEXT_PUBLIC_ADSENSE_SLOT_UNDER_IMAGE ?? "",
  // adsenseSlotMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID ?? "",
  // adsenseSlotEnd: process.env.NEXT_PUBLIC_ADSENSE_SLOT_END ?? "",
  // adsenseEnabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true",
} as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}
