import { StaticMarkdownPage, pageMetadata } from "@/components/StaticMarkdownPage";

export const metadata = pageMetadata("privacy-policy", "/privacy-policy/");

export default function PrivacyPolicyPage() {
  return <StaticMarkdownPage slug="privacy-policy" path="/privacy-policy/" />;
}
