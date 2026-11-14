import GamesRedirect from "./GamesRedirect";

const TARGET = "https://godotawesome.com/games-made-with-godot/";

export const metadata = {
  title: "Games Made with Godot",
  robots: { index: false, follow: true },
  alternates: { canonical: TARGET },
};

/** Old /games/ URL (live for a few days in Nov 2026) → /games-made-with-godot/ */
export default function GamesPage() {
  return <GamesRedirect />;
}
