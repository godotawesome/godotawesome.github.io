import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getAllCategories, getCategoryBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: `Archive of posts with category '${category.name}'`,
    description: `Posts in the ${category.name} category on GodotAwesome`,
    path: `/category/${category.slug}/`,
  });
}

export default async function CategoryArchivePage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="site-container">
      <section>
        <div className="section-title">
          <span>
            Archive of posts with category &apos;{category.name}&apos;
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
