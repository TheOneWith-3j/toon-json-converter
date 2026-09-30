import Link from "next/link";
import { encodeToon } from "../core/codec/toon";
import { conversionExamples } from "../core/examples";
import ContentPageShell from "./ContentPageShell";

export type ConversionLandingKind =
  | "json-to-toon"
  | "toon-to-json"
  | "toon-vs-json";

const content = {
  "json-to-toon": {
    eyebrow: "JSON TO TOON / ONLINE CONVERTER",
    title: "Convert JSON to TOON",
    description:
      "Encode JSON objects and arrays as readable TOON in your browser. Validate the input, inspect the output, compare character size, and verify that the data round-trips.",
    question: "Does converting JSON to TOON change my data?",
    answer:
      "The converter uses the official TOON encoder and checks a decode round-trip. Always review the result for your own data and use the official specification for format details.",
  },
  "toon-to-json": {
    eyebrow: "TOON TO JSON / ONLINE CONVERTER",
    title: "Convert TOON to JSON",
    description:
      "Decode TOON into formatted JSON in your browser. Check validation, inspect the inferred schema, and compare the converted output without uploading your input.",
    question: "Can I convert TOON back to JSON?",
    answer:
      "Yes. Paste valid TOON into the converter and choose TOON to JSON. The app uses the official decoder and displays formatted JSON for inspection or download.",
  },
  "toon-vs-json": {
    eyebrow: "FORMAT GUIDE / JSON VS TOON",
    title: "TOON vs JSON: when to use each format",
    description:
      "JSON is broadly supported by APIs and software. TOON is a readable encoding of the JSON data model designed to reduce repeated structure in suitable LLM prompt inputs. Compare your own data instead of relying on a blanket savings estimate.",
    question: "Is TOON a replacement for JSON?",
    answer:
      "No. JSON remains the standard choice for APIs, storage, and general interoperability. TOON is an alternate representation useful in workflows that benefit from compact structured prompt data.",
  },
} satisfies Record<
  ConversionLandingKind,
  {
    eyebrow: string;
    title: string;
    description: string;
    question: string;
    answer: string;
  }
>;

export default function ConversionLandingPage({
  kind,
}: {
  kind: ConversionLandingKind;
}) {
  const page = content[kind];
  const example = conversionExamples.find(
    (item) => item.id === "inventory-list",
  )!;
  const json = JSON.stringify(example.json, null, 2);
  const toon = encodeToon(example.json);
  const jsonFirst = kind !== "toon-to-json";
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: page.question,
        acceptedAnswer: { "@type": "Answer", text: page.answer },
      },
    ],
  };

  return (
    <ContentPageShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <div className="grid gap-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <article className="border-t-2 border-[var(--accent-strong)] pt-4">
            <h2 className="m-0 text-sm font-bold text-[var(--foreground)]">
              Local processing
            </h2>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Conversion runs in the browser. Input is not uploaded unless you
              explicitly use optional cloud project sync.
            </p>
          </article>
          <article className="border-t-2 border-[var(--accent-strong)] pt-4">
            <h2 className="m-0 text-sm font-bold text-[var(--foreground)]">
              Verified workflow
            </h2>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Validate the source, inspect both formats, compare character
              counts, and check round-trip behavior.
            </p>
          </article>
          <article className="border-t-2 border-[var(--accent-strong)] pt-4">
            <h2 className="m-0 text-sm font-bold text-[var(--foreground)]">
              Choose by data shape
            </h2>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-[var(--muted)]">
              TOON is most compact for suitable structured data such as uniform
              records; deeply nested or irregular data may not shrink.
            </p>
          </article>
        </section>

        <section
          aria-labelledby="sample-title"
          className="border-t border-[var(--line)] pt-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">REAL CODEC OUTPUT</p>
              <h2
                id="sample-title"
                className="m-0 text-xl font-bold text-[var(--foreground)]"
              >
                Uniform inventory records
              </h2>
            </div>
            <span className="text-xs text-[var(--muted)]">
              {json.length} JSON chars · {toon.length} TOON chars
            </span>
          </div>
          <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
            <div className="min-w-0">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                {jsonFirst ? "JSON input" : "JSON output"}
              </h3>
              <pre className="max-h-80 overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] p-4 text-xs leading-relaxed text-[var(--foreground)]">
                {json}
              </pre>
            </div>
            <div className="min-w-0">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                {jsonFirst ? "TOON output" : "TOON input"}
              </h3>
              <pre className="max-h-80 overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] p-4 text-xs leading-relaxed text-[var(--foreground)]">
                {toon}
              </pre>
            </div>
          </div>
          <p className="mb-0 mt-3 text-xs leading-relaxed text-[var(--muted)]">
            Character counts are exact for this example. They are not token
            counts; tokenizer results differ between models.
          </p>
        </section>

        <section className="grid gap-4 border-t border-[var(--line)] pt-6 sm:grid-cols-2">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">
              {page.question}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              {page.answer}
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">
              Keep learning
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Browse more{" "}
              <Link className="underline underline-offset-4" href="/examples">
                JSON and TOON examples
              </Link>{" "}
              or read the{" "}
              <a
                className="underline underline-offset-4"
                href="https://github.com/toon-format/spec"
                target="_blank"
                rel="noreferrer"
              >
                official specification
              </a>
              .
            </p>
          </div>
        </section>
        <Link
          href="/"
          className="inline-flex min-h-12 w-fit items-center rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)]"
        >
          Open the converter
        </Link>
      </div>
    </ContentPageShell>
  );
}
