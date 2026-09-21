"use client";

import { useEffect, useState } from "react";
import ConverterPane from "../components/ConverterPane";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toon-json-converter.vercel.app";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON ↔ TOON Converter",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Online JSON to TOON converter and TOON to JSON converter for developers, with validation, diffing, schema inspection, local project storage, and batch conversion.",
  url: siteUrl,
  image: `${siteUrl}/icon-512.png`,
  browserRequirements: "Requires modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "JSON to TOON converter",
    "TOON to JSON converter",
    "round-trip verification",
    "schema inspection",
    "batch conversion",
    "local-first workflow",
  ],
  sameAs: [
    "https://github.com/toon-format/spec",
    "https://github.com/toon-format/toon",
    "https://github.com/TheOneWith-3j/toon-json-converter",
  ],
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a JSON to TOON converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A JSON to TOON converter transforms JSON data into TOON, a compact notation for structured data. This tool also converts TOON back to JSON and verifies the round trip.",
      },
    },
    {
      "@type": "Question",
      name: "Is this JSON to TOON converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The converter is free to use in a modern browser, with no account required for local conversion.",
      },
    },
    {
      "@type": "Question",
      name: "Is my JSON uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Conversion runs in your browser by default. Input and output stay local unless you explicitly enable optional Firebase project sync.",
      },
    },
  ],
};

export default function HomePage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedTheme = localStorage.getItem("toon-theme") === "dark";
      setDark(savedTheme);
      document.documentElement.dataset.theme = savedTheme ? "dark" : "light";
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("toon-theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }

  return (
    <main className="app-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
          </div>
          <div>
            <p className="brand-name">TOONWORKS</p>
            <p className="brand-subtitle">structured data studio</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="header-pill">
            <span className="live-dot" /> LOCAL-FIRST
          </span>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            <span aria-hidden="true">{dark ? "☼" : "◐"}</span>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </header>
      <section className="page-intro" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">FORMAT LAB / 01</p>
          <h1 id="hero-title">JSON to TOON Converter</h1>
          <p className="intro-copy">
            Convert JSON to TOON and TOON to JSON online with validation, schema
            inspection, diffing, and local-first project storage built for real
            developer workflows.
          </p>
        </div>
        <div className="intro-stamp" aria-label="JSON and TOON converter">
          <strong>JSON</strong>
          <span>↔</span>
          <strong>TOON</strong>
          <small>CANONICAL / VERIFIED</small>
        </div>
      </section>
      <ConverterPane />
      <section className="seo-guide" aria-labelledby="guide-title">
        <div>
          <p className="eyebrow">CONVERSION GUIDE / 02</p>
          <h2 id="guide-title">Free JSON to TOON converter</h2>
          <p>
            Use this online JSON to TOON converter to turn JSON objects and
            arrays into compact, readable TOON. Switch directions to convert
            TOON back to formatted JSON, then inspect validation, size changes,
            diffs, and round-trip verification in the same workspace.
          </p>
        </div>
        <div className="seo-guide-grid">
          <article>
            <h3>What is TOON?</h3>
            <p>
              TOON is a compact notation for structured data. It is designed to
              represent JSON-like objects and arrays with less repetition,
              making data easier to read and useful in token-conscious
              workflows.
            </p>
          </article>
          <article>
            <h3>Private browser conversion</h3>
            <p>
              JSON and TOON conversion runs locally in your browser. You can
              format, validate, compare, download, and batch-convert files
              without sending their contents to this website.
            </p>
          </article>
          <article>
            <h3>Built for developer workflows</h3>
            <p>
              Check canonical output, infer a schema, apply transforms, save
              local projects, and verify that a JSON to TOON to JSON round trip
              preserves the data you started with.
            </p>
          </article>
        </div>
        <div className="seo-faq">
          <h3>Common questions</h3>
          <details>
            <summary>Is this JSON to TOON converter free?</summary>
            <p>
              Yes. Local conversion is free and does not require an account.
            </p>
          </details>
          <details>
            <summary>Does the converter upload my data?</summary>
            <p>
              No. Conversion is local by default. Optional Firebase sync is only
              used when you connect it and sign in.
            </p>
          </details>
        </div>
        <div className="resource-links" aria-labelledby="resources-title">
          <div>
            <p className="eyebrow">DEVELOPER REFERENCES / 03</p>
            <h3 id="resources-title">Learn more about JSON and TOON</h3>
            <p>
              Read the format documentation, inspect the implementation, or use
              the official SDK when you want to bring TOON into your own tools
              and applications.
            </p>
          </div>
          <div className="resource-link-grid">
            <a
              href="https://github.com/toon-format/spec"
              target="_blank"
              rel="noreferrer"
            >
              <strong>TOON specification</strong>
              <span>Format rules and examples from the source project</span>
            </a>
            <a
              href="https://github.com/toon-format/toon"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Official TypeScript SDK</strong>
              <span>Encode and decode TOON in JavaScript or TypeScript</span>
            </a>
            <a
              href="https://www.npmjs.com/package/@toon-format/toon"
              target="_blank"
              rel="noreferrer"
            >
              <strong>TOON on npm</strong>
              <span>Install the package and review published versions</span>
            </a>
            <a
              href="https://github.com/TheOneWith-3j/toon-json-converter"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Converter source code</strong>
              <span>Issues, feature requests, and contribution guide</span>
            </a>
          </div>
        </div>
      </section>
      <footer className="app-footer">
        <span>© 2026 TOONWORKS. Local-first by default.</span>
        <div className="footer-links">
          <a
            href="https://github.com/TheOneWith-3j/toon-json-converter"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://github.com/TheOneWith-3j/toon-json-converter/blob/main/docs/privacy.md"
            target="_blank"
            rel="noreferrer"
          >
            Privacy
          </a>
        </div>
      </footer>
    </main>
  );
}
