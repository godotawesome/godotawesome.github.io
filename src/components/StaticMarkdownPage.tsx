import { notFound } from "next/navigation";
import { getPageBySlug, renderMarkdown } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

type Props = {
  slug: string;
  path: string;
};

export function pageMetadata(slug: string, path: string) {
  const page = getPageBySlug(slug);
  return buildMetadata({
    title: page?.title ?? slug,
    description: page?.description,
    path,
  });
}

export async function StaticMarkdownPage({ slug, path }: Props) {
  const page = getPageBySlug(slug);
  if (!page) notFound();
  const html = await renderMarkdown(page.content);

  return (
    <div className="site-container max-w-3xl">
      <div className="section-title">
        <span>{page.title}</span>
      </div>
      <div className="article-post" dangerouslySetInnerHTML={{ __html: html }} />
      <p className="mt-8 text-sm text-black/40">
        <a href={path} className="sr-only">
          Canonical
        </a>
      </p>
    </div>
  );
}
