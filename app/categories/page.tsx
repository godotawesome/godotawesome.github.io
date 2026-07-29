import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getAllCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Categories",
  path: "/categories/",
});

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="site-container">
      <div className="section-title">
        <span>Categories</span>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}/`} className="tag-pill no-underline">
            {c.name} ({c.posts.length})
          </Link>
        ))}
      </div>
      {categories.map((category) => (
        <section key={category.slug} className="mb-12">
          <h2
            id={category.slug}
            className="mb-4 scroll-mt-24 font-sans text-2xl font-bold text-black/85"
          >
            Category <span className="text-primary">{category.name}</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
