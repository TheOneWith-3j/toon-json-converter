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

## Capacitor

- Use `capacitor.config.ts`
- `npx cap sync` for mobile builds

## PWA

- Manifest, icons, service worker
- Offline indicator
