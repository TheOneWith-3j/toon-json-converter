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
