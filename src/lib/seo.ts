import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

type BuildMetaInput = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: BuildMetaInput): Metadata {
  const desc = description || SITE.description;
  const url = absoluteUrl(path);
  const ogImage = image || absoluteUrl(SITE.logo);

  return {
    // app/layout.tsx adds the "| GodotAwesome" suffix through its title template,
    // but that template does not apply to the root page itself.
    title: path === "/" ? { absolute: title === SITE.title ? title : `${title} | ${SITE.name}` } : title,
    description: desc,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE.title,
      type,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}
