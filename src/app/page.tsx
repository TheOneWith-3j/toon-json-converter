"use client";

import { useEffect, useState } from "react";
import ConverterPane from "../components/ConverterPane";

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
      <div className="page-intro">
        <div>
          <p className="eyebrow">FORMAT LAB / 01</p>
          <h1>Shape data with intent.</h1>
          <p className="intro-copy">
            A fast, private workbench for moving between JSON and TOON without
            losing the details that matter.
          </p>
        </div>
        <div className="intro-stamp">
          <strong>JSON</strong>
          <span>↔</span>
          <strong>TOON</strong>
          <small>CANONICAL / VERIFIED</small>
        </div>
      </div>
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
