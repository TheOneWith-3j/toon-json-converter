"use client";

import { useState, type FormEvent } from "react";

const repository = "https://github.com/TheOneWith-3j/toon-json-converter";

export default function ContactForm() {
  const [issueUrl, setIssueUrl] = useState("");

  function prepareIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const category = String(data.get("category") ?? "Feedback");
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const title = `[${category}] ${subject}`;
    const body = `## ${category}\n\n${message}\n\n---\nSent from the TOONWORKS contact form.`;
    setIssueUrl(
      `${repository}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
    );
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={prepareIssue} className="grid gap-5">
        <div className="grid gap-2">
          <label
            htmlFor="contact-category"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            What can we help with?
          </label>
          <select
            id="contact-category"
            name="category"
            className="min-h-12 rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-3 text-sm text-[var(--foreground)]"
            required
          >
            <option>Feedback</option>
            <option>Bug report</option>
            <option>Feature request</option>
            <option>Question</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="contact-subject"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            className="min-h-12 rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-3 text-sm text-[var(--foreground)]"
            maxLength={120}
            required
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="contact-message"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            className="min-h-40 resize-y rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]"
            maxLength={5000}
            required
          />
        </div>
        <p className="m-0 text-xs leading-relaxed text-[var(--muted)]">
          Continue opens a public GitHub issue with your message prefilled. Do
          not include secrets, private customer data, or conversion payloads.
        </p>
        <button
          type="submit"
          className="min-h-12 justify-self-start rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] hover:bg-[var(--accent-strong)]"
        >
          Prepare message
        </button>
      </form>
      {issueUrl && (
        <a
          href={issueUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-12 items-center rounded-xl border border-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
        >
          Continue to GitHub to submit
        </a>
      )}
    </div>
  );
}
