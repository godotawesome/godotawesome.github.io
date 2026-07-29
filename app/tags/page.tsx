import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getAllTags } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tags",
  path: "/tags/",
});

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="site-container">
      <div className="section-title">
        <span>Tags</span>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((t) => (
          <a key={t.slug} href={`#${t.slug}`} className="tag-pill no-underline">
            #{t.name} ({t.posts.length})
          </a>
        ))}
      </div>
      {tags.map((tag) => (
        <section key={tag.slug} className="mb-12">
          <h2
            id={tag.slug}
            className="mb-4 scroll-mt-24 font-sans text-2xl font-bold text-black/85"
          >
            Tag <span className="text-primary">{tag.name}</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tag.posts.map((post) => (
              <PostCard key={`${tag.slug}-${post.slug}`} post={post} />
            ))}
          </div>
        </section>
      ))}
      <p className="text-center text-sm text-black/45">
        Looking for categories?{" "}
        <Link href="/categories/" className="underline">
          Browse categories
        </Link>
      </p>
    </div>
  );
}
