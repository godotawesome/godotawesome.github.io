"use client";

type Props = {
  title: string;
  url: string;
};

export function Share({ title, url }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  return (
    <aside className="md:sticky md:top-24">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-black/45">Share</p>
      <ul className="flex flex-row gap-2 md:flex-col">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black/70 no-underline transition hover:border-primary hover:text-primary"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
