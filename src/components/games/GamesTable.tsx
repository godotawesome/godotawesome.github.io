"use client";

import { Fragment, useMemo, useState } from "react";
import {
  STORE_LABELS,
  STORE_ORDER,
  formatDate,
  formatHours,
  formatNumber,
  formatRevenue,
  withUtm,
  type Game,
  type NamedLink,
  type StoreKey,
} from "@/lib/games";

type SortKey = "name" | "release" | "reviews" | "positive" | "hours" | "revenue";
type SortDir = "asc" | "desc";

const STATUS_LABEL: Record<Game["status"], string> = {
  released: "Released",
  early_access: "Early Access",
  upcoming: "Upcoming",
};

const STORE_STYLE: Record<StoreKey, string> = {
  steam: "bg-[#1b2838] text-white hover:bg-[#2a475e]",
  epic: "bg-[#2a2a2a] text-white hover:bg-black",
  gog: "bg-[#86328a] text-white hover:bg-[#6b2870]",
  itch: "bg-[#fa5c5c] text-white hover:bg-[#e04848]",
  xbox: "bg-[#107c10] text-white hover:bg-[#0b5c0b]",
  playstation: "bg-[#0070d1] text-white hover:bg-[#0058a5]",
  nintendo: "bg-[#e60012] text-white hover:bg-[#b8000e]",
  app_store: "bg-[#0d96f6] text-white hover:bg-[#0a78c5]",
  google_play: "bg-[#01875f] text-white hover:bg-[#016a4b]",
};

const EXT = { target: "_blank", rel: "nofollow noopener noreferrer" } as const;

function sortValue(g: Game, key: SortKey): number | string | null {
  switch (key) {
    case "name":
      return g.name.toLowerCase();
    case "release":
      return g.release_date;
    case "reviews":
      return g.reviews.total;
    case "positive":
      return g.reviews.positive_pct;
    case "hours":
      return g.time_to_beat.hours_min;
    case "revenue":
      return g.revenue.free ? 0 : g.revenue.usd;
  }
}

function scoreColor(pct: number): string {
  if (pct >= 95) return "bg-emerald-600";
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 70) return "bg-lime-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

function MaybeLink({ href, children, className = "" }: { href?: string; children: React.ReactNode; className?: string }) {
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a href={href} {...EXT} className={`hover:underline ${className}`}>
      {children}
    </a>
  );
}

function Names({ list }: { list: NamedLink[] }) {
  if (!list.length) return <span className="text-black/35">N/A</span>;
  return (
    <>
      {list.map((n, i) => (
        <Fragment key={n.name}>
          {i > 0 && ", "}
          <MaybeLink href={n.url} className="text-black/70">
            {n.name}
          </MaybeLink>
        </Fragment>
      ))}
    </>
  );
}

export function StoreBadges({ stores, size = "sm" }: { stores: Game["stores"]; size?: "sm" | "md" }) {
  const keys = STORE_ORDER.filter((k) => stores[k]);
  if (!keys.length) return <span className="text-black/35">N/A</span>;
  const pad = size === "md" ? "px-2.5 py-1 text-xs" : "px-1.5 py-0.5 text-[11px]";
  return (
    <div className="flex flex-wrap gap-1">
      {keys.map((k) => (
        <a
          key={k}
          href={withUtm(stores[k]!)}
          {...EXT}
          className={`whitespace-nowrap rounded font-semibold no-underline transition ${pad} ${STORE_STYLE[k]} hover:text-white`}
          title={`Open on ${STORE_LABELS[k]}`}
        >
          {STORE_LABELS[k]}
        </a>
      ))}
    </div>
  );
}

