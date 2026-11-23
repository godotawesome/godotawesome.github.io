// Types and formatters for /games/. Client safe (no fs). Loader: games-data.ts.
// Data: content/games/godot-games.json, edited by the Monday update agent.

export type StoreKey =
  | "steam"
  | "epic"
  | "gog"
  | "itch"
  | "xbox"
  | "playstation"
  | "nintendo"
  | "app_store"
  | "google_play"
  | "microsoft_store";

export type NamedLink = { name: string; url?: string };

export type Game = {
  id: string;
  name: string;
  steam_appid?: number | null;
  image?: string; // Steam small capsule or App Store icon URL, refreshed from the APIs
  release_date: string; // YYYY-MM-DD, or YYYY-MM / YYYY when the day is unknown
  status: "released" | "early_access" | "upcoming";
  developers: NamedLink[];
  publishers: NamedLink[];
  genres: string[];
  platforms: string[];
  reviews: { total: number | null; positive_pct: number | null; url?: string };
  time_to_beat: {
    hours_min: number | null;
    hours_max?: number | null;
    url?: string;
    source?: "howlongtobeat" | "igdb" | "";
  };
  revenue: {
    usd: number | null;
    free?: boolean;
    url?: string;
    source?: "sensortower" | "gamalytic" | "";
  };
  stores: Partial<Record<StoreKey, string>>;
  godot_proof: {
    url: string;
    type: "official_showcase" | "developer_statement" | "postmortem" | "store_page" | "press" | "steamdb_tech";
  };
  article?: string; // internal path, e.g. "/brotato-godot-success-story/"
  description: string;
  last_checked: string;
  notes?: string;
  sources?: string[];
};

export type GamesData = {
  meta: {
    schema_version: number;
    mock: boolean;
    last_checked: string;
    currency: "USD";
  };
  games: Game[];
};

export const STORE_LABELS: Record<StoreKey, string> = {
  steam: "Steam",
  epic: "Epic",
  gog: "GOG",
  itch: "itch.io",
  xbox: "Xbox",
  playstation: "PlayStation",
  nintendo: "Switch",
  app_store: "App Store",
  google_play: "Google Play",
  microsoft_store: "Microsoft Store",
};

export const STORE_ORDER: StoreKey[] = [
  "steam",
  "epic",
  "gog",
  "itch",
  "xbox",
  "playstation",
  "nintendo",
  "app_store",
  "google_play",
  "microsoft_store",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return "TBA";
  if (!m) return String(y);
  if (!d) return `${MONTHS[m - 1]} ${y}`;
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

export function formatRevenue(r: Game["revenue"]): string {
  if (r.free) return "Free";
  if (r.usd == null) return "N/A";
  if (r.usd >= 1_000_000) return `$${(r.usd / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (r.usd >= 1_000) return `$${Math.round(r.usd / 1_000)}K`;
  return `$${r.usd}`;
}

export function formatHours(t: Game["time_to_beat"]): string {
  if (t.hours_min == null) return "N/A";
  if (t.hours_max && t.hours_max !== t.hours_min) return `${t.hours_min} - ${t.hours_max} Hours`;
  return `${t.hours_min} ${t.hours_min === 1 ? "Hour" : "Hours"}`;
}

export function formatNumber(n: number | null): string {
  return n == null ? "N/A" : n.toLocaleString("en-US");
}

export function withUtm(url: string): string {
  if (!url || !/store\.steampowered\.com/.test(url)) return url;
  return url.includes("?") ? `${url}&utm_source=godotawesome` : `${url}?utm_source=godotawesome`;
}
