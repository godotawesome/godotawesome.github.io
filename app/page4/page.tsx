import { HomeStories } from "@/components/HomeStories";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  description: "Page 4 of GodotAwesome stories",
  path: "/page4/",
});

export default function Page() {
  return (
    <div className="site-container">
      <HomeStories page={4} />
    </div>
  );
}
