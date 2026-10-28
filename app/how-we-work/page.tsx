import { StaticMarkdownPage, pageMetadata } from "@/components/StaticMarkdownPage";

export const metadata = pageMetadata("how-we-work", "/how-we-work/");

export default function HowWeWorkPage() {
  return <StaticMarkdownPage slug="how-we-work" path="/how-we-work/" />;
}
