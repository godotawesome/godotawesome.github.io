import { StaticMarkdownPage, pageMetadata } from "@/components/StaticMarkdownPage";

export const metadata = pageMetadata("about", "/about/");

export default function AboutPage() {
  return <StaticMarkdownPage slug="about" path="/about/" />;
}
