import type { Metadata } from "next";
import "@/styles/globals.css";
import { AadsSticky } from "@/components/AadsSticky";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@/components/Analytics";
import { getAllCategories, getAllTags } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: SITE.logo, type: "image/png" }],
  },
  other: {
    "google-adsense-account": "ca-pub-8385867136303768",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getAllCategories().map((c) => ({
    name: c.name,
    slug: c.slug,
    count: c.posts.length,
  }));
  const tags = getAllTags().map((t) => ({
    name: t.name,
    slug: t.slug,
    count: t.posts.length,
  }));

  return (
    <html lang="en">
      <body>
        <Header categories={categories} tags={tags} />
        <main className="site-content min-h-[60vh] pt-6">{children}</main>
        <Footer />
        <AadsSticky />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
