import fs from "node:fs";
import path from "node:path";
import type { GamesData } from "./games";

const DATA_FILE = path.join(process.cwd(), "content", "games", "godot-games.json");

export function getGamesData(): GamesData {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as GamesData;
}
