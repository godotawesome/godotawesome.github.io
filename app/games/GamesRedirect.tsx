"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GamesRedirect() {
  useEffect(() => {
    window.location.replace("/games-made-with-godot/");
  }, []);

  return (
    <div className="site-container max-w-2xl py-16 text-center text-sm text-black/60">
      <p>
        Moved to{" "}
        <Link href="/games-made-with-godot/" className="underline">
          Games Made with Godot
        </Link>
        .
      </p>
    </div>
  );
}
