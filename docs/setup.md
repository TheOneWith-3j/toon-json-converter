# Setup & Deployment

## Local Development

- `npm install`
- `npm run dev`

## Static Export

- `npm run build`
- `npm run build` writes the static site to `out/` via `next.config.ts`.

## Deployment

### GitHub Pages

- Push to `main`, deploys via GitHub Actions
- See `.github/workflows/deploy.yml`

### Cloudflare Pages

- Deploy `out/` directory

### Firebase Hosting

- Deploy `out/` directory
- Optional Firebase sync: add config to `.env`

## Optional Firebase Sync

Add these public web app values when cloud project sync should be enabled:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Capacitor

- Use `capacitor.config.ts`
- `npx cap sync` for mobile builds

## PWA

- Manifest, icons, service worker
- Offline indicator
