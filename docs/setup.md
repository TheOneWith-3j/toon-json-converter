# Setup & Deployment

## Local Development

- `pnpm install`
- `pnpm dev`

## Static Export

- `pnpm build`
- `pnpm exec next export`

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
