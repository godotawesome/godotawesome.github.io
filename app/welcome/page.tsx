import { StaticMarkdownPage, pageMetadata } from "@/components/StaticMarkdownPage";

export const metadata = pageMetadata("welcome", "/welcome/");

export default function WelcomePage() {
  return <StaticMarkdownPage slug="welcome" path="/welcome/" />;
}
