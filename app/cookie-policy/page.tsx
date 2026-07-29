import { StaticMarkdownPage, pageMetadata } from "@/components/StaticMarkdownPage";

export const metadata = pageMetadata("cookie-policy", "/cookie-policy/");

export default function CookiePolicyPage() {
  return <StaticMarkdownPage slug="cookie-policy" path="/cookie-policy/" />;
}
