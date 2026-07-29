import Link from "next/link";
import type { Post } from "@/lib/content";
import { getAuthor } from "@/lib/content";

export function PostCard({ post }: { post: Post }) {
  const author = getAuthor(post.author);

  return (
    <article className="card-lift flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm">
      {post.image && (
        <Link href={`/${post.slug}/`} className="block overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="aspect-[16/10] w-full object-cover transition duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h2 className="mb-2 font-sans text-lg font-bold leading-snug">
          <Link href={`/${post.slug}/`} className="text-black/85 no-underline hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-black/55">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 border-t border-black/5 pt-3 text-xs text-black/50">
          {author?.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.avatar}
              alt={author.display_name}
              className="h-7 w-7 rounded-full object-cover"
            />
          )}
          <div>
            {author && (
              <Link
                href={`/authors/#${post.author}`}
                className="font-medium text-black/70 no-underline hover:text-primary"
              >
                {author.display_name}
              </Link>
            )}
            <div>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
