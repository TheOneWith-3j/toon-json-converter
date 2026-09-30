import Link from "next/link";

const linkGroups = [
  {
    title: "Convert",
    links: [
      { href: "/json-to-toon", label: "JSON to TOON" },
      { href: "/toon-to-json", label: "TOON to JSON" },
      { href: "/toon-vs-json", label: "TOON vs JSON" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/examples", label: "Examples" },
      { href: "https://github.com/toon-format/spec", label: "TOON specification", external: true },
      { href: "https://github.com/toon-format/toon", label: "TypeScript SDK", external: true },
    ],
  },
  {
    title: "Project",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "https://github.com/TheOneWith-3j/toon-json-converter", label: "GitHub", external: true },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-brand">
        <Link href="/" className="footer-wordmark">TOONWORKS</Link>
        <p>Private, local-first tools for structured data.</p>
      </div>
      {linkGroups.map((group) => (
        <nav key={group.title} aria-label={`${group.title} links`} className="footer-group">
          <h2>{group.title}</h2>
          {group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={"external" in link && link.external ? "_blank" : undefined}
              rel={"external" in link && link.external ? "noreferrer" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ))}
      <div className="footer-bottom">
        <span>© 2026 TOONWORKS</span>
        <span>Local-first by default</span>
      </div>
    </footer>
  );
}
