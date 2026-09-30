import type { Metadata } from "next";
import Link from "next/link";
import { encodeToon } from "../../core/codec/toon";
import { conversionExamples } from "../../core/examples";
import ContentPageShell from "../../components/ContentPageShell";

export const metadata: Metadata = {
  title: "JSON to TOON Examples",
  description:
    "See real JSON and TOON examples for objects, uniform arrays, nested configuration, primitive lists, events, and keyed data.",
  alternates: { canonical: "/examples" },
};

export default function ExamplesPage() {
  return (
    <ContentPageShell
      eyebrow="EXAMPLES / FORMAT GUIDE"
      title="See how JSON becomes TOON"
      description="Examples are encoded with the same official TOON library used by the converter. TOON is often most compact for uniform arrays; actual size varies with data shape. These examples show character counts, not model-specific token counts."
    >
      <div className="grid gap-6">
        {conversionExamples.map((example) => {
          const json = JSON.stringify(example.json, null, 2);
          const toon = encodeToon(example.json);
          return (
            <article
              key={example.id}
              className="min-w-0 border-t border-[var(--line)] pt-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="m-0 text-xl font-bold text-[var(--foreground)]">
                    {example.name}
                  </h2>
                  <p className="mb-0 mt-2 text-sm text-[var(--muted)]">
                    {example.description}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)]">
                  {example.bestFor}
                </span>
              </div>
              <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
                <div className="min-w-0">
                  <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--muted)]">
                    <span>JSON</span>
                    <span>{json.length.toLocaleString()} chars</span>
                  </div>
                  <pre className="max-h-80 overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] p-4 text-xs leading-relaxed text-[var(--foreground)]">
                    {json}
                  </pre>
                </div>
                <div className="min-w-0">
                  <div className="mb-2 flex justify-between text-xs font-semibold text-[var(--muted)]">
                    <span>TOON</span>
                    <span>{toon.length.toLocaleString()} chars</span>
                  </div>
                  <pre className="max-h-80 overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] p-4 text-xs leading-relaxed text-[var(--foreground)]">
                    {toon}
                  </pre>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-sm leading-relaxed text-[var(--muted)]">
        Want to test your own data?{" "}
        <Link
          className="font-semibold text-[var(--foreground)] underline underline-offset-4"
          href="/"
        >
          Open the JSON to TOON converter
        </Link>
        . For syntax and rules, refer to the{" "}
        <a
          className="font-semibold text-[var(--foreground)] underline underline-offset-4"
          href="https://github.com/toon-format/spec"
          target="_blank"
          rel="noreferrer"
        >
          official TOON specification
        </a>
        .
      </p>
    </ContentPageShell>
  );
}
