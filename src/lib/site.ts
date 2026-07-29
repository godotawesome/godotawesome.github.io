export const SITE = {
  name: "GodotAwesome",
  title: "GodotAwesome",
  description:
    "Your place for Godot Engine content: tutorials, projects, and community insights for indie developers and open-source creators.",
  url: "https://godotawesome.com",
  contactEmail: "godotawesome@gmail.com",
  logo: "/assets/images/logo.png",
  postsPerPage: 6,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "G-BH9P4LY6E7",
  microsoftClarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "t4k6d20q9f",
  umamiScriptUrl:
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js",
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  adsenseSlotUnderImage: process.env.NEXT_PUBLIC_ADSENSE_SLOT_UNDER_IMAGE ?? "",
  adsenseSlotMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID ?? "",
  adsenseSlotEnd: process.env.NEXT_PUBLIC_ADSENSE_SLOT_END ?? "",
  adsenseEnabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true",
} as const;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}
