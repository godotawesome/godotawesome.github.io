import Link from "next/link";
import { getAllCategories } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const categories = getAllCategories();

  return (
    <>
      <section className="jumbotron-fortags mt-16">
        <div className="site-container grid gap-6 py-10 md:grid-cols-[1fr_2fr] md:items-center">
          <h2 className="text-center font-sans text-2xl font-light md:text-left">
            Explore <span className="hidden md:inline">→</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}/`}
                className="rounded bg-white/15 px-3 py-1.5 text-sm text-white no-underline transition hover:bg-white/25"
              >
                {c.name} ({c.posts.length})
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white py-8">
        <div className="site-container flex flex-col gap-2 text-center text-sm text-black/55 md:text-left">
          <span>
            © {year} Built by{" "}
            <a
              href={SITE.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/70 hover:text-primary"
            >
              {SITE.legalName}
            </a>
            . All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-start">
            <Link href="/about/" className="text-black/70">
              About
            </Link>
            <Link href="/contact/" className="text-black/70">
              Contact
            </Link>
            <Link href="/privacy-policy/" className="text-black/70">
              Privacy
            </Link>
            <Link href="/cookie-policy/" className="text-black/70">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
