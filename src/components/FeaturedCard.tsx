import Link from "next/link";
import type { Post } from "@/lib/content";
import { CoverImage } from "@/components/CoverImage";

export function FeaturedCard({ post }: { post: Post }) {
  return (
    <article className="card-lift overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm md:col-span-2">
      <div className="grid md:grid-cols-2">
        {post.image && (
          <Link href={`/${post.slug}/`} className="block overflow-hidden">
            <CoverImage src={post.image} alt={post.title} lazy={false} />
          </Link>
        )}
        <div className="flex flex-col justify-center p-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Featured</p>
          <h2 className="mb-3 font-sans text-2xl font-bold leading-tight">
            <Link href={`/${post.slug}/`} className="text-black/85 no-underline hover:text-primary">
              {post.title}
            </Link>
          </h2>
          <p className="text-sm leading-relaxed text-black/55">{post.excerpt}</p>
        </div>
      </div>
    </article>
  );
}