function Capsule({ game }: { game: Game }) {
  if (game.steam_appid) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.steam_appid}/capsule_sm_120.jpg`}
        alt=""
        loading="lazy"
        width={64}
        height={24}
        className="h-6 w-16 shrink-0 rounded-sm object-cover"
      />
    );
  }
  const initials = game.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className="flex h-6 w-16 shrink-0 items-center justify-center rounded-sm bg-gradient-to-r from-[#478cbf] to-[#355570] text-[10px] font-bold tracking-wider text-white"
    >
      {initials}
    </span>
  );
}

function Positive({ pct, url }: { pct: number | null; url?: string }) {
  if (pct == null) return <span className="text-black/35">N/A</span>;
  return (
    <MaybeLink href={url} className="block min-w-[4.5rem] text-black/80">
      <span className="font-semibold tabular-nums">{Number.isInteger(pct) ? pct : pct.toFixed(2)}%</span>
      <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-black/10">
        <span className={`block h-full ${scoreColor(pct)}`} style={{ width: `${pct}%` }} />
      </span>
    </MaybeLink>
  );
}

function SortHeader({
  label,
  k,
  sort,
  onSort,
  align = "left",
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onSort: (k: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sort.key === k;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
      className={`whitespace-nowrap px-3 py-2.5 ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wide transition hover:text-primary ${
          active ? "text-primary" : ""
        }`}
      >
        {label}
        <span aria-hidden className="text-[10px]">
          {active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

export function GamesTable({ games }: { games: Game[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Game["status"]>("all");
  const [genre, setGenre] = useState("all");
  const [store, setStore] = useState<"all" | StoreKey>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "revenue", dir: "desc" });
  const [open, setOpen] = useState<string | null>(null);

  const allGenres = useMemo(
    () => Array.from(new Set(games.flatMap((g) => g.genres))).sort(),
    [games],
  );
  const usedStores = useMemo(() => STORE_ORDER.filter((k) => games.some((g) => g.stores[k])), [games]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = games.filter((g) => {
      if (status !== "all" && g.status !== status) return false;
      if (genre !== "all" && !g.genres.includes(genre)) return false;
      if (store !== "all" && !g.stores[store]) return false;
      if (!q) return true;
      return [g.name, ...g.developers.map((d) => d.name), ...g.publishers.map((p) => p.name), ...g.genres]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = sortValue(a, sort.key);
      const vb = sortValue(b, sort.key);
      if (va == null && vb == null) return 0;
      if (va == null) return 1; // N/A always last
      if (vb == null) return -1;
      return va < vb ? -dir : va > vb ? dir : 0;
    });
  }, [games, query, status, genre, store, sort]);

  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" ? "asc" : "desc" },
    );

  const filtersOn = query || status !== "all" || genre !== "all" || store !== "all";
  const reset = () => {
    setQuery("");
    setStatus("all");
    setGenre("all");
    setStore("all");
  };

  const selectCls =
    "h-10 rounded-md border border-black/10 bg-white px-3 text-sm text-black/75 shadow-sm focus:border-primary focus:outline-none";

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-black/[0.08] bg-white/80 p-3 shadow-sm backdrop-blur sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search games</span>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-black/35"
            >
              <path d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.65 3.64-1.06 1.06-3.64-3.65A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by game, developer, publisher or genre"
              className="h-10 w-full rounded-md border border-black/10 bg-white pl-9 pr-3 text-sm shadow-sm placeholder:text-black/35 focus:border-primary focus:outline-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <select aria-label="Filter by genre" value={genre} onChange={(e) => setGenre(e.target.value)} className={selectCls}>
              <option value="all">All genres</option>
              {allGenres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by store"
              value={store}
              onChange={(e) => setStore(e.target.value as typeof store)}
              className={selectCls}
            >
              <option value="all">All stores</option>
              {usedStores.map((k) => (
                <option key={k} value={k}>
                  {STORE_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "released", "early_access", "upcoming"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                status === s
                  ? "border-primary bg-primary text-white"
                  : "border-black/10 bg-white text-black/60 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABEL[s]}
            </button>
          ))}
          <span className="ml-auto text-xs text-black/45" aria-live="polite">
            Showing {rows.length} of {games.length} games
            {filtersOn && (
              <button type="button" onClick={reset} className="ml-2 font-semibold text-primary hover:underline">
                Clear filters
              </button>
            )}
          </span>
        </div>
        {/* Mobile sort */}
        <label className="flex items-center gap-2 text-xs text-black/55 lg:hidden">
          Sort by
          <select
            value={`${sort.key}:${sort.dir}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split(":") as [SortKey, SortDir];
              setSort({ key, dir });
            }}
            className={`${selectCls} h-8 flex-1`}
          >
            <option value="revenue:desc">Estimated revenue (high to low)</option>
            <option value="reviews:desc">Most reviews</option>
            <option value="positive:desc">Best rated</option>
            <option value="release:desc">Newest</option>
            <option value="release:asc">Oldest</option>
            <option value="hours:asc">Shortest to beat</option>
            <option value="name:asc">Name A to Z</option>
          </select>
        </label>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm lg:block">
        <div className="max-h-[80vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-[#f6f8fa] text-[11px] text-black/55 shadow-[0_1px_0_rgba(0,0,0,0.08)]">
              <tr>
                <th scope="col" className="w-10 px-3 py-2.5 text-left font-semibold">
                  #
                </th>
                <SortHeader label="Game" k="name" sort={sort} onSort={onSort} />
                <SortHeader label="Release" k="release" sort={sort} onSort={onSort} />
                <SortHeader label="Reviews" k="reviews" sort={sort} onSort={onSort} align="right" />
                <SortHeader label="Positive" k="positive" sort={sort} onSort={onSort} />
                <th scope="col" className="px-3 py-2.5 text-left font-semibold uppercase tracking-wide">
                  Developer / Publisher
                </th>
                <SortHeader label="Time to beat" k="hours" sort={sort} onSort={onSort} />
                <SortHeader label="Est. revenue" k="revenue" sort={sort} onSort={onSort} align="right" />
                <th scope="col" className="px-3 py-2.5 text-left font-semibold uppercase tracking-wide">
                  Stores
                </th>
                <th scope="col" className="w-8 px-2 py-2.5">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g, i) => {
                const isOpen = open === g.id;
                return (
                  <Fragment key={g.id}>
                    <tr className={`border-t border-black/[0.06] align-middle transition hover:bg-primary/[0.03] ${isOpen ? "bg-primary/[0.03]" : ""}`}>
                      <td className="px-3 py-3 text-xs tabular-nums text-black/40">{i + 1}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Capsule game={g} />
                          <div className="min-w-0">
                            <MaybeLink href={withUtm(g.stores.steam ?? Object.values(g.stores)[0] ?? "")} className="font-semibold text-black/85">
                              {g.name}
                            </MaybeLink>
                            {g.status !== "released" && (
                              <span
                                className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                                  g.status === "early_access" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                                }`}
                              >
                                {STATUS_LABEL[g.status]}
                              </span>
                            )}
                            <div className="mt-0.5 truncate text-[11px] text-black/45">{g.genres.join(" · ")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-black/65">
                        <time dateTime={g.release_date}>{formatDate(g.release_date)}</time>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        <MaybeLink href={g.reviews.url} className="text-black/80">
                          {formatNumber(g.reviews.total)}
                        </MaybeLink>
                      </td>
                      <td className="px-3 py-3">
                        <Positive pct={g.reviews.positive_pct} url={g.reviews.url} />
                      </td>
                      <td className="min-w-[10rem] max-w-[14rem] px-3 py-3 text-xs leading-5">
                        <div>
                          <Names list={g.developers} />
                        </div>
                        <div className="text-black/45">
                          <Names list={g.publishers} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <MaybeLink href={g.time_to_beat.url} className={g.time_to_beat.hours_min == null ? "text-black/35" : "text-black/75"}>
                          {formatHours(g.time_to_beat)}
                        </MaybeLink>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums">
                        <MaybeLink href={g.revenue.url} className={g.revenue.usd == null && !g.revenue.free ? "font-normal text-black/35" : "text-black/85"}>
                          {formatRevenue(g.revenue)}
                        </MaybeLink>
                      </td>
                      <td className="min-w-[15rem] px-3 py-3">
                        <StoreBadges stores={g.stores} />
                      </td>
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : g.id)}
                          aria-expanded={isOpen}
                          aria-controls={`detail-${g.id}`}
                          aria-label={`${isOpen ? "Hide" : "Show"} details for ${g.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-black/45 transition hover:bg-black/5 hover:text-primary"
                        >
                          <svg viewBox="0 0 20 20" aria-hidden className={`h-4 w-4 fill-current transition ${isOpen ? "rotate-180" : ""}`}>
                            <path d="M5.3 7.3 10 12l4.7-4.7 1.06 1.06L10 14.1 4.24 8.36z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr id={`detail-${g.id}`} className="bg-primary/[0.03]">
                        <td />
                        <td colSpan={9} className="px-3 pb-4 pt-0">
                          <Detail game={g} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <Empty onReset={reset} />}
        </div>
      </div>

      {/* Mobile and tablet cards */}
      <ol className="flex flex-col gap-3 lg:hidden">
        {rows.map((g, i) => (
          <li key={g.id} className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="pt-0.5 text-xs tabular-nums text-black/35">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <MaybeLink href={withUtm(g.stores.steam ?? Object.values(g.stores)[0] ?? "")} className="font-semibold text-black/85">
                      {g.name}
                    </MaybeLink>
                    <div className="text-xs text-black/50">
                      <Names list={g.developers} /> · <time dateTime={g.release_date}>{formatDate(g.release_date)}</time>
                    </div>
                  </div>
                  <MaybeLink href={g.revenue.url} className="shrink-0 text-right text-sm font-bold tabular-nums text-black/85">
                    {formatRevenue(g.revenue)}
                    <span className="block text-[10px] font-normal uppercase tracking-wide text-black/40">est. revenue</span>
                  </MaybeLink>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-black/40">Reviews</dt>
                    <dd className="font-semibold tabular-nums">
                      <MaybeLink href={g.reviews.url} className="text-black/80">
                        {formatNumber(g.reviews.total)}
                      </MaybeLink>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-black/40">Positive</dt>
                    <dd>
                      <Positive pct={g.reviews.positive_pct} url={g.reviews.url} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-black/40">Time to beat</dt>
                    <dd className="font-semibold">
                      <MaybeLink href={g.time_to_beat.url} className="text-black/80">
                        {formatHours(g.time_to_beat)}
                      </MaybeLink>
                    </dd>
                  </div>
                </dl>
                <div className="mt-3">
                  <StoreBadges stores={g.stores} />
                </div>
                <details className="group mt-3 text-sm">
                  <summary className="cursor-pointer list-none text-xs font-semibold text-primary">
                    <span className="group-open:hidden">More details</span>
                    <span className="hidden group-open:inline">Hide details</span>
                  </summary>
                  <div className="mt-2">
                    <Detail game={g} />
                  </div>
                </details>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {rows.length === 0 && (
        <div className="lg:hidden">
          <Empty onReset={reset} />
        </div>
      )}
    </div>
  );
}

function Detail({ game: g }: { game: Game }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-black/[0.06] bg-white p-3 text-[13px] leading-6 text-black/70 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <p className="max-w-2xl">{g.description}</p>
      <div className="flex shrink-0 flex-col gap-1 text-xs">
        <span>
          <span className="text-black/40">Publisher: </span>
          <Names list={g.publishers} />
        </span>
        <span>
          <span className="text-black/40">Platforms: </span>
          {g.platforms.join(", ")}
        </span>
        <a href={g.godot_proof.url} {...EXT} className="font-semibold">
          Proof it uses Godot
        </a>
        {g.article && (
          <a href={g.article} className="font-semibold">
            Read our article
          </a>
        )}
      </div>
    </div>
  );
}

function Empty({ onReset }: { onReset: () => void }) {
  return (
    <div className="px-4 py-12 text-center text-sm text-black/50">
      No games match these filters.{" "}
      <button type="button" onClick={onReset} className="font-semibold text-primary hover:underline">
        Clear filters
      </button>
    </div>
  );
}
