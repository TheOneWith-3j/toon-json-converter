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
- CI/CD: GitHub Actions validation, deploy to Vercel

## Tech Stack

- Next.js App Router with Vercel deployment
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
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to your deployed domain for canonical metadata, robots, and sitemap generation.

## Validation

```sh
npm run validate
```

The first local E2E run may need browser installation:

```sh
npx playwright install chromium
```

## Deployment

```sh
npm run build
npm run preview
```

- The production deployment targets Vercel. Connect the repository in Vercel
	and set `NEXT_PUBLIC_SITE_URL` to the deployed URL.
- GitHub Actions runs lint, typecheck, unit tests, production build, and E2E
	smoke tests for pushes and pull requests.

## PWA & Capacitor

- App is installable and offline-ready.
- Use `capacitor.config.ts` and `npx cap sync` for mobile builds.

## Firebase Setup (Optional)

- Copy `.env.example` to `.env.local` and add Firebase web app values to enable sync features.
- Firestore rules are documented in `/docs/firebase-rules.md`.

## Metrics & Privacy

- Metrics are local-first, opt-in for cloud sync.
- See `/docs/privacy.md` for details.

## Documentation

- See `/docs/` for feature guides, setup, and deployment instructions.
- See `/docs/release-checklist.md` before publishing a release.

## License

MIT
