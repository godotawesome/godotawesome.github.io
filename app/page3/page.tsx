import { HomeStories } from "@/components/HomeStories";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  description: "Page 3 of GodotAwesome stories",
  path: "/page3/",
});

export default function Page() {
  return (
    <div className="site-container">
      <HomeStories page={3} />
    </div>
  );
}
