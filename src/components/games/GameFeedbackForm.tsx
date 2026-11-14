"use client";

import Link from "next/link";
import { useState } from "react";

// Formspree form for "wrong data" reports and game suggestions on /games-made-with-godot/.
const FORMSPREE_URL = "https://formspree.io/f/xaeoqlpp";

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "mt-1 block w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-black/30 focus:border-primary focus:outline-none";
const labelCls = "block text-sm font-semibold text-black/75";

export function GameFeedbackForm() {
  const [type, setType] = useState("wrong_info");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setType("wrong_info");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        <p className="font-semibold">Thanks, we got it.</p>
        <p className="mt-1">We read every message and check it before changing the table.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-3 font-semibold text-primary hover:underline">
          Send another
        </button>
      </div>
    );
  }

  const adding = type === "add_game";

  return (
    <form action={FORMSPREE_URL} method="POST" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="_subject" value="Games table: new message" />
      {/* Honeypot for spam bots. Hidden from people and screen readers. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <label className={labelCls}>
        What is it about?
        <select name="type" value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
          <option value="wrong_info">Wrong or outdated information</option>
          <option value="add_game">Add a game</option>
          <option value="other">Something else</option>
        </select>
      </label>

      <label className={labelCls}>
        Game name <span className="text-rose-600">*</span>
        <input name="game" required maxLength={120} placeholder="e.g. Brotato" className={inputCls} />
      </label>

      <label className={labelCls}>
        Store link <span className="font-normal text-black/40">(optional)</span>
        <input name="store_link" type="url" placeholder="https://store.steampowered.com/app/..." className={inputCls} />
      </label>

      <label className={labelCls}>
        Proof it uses Godot{" "}
        <span className="font-normal text-black/40">{adding ? "(recommended)" : "(optional)"}</span>
        <input
          name="godot_proof"
          type="url"
          placeholder="Showcase page, developer post or interview"
          className={inputCls}
        />
      </label>

      <label className={`${labelCls} sm:col-span-2`}>
        {adding ? "Tell us about the game" : "What should we fix?"} <span className="text-rose-600">*</span>
        <textarea
          name="message"
          required
          rows={4}
          maxLength={2000}
          placeholder={
            adding
              ? "Release date, genre and anything else that helps us check it."
              : "Which value is wrong and where you saw the correct one."
          }
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        Email <span className="font-normal text-black/40">(optional, only if you want a reply)</span>
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputCls} />
      </label>

      <div className="flex flex-col justify-end gap-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-10 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send"}
        </button>
      </div>

      <p className="text-xs leading-5 text-black/50 sm:col-span-2">
        Please keep personal details like your phone number or home address out of the message, we only need
        information about the game. Messages are sent through Formspree. See our{" "}
        <Link href="/privacy-policy/" className="underline">
          privacy policy
        </Link>
        .
      </p>
      {status === "error" && (
        <p role="alert" className="text-sm text-rose-700 sm:col-span-2">
          Something went wrong and the message was not sent. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
