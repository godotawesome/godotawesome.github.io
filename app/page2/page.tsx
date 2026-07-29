import { HomeStories } from "@/components/HomeStories";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  description: "Page 2 of GodotAwesome stories",
  path: "/page2/",
});

export default function Page() {
  return (
    <div className="site-container">
      <HomeStories page={2} />
    </div>
  );
}
