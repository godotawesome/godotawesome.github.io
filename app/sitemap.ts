import type { MetadataRoute } from "next";
import {
  getAllCategories,
  getAllPosts,
  getPaginatedPosts,
} from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const { totalPages } = getPaginatedPosts(1);
  const categories = getAllCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/about/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/categories/`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/tags/`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/authors/`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/privacy-policy/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/cookie-policy/`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const pagination: MetadataRoute.Sitemap = [];
  for (let i = 2; i <= totalPages; i += 1) {
    pagination.push({
      url: `${SITE.url}/page${i}/`,
      changeFrequency: "daily",
      priority: 0.5,
    });
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/${p.slug}/`,
    lastModified: p.updated ?? p.date,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE.url}/category/${c.slug}/`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...pagination, ...postEntries, ...categoryEntries];
}
