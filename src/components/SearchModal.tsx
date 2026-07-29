"use client";

import { useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch";

type SearchDoc = {
  id: string;
  url: string;
  title: string;
  body: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open || ready) return;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchDoc[]) => {
        setDocs(data);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [open, ready]);

  const miniSearch = useMemo(() => {
    const ms = new MiniSearch<SearchDoc>({
      fields: ["title", "body"],
      storeFields: ["title", "url", "body"],
      searchOptions: { boost: { title: 3 }, fuzzy: 0.2, prefix: true },
    });
    if (docs.length) ms.addAll(docs);
    return ms;
  }, [docs]);

  const results =
    query.trim().length > 1
      ? miniSearch.search(query.trim()).slice(0, 12).map((r) => ({
          id: String(r.id),
          url: String(r.url ?? ""),
          title: String(r.title ?? ""),
          body: String(r.body ?? ""),
        }))
      : [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-black/10 p-3">
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type and search..."
            className="w-full rounded border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-black/10 px-3 py-2 text-sm"
          >
            Close
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {!ready && <li className="px-3 py-2 text-sm text-black/50">Loading index…</li>}
          {ready && query.trim().length > 1 && results.length === 0 && (
            <li className="px-3 py-2 text-sm text-black/50">No results found.</li>
          )}
          {results.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                className="block rounded px-3 py-2 no-underline hover:bg-black/[0.04]"
                onClick={onClose}
              >
                <span className="block text-sm font-semibold text-black/85">{r.title}</span>
                <span className="block truncate text-xs text-black/45">{r.body}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
