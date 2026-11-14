import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/components/StaticMarkdownPage";
import { getPageBySlug, renderMarkdown } from "@/lib/content";

export const metadata = pageMetadata("contact", "/contact/");

export default async function ContactPage() {
  const page = getPageBySlug("contact");
  if (!page) notFound();
  const html = await renderMarkdown(page.content);

  return (
    <div className="site-container max-w-3xl">
      {/* The page heading; contact.md has no "# Contact" line so it is not shown twice. */}
      <h1 className="section-title">
        <span>{page.title}</span>
      </h1>
      <div className="article-post" dangerouslySetInnerHTML={{ __html: html }} />
      <section aria-label="Contact form" className="mt-8 rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm sm:p-8">
        <ContactForm />
      </section>
    </div>
  );
}
