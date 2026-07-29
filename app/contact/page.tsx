import { StaticMarkdownPage, pageMetadata } from "@/components/StaticMarkdownPage";

export const metadata = pageMetadata("contact", "/contact/");

export default function ContactPage() {
  return <StaticMarkdownPage slug="contact" path="/contact/" />;
}
