# Setup & Deployment

## Local Development

- `npm install`
- `npm run dev`
- `npx playwright install chromium` before the first local E2E run

## Production Build

- `npm run build`
- `npm run preview` starts the production Next.js server locally.

## Validation

- `npm run validate` runs lint, typecheck, unit tests, static build, and Playwright release smoke tests.

## Deployment

### Vercel

- Import the repository into Vercel.
- Use the default Next.js build settings.
- Set `NEXT_PUBLIC_SITE_URL` to the production Vercel URL.
- Add the `NEXT_PUBLIC_FIREBASE_*` values only when cloud sync is enabled.
- GitHub Actions validates pushes and pull requests; Vercel handles deployment.

## Optional Firebase Sync

Add these public web app values when cloud project sync should be enabled:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Use `.env.example` as the template and copy values into `.env.local` for local development.

Firestore rules for the project sync collection are documented in [firebase-rules.md](firebase-rules.md).

## Capacitor

- Use `capacitor.config.ts`
- `npx cap sync` for mobile builds

## PWA

- Manifest, icons, service worker
- Offline indicator
