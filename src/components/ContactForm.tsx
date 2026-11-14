"use client";

import Link from "next/link";
import { useState } from "react";
import { inputCls, labelCls, submitCls } from "@/lib/form-styles";

// Formspree form for the /contact/ page (separate form from the games table feedback).
const FORMSPREE_URL = "https://formspree.io/f/xoedjpyo";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
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
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
        <p className="font-semibold">Thanks, your message is on its way.</p>
        <p className="mt-1">We read every message. Reply times vary.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-3 font-semibold text-primary hover:underline">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form action={FORMSPREE_URL} method="POST" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="_subject" value="GodotAwesome contact form" />
      {/* Honeypot for spam bots. Hidden from people and screen readers. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <label className={labelCls}>
        Name <span className="font-normal text-black/40">(optional)</span>
        <input name="name" maxLength={80} autoComplete="name" className={inputCls} />
      </label>

      <label className={labelCls}>
        Email <span className="text-rose-600">*</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputCls}
        />
      </label>

      <label className={`${labelCls} sm:col-span-2`}>
        Topic
        <select name="topic" defaultValue="question" className={inputCls}>
          <option value="question">Question</option>
          <option value="correction">Correction in an article</option>
          <option value="write_for_us">Writing for GodotAwesome</option>
          <option value="collaboration">Collaboration or partnership</option>
          <option value="other">Something else</option>
        </select>
      </label>

      <label className={`${labelCls} sm:col-span-2`}>
        Message <span className="text-rose-600">*</span>
        <textarea name="message" required rows={6} maxLength={4000} className={inputCls} />
      </label>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className={`${submitCls} w-full sm:w-auto`}>
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
      </div>

      <p className="text-xs leading-5 text-black/50 sm:col-span-2">
        We only use your email to reply. Please leave out personal details we do not need, like your phone number or
        home address. Messages are sent through Formspree. See our{" "}
        <Link href="/privacy-policy/" className="underline">
          privacy policy
        </Link>
        .
      </p>
      {status === "error" && (
        <p role="alert" className="text-sm text-rose-700 sm:col-span-2">
          Something went wrong and the message was not sent. Please try again, or email us directly.
        </p>
      )}
    </form>
  );
}
