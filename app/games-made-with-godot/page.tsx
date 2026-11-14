import Link from "next/link";
import { GamesTable, StoreBadges } from "@/components/games/GamesTable";
import { formatDate, withUtm } from "@/lib/games";
import { getGamesData } from "@/lib/games-data";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const { meta, games } = getGamesData();

const PATH = "/games-made-with-godot/";
const YEAR = meta.last_checked.slice(0, 4);
// Head keyword "games made with godot" first; the year follows the weekly data check.
const TITLE = `Games Made with Godot (${YEAR}): Full List with Steam Data`;
const DESCRIPTION =
  "Every notable game made with the Godot Engine in one sortable list: release date, Steam reviews, time to beat, estimated revenue and store links. Updated weekly.";

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  // Keep sample data out of search results until real data replaces it.
  noIndex: meta.mock,
});

const FAQ = [
  {
    q: "How do you know a game was made with Godot?",
    a: "Every game in the table has a proof link: the official Godot showcase, a statement or postmortem from the developer, or a press interview. Games without proof are left out.",
  },
  {
    q: "Where do the review numbers come from?",
    a: "Review counts and the positive share come from each game's Steam store page and include reviews in all languages.",
  },
  {
    q: "How accurate is the estimated revenue?",
    a: "It is a third party estimate, not a number from the developer. Use it to compare games, not as exact sales. Each figure links to the estimate it comes from.",
  },
  {
    q: "How often is the table updated?",
    a: "Every Monday. The date at the top of the page shows the last check.",
  },
  {
    q: "My game is made with Godot. Can I add it?",
    a: "Yes. Send us the store link and a public link that shows the game uses Godot through the contact page.",
  },
];

export default function GamesPage() {
  const lastChecked = formatDate(meta.last_checked);
  const genreCount = new Set(games.flatMap((g) => g.genres)).size;
  const released = games.filter((g) => g.status === "released").length;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: TITLE,
      url: absoluteUrl(PATH),
      dateModified: meta.last_checked,
      numberOfItems: games.length,
      itemListElement: games.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "VideoGame",
          name: g.name,
          url: g.stores.steam || Object.values(g.stores)[0],
          datePublished: g.release_date,
          author: g.developers.map((d) => ({ "@type": "Organization", name: d.name })),
          gamePlatform: g.platforms,
          genre: g.genres,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16">
      {!meta.mock ? null : (
        <div role="note" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Preview:</strong> this table shows placeholder data. Real, checked data replaces it before the page
          is indexed.
        </div>
      )}

      {/* Hero */}
      <header className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#25384a] via-[#355570] to-[#478cbf] px-5 py-8 text-white shadow-md sm:px-10 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Last checked: <time dateTime={meta.last_checked}>{lastChecked}</time>
        </p>
        <h1 className="max-w-3xl font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Games Made with Godot: The Full List
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/85">
          This is a list of games made with Godot, the free and open source game engine, from solo hits to studio
          releases. For each
          game you can see the release date, Steam reviews and positive share, how long it takes to beat, an estimated
          revenue and links to every store that sells it. Sort any column, filter by genre or store, and open a row
          for a short summary and the proof that the game uses Godot.
        </p>
        <dl className="mt-6 grid max-w-xl grid-cols-3 gap-3">
          {[
            { label: "Games", value: games.length },
            { label: "Released", value: released },
            { label: "Genres", value: genreCount },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur">
              <dt className="text-[11px] uppercase tracking-wide text-white/65">{s.label}</dt>
              <dd className="text-2xl font-bold tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <GamesTable games={games} />

      <p className="mt-3 text-xs leading-5 text-black/45">
        Reviews: Steam, all languages. Time to beat: main story from HowLongToBeat or IGDB. Estimated revenue: third
        party estimate (Sensor Tower or Gamalytic), gross, in US dollars. Every number links to its source. Last
        checked {lastChecked}.
      </p>

      {/* Per game summaries */}
      <section className="mt-14" aria-labelledby="about-games">
        <div className="section-title">
          <span id="about-games">About each game</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {games.map((g) => (
            <article key={g.id} id={g.id} className="scroll-mt-24 rounded-xl border border-black/[0.08] bg-white p-5 shadow-sm">
              <h2 className="font-sans text-lg font-bold text-black/85">
                <a href={withUtm(g.stores.steam ?? Object.values(g.stores)[0] ?? "")} target="_blank" rel="nofollow noopener noreferrer" className="text-black/85 hover:text-primary">
                  {g.name}
                </a>
              </h2>
              <p className="mt-0.5 text-xs text-black/45">
                {g.developers.map((d) => d.name).join(", ")} · {formatDate(g.release_date)} · {g.genres.join(", ")}
              </p>
              <p className="mt-3 font-article text-[14px] leading-6 text-black/70">{g.description}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <StoreBadges stores={g.stores} size="md" />
                <span className="flex gap-3 text-xs font-semibold">
                  <a href={g.godot_proof.url} target="_blank" rel="nofollow noopener noreferrer">
                    Godot proof
                  </a>
                  {g.article && <Link href={g.article}>Our article</Link>}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Method + FAQ */}
      <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]" aria-labelledby="how-we-check">
        <div>
          <h2 id="how-we-check" className="font-sans text-xl font-bold text-black/85">
            How we build this table
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 font-article text-[14px] leading-6 text-black/70">
            <li>A game is added only when a public source shows it was made with Godot.</li>
            <li>We check every game by hand each Monday and update the numbers and links.</li>
            <li>Summaries are written by us, not copied from store pages.</li>
            <li>
              Want more context? Read{" "}
              <Link href="/godot-games-table/">the most successful Godot games analysis</Link> and{" "}
              <Link href="/games-made-with-godot-2026/">Godot games on Steam in 2026</Link>.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xl font-bold text-black/85">FAQ</h2>
          <div className="mt-3 divide-y divide-black/[0.08] rounded-xl border border-black/[0.08] bg-white">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-black/80">
                  {f.q}
                  <span aria-hidden className="text-black/35 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  {f.a}
                  {f.q.startsWith("My game") && (
                    <>
                      {" "}
                      <Link href="/contact/">Contact us</Link>.
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
