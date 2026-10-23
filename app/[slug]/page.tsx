import Link from "next/link";
import { notFound } from "next/navigation";
// Ads off. Before remounting AdSlot: update privacy-policy.md + cookie-policy.md,
// CookieConsent Advertising toggle, layout meta, and SITE ad fields in site.ts.
// import { AdSlot } from "@/components/AdSlot";
import { Share } from "@/components/Share";
import {
  getAdjacentPosts,
  getAllPosts,
  getAuthor,
  getPostBySlug,
  renderMarkdown,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { slugify } from "@/lib/slugify";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/${post.slug}/`,
    image: post.image,
    type: "article",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const { prev, next } = getAdjacentPosts(slug);
  const html = await renderMarkdown(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    description: post.description,
    image: post.image ? [post.image] : undefined,
    author: author
      ? { "@type": "Person", name: author.display_name }
      : undefined,
    mainEntityOfPage: absoluteUrl(`/${post.slug}/`),
  };

  return (
    <article className="site-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-8 md:grid-cols-[140px_1fr]">
        <div className="hidden md:block">
          <Share title={post.title} url={absoluteUrl(`/${post.slug}/`)} />
        </div>

        <div className="min-w-0">
          {author && (
            <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              {author.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatar}
                  alt={author.display_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div className="text-center sm:text-left">
                <Link
                  href={`/authors/#${post.author}`}
                  className="font-semibold text-black/80 no-underline hover:text-primary"
                >
                  {author.display_name}
                </Link>
                <p className="mt-1 text-sm text-black/50">{author.description}</p>
              </div>
            </div>
          )}

          <h1 className="mb-6 font-sans text-3xl font-bold leading-tight text-black/90 md:text-4xl">
            {post.title}
          </h1>

          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={post.title}
              className="mb-2 w-full rounded-lg object-cover"
            />
          )}

          {/* Ads off: <AdSlot slot={SITE.adsenseSlotUnderImage} /> */}

          <div className="md:hidden mb-6">
            <Share title={post.title} url={absoluteUrl(`/${post.slug}/`)} />
          </div>

          <div
            className="article-post"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Ads off: mid + end AdSlot placements */}

          <p className="mt-8 text-sm text-black/50">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            {post.updated && post.updated !== post.date && (
              <>
                {" "}
                · Updated{" "}
                <time dateTime={post.updated}>
                  {new Date(post.updated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </>
            )}
          </p>

          {post.categories.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {[...post.categories].sort().map((cat) => (
                <li key={cat}>
                  <Link href={`/category/${slugify(cat)}/`} className="tag-pill no-underline">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {post.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {[...post.tags].sort().map((tag) => (
                <li key={tag}>
                  <Link href={`/tags/#${slugify(tag)}`} className="tag-pill no-underline">
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 flex flex-col justify-between gap-4 border-t border-black/10 pt-6 font-semibold sm:flex-row">
            {prev ? (
              <Link href={`/${prev.slug}/`} className="text-sm no-underline hover:text-primary">
                « {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/${next.slug}/`}
                className="text-sm no-underline hover:text-primary sm:text-right"
              >
                {next.title} »
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
