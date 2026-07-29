import { notFound } from "next/navigation";
import { getPageBySlug, renderMarkdown } from "@/lib/content";
import { pageMetadata } from "@/components/StaticMarkdownPage";

export const metadata = pageMetadata("about", "/about/");

export default async function AboutPage() {
  const page = getPageBySlug("about");
  if (!page) notFound();
  const html = await renderMarkdown(page.content);

  return (
    <div className="site-container max-w-2xl py-2">
      <h1 className="mb-6 font-sans text-3xl font-bold tracking-tight text-black/85">
        {page.title}
      </h1>
      <div className="article-post" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
