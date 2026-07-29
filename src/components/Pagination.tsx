import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => (page === 1 ? "/" : `/page${page}/`);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className="rounded border border-black/10 px-3 py-1.5 text-sm">
          « Prev
        </Link>
      ) : (
        <span className="rounded border border-transparent px-3 py-1.5 text-sm text-black/30">« Prev</span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
        page === currentPage ? (
          <span
            key={page}
            className="rounded bg-primary px-3 py-1.5 text-sm font-semibold text-white"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={hrefFor(page)}
            className="rounded border border-black/10 px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link href={hrefFor(currentPage + 1)} className="rounded border border-black/10 px-3 py-1.5 text-sm">
          Next »
        </Link>
      ) : (
        <span className="rounded border border-transparent px-3 py-1.5 text-sm text-black/30">Next »</span>
      )}
    </nav>
  );
}
