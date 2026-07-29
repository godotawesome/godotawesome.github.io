import { FeaturedCard } from "@/components/FeaturedCard";
import { HomeStories } from "@/components/HomeStories";
import { getFeaturedPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  path: "/",
});

export default function HomePage() {
  const featured = getFeaturedPosts();

  return (
    <div className="site-container">
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="section-title">
            <span>Featured</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((post) => (
              <FeaturedCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
      <HomeStories page={1} />
    </div>
  );
}
