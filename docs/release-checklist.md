# Release Checklist

## Local Verification

Run the complete validation gate before merging a release PR:

```sh
npm run validate
```

Install the browser binary once before local E2E runs:

```sh
npx playwright install chromium
```

Preview the static export locally:

```sh
npm run build
npm run preview
```

Check these browser flows before publishing:

- Load a JSON preset and confirm TOON output appears.
- Convert TOON back to JSON and confirm round-trip verification.
- Use Format, Swap, Copy, Clear, Download, and Repair.
- Save, load, search, delete, export, and import local projects.
- Drop a mixed valid/invalid file batch and confirm the report shows converted and failed rows.
- Toggle light and dark mode.
- Test the mobile Input/Output tabs.
- Confirm `/service-worker.js` returns HTTP 200 after a production build.

The Playwright release smoke suite automates the primary conversion, project, batch report, theme, and mobile tab checks.

## Vercel

Connect the repository to Vercel and configure the production environment variables there.
Every push to the production branch should create a deployment, while GitHub Actions validates the change.

Required settings:

- `NEXT_PUBLIC_SITE_URL` set to the Vercel production URL.
- Firebase `NEXT_PUBLIC_*` values set only when cloud sync is enabled.
- Preview deployments enabled for pull requests.

## Optional Firebase Sync

Cloud sync is disabled unless `NEXT_PUBLIC_FIREBASE_*` values are configured.

Before enabling Firebase for users:

- Add the public Firebase web app values to the deployment environment.
- Enable Google sign-in in Firebase Authentication.
- Apply the Firestore rules in `docs/firebase-rules.md`.
- Confirm project pull/merge behavior with two browser sessions.

## Release Notes

Mention that the app is local-first by default. Project sync requires explicit Firebase configuration and user sign-in.
