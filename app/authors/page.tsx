import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getAuthors, getPostsByAuthor } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Authors",
  path: "/authors/",
});

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <div className="site-container">
      <div className="section-title">
        <span>Authors</span>
      </div>
      {Object.entries(authors).map(([id, author]) => {
        const posts = getPostsByAuthor(id);
        return (
          <section key={id} id={id} className="mb-14 scroll-mt-24">
            <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {author.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatar}
                  alt={author.display_name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
              <div className="text-center sm:text-left">
                <h2 className="font-sans text-2xl font-bold text-black/85">
                  Author {author.display_name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-black/55">{author.description}</p>
                {author.web && (
                  <a
                    href={author.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-black/45">
              Posts by {author.display_name}:
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            {posts.length === 0 && (
              <p className="text-sm text-black/45">
                No published posts yet.{" "}
                <Link href="/" className="underline">
                  Back home
                </Link>
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
