"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchModal } from "./SearchModal";
import { SITE } from "@/lib/site";

type NavItem = { name: string; slug: string; count: number };

type HeaderProps = {
  categories: NavItem[];
  tags: NavItem[];
};

export function Header({ categories, tags }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const topCategories = categories.slice(0, 8);
  const topTags = tags.slice(0, 10);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur transition ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="site-container flex items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-brand text-xl text-primary no-underline hover:text-primary-hover"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE.logo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-sm object-contain"
            />
            <span>{SITE.name}</span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center rounded border border-black/10 px-3 py-1.5 text-sm md:hidden"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>

          <nav
            id="main-nav"
            className={`${
              open ? "flex" : "hidden"
            } absolute left-0 right-0 top-full flex-col gap-1 border-b border-black/5 bg-white p-4 shadow-md md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          >
            <Link href="/" className="nav-link" onClick={() => setOpen(false)}>
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <Link
                href="/categories/"
                className="nav-link inline-flex items-center gap-1"
                onClick={() => setOpen(false)}
              >
                Categories
              </Link>
              {catOpen && (
                <div className="absolute left-0 top-full z-20 min-w-[220px] rounded-md border border-black/10 bg-white py-2 shadow-lg">
                  {topCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}/`}
                      className="flex items-center justify-between px-3 py-1.5 text-sm text-black/70 hover:bg-black/[0.03] hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      <span>{c.name}</span>
                      <span className="text-xs text-black/40">{c.count}</span>
                    </Link>
                  ))}
                  <Link
                    href="/categories/"
                    className="mt-1 block border-t border-black/5 px-3 py-2 text-sm font-medium"
                    onClick={() => setOpen(false)}
                  >
                    All Categories
                  </Link>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setTagOpen(true)}
              onMouseLeave={() => setTagOpen(false)}
            >
              <Link
                href="/tags/"
                className="nav-link inline-flex items-center gap-1"
                onClick={() => setOpen(false)}
              >
                Tags
              </Link>
              {tagOpen && (
                <div className="absolute left-0 top-full z-20 min-w-[220px] rounded-md border border-black/10 bg-white py-2 shadow-lg">
                  {topTags.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/tags/#${t.slug}`}
                      className="flex items-center justify-between px-3 py-1.5 text-sm text-black/70 hover:bg-black/[0.03] hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      <span>#{t.name}</span>
                      <span className="text-xs text-black/40">{t.count}</span>
                    </Link>
                  ))}
                  <Link
                    href="/tags/"
                    className="mt-1 block border-t border-black/5 px-3 py-2 text-sm font-medium"
                    onClick={() => setOpen(false)}
                  >
                    All Tags
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about/" className="nav-link" onClick={() => setOpen(false)}>
              About
            </Link>

            <button
              type="button"
              className="nav-link text-left"
              onClick={() => {
                setSearchOpen(true);
                setOpen(false);
              }}
            >
              Search
            </button>
          </nav>
        </div>
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
