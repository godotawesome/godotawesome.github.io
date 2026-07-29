"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function WelcomeRedirect() {
  useEffect(() => {
    window.location.replace("/about/");
  }, []);

  return (
    <div className="site-container max-w-2xl py-16 text-center text-sm text-black/60">
      <p>
        Redirecting to{" "}
        <Link href="/about/" className="underline">
          About
        </Link>
        …
      </p>
    </div>
  );
}
