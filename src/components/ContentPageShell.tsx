import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function ContentPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="app-shell min-h-screen">
      <header className="app-header">
        <Link href="/" className="brand-lockup no-underline">
          <Image
            className="brand-mark"
            src="/brand-mark.svg"
            alt=""
            aria-hidden="true"
            width={34}
            height={34}
          />
          <span>
            <span className="brand-name block">TOONWORKS</span>
            <span className="brand-subtitle block">structured data studio</span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-2 sm:gap-4"
        >
          <Link
            href="/examples"
            className="rounded-lg px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Examples
          </Link>
          <Link
            href="/privacy"
            className="rounded-lg px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Contact
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-[var(--background)]"
          >
            Open converter
          </Link>
        </nav>
      </header>
      <section className="mx-auto w-[min(1080px,calc(100%-32px))] py-10 sm:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="m-0 max-w-4xl text-4xl font-bold leading-tight text-[var(--foreground)] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)]">
          {description}
        </p>
        <div className="mt-9">{children}</div>
      </section>
      <footer className="app-footer">
        <span>TOONWORKS · Local-first by default.</span>
        <div className="footer-links">
          <Link href="/examples">Examples</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
