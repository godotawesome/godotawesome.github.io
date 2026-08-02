import { Aads } from "@/components/Aads";
import { Pagination } from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getPaginatedPosts } from "@/lib/content";

export function HomeStories({ page }: { page: number }) {
  const { posts, totalPages, currentPage } = getPaginatedPosts(page);

  return (
    <section>
      <div className="section-title">
        <span>All Stories</span>
      </div>
      {page > 1 && (
        <>
          <p className="mb-6 text-center text-sm text-black/45">
            Page {currentPage} of {totalPages}
          </p>
          <Aads />
        </>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
