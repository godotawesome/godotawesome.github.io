import { HomeStories } from "@/components/HomeStories";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Home",
  description: "Page 5 of GodotAwesome stories",
  path: "/page5/",
});

export default function Page() {
  return (
    <div className="site-container">
      <HomeStories page={5} />
    </div>
  );
}
