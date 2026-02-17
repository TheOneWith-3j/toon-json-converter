# JSON ↔ TOON Converter

A feature-rich, production-quality, fully serverless converter for JSON ↔ TOON using the official [@toon-format/toon](https://github.com/toon-format/toon) TypeScript SDK.

## Features

- Auto-detect JSON/TOON
- One-click conversion
- Canonicalization controls
- Live validation with error highlighting
- Round-trip verifier + diff view
- Premium CodeMirror 6 editor UX
- Responsive layout (split/tabbed)
- Presets gallery
- History & local projects (IndexedDB)
- Keyboard shortcuts
- Schema inference + visualization
- Auto-repair suggestions
- Transform rules (power user mode)
- Batch conversion + zip download
- Optional Firebase sync (feature-flagged)
- Metrics dashboard (privacy-aware)
- PWA: offline-ready, installable
- Capacitor compatible
- CI/CD: GitHub Actions, deploy to Pages

## Tech Stack

- Next.js (static export)
- TypeScript (strict mode)
- Tailwind CSS
- CodeMirror 6
- IndexedDB via idb
- jszip, diff, react-diff-viewer
- @toon-format/toon
- Firebase (optional)
- Capacitor
- Vitest (tests)

## Local Development

```sh
pnpm install
pnpm dev
```

## Static Export & Deployment

```sh
pnpm build
pnpm exec next export
```

- Deploy `out/` to GitHub Pages, Cloudflare Pages, or Firebase Hosting.

## PWA & Capacitor

- App is installable and offline-ready.
- Use `capacitor.config.ts` and `npx cap sync` for mobile builds.

## Firebase Setup (Optional)

- Add Firebase config to `.env` and enable sync features.

## Metrics & Privacy

- Metrics are local-first, opt-in for cloud sync.
- See `/docs/privacy.md` for details.

## Documentation

- See `/docs/` for feature guides, setup, and deployment instructions.

## License

MIT
