# Privacy & Metrics

## Local Metrics

- All metrics are tracked locally (IndexedDB/localStorage)
- No data is sent to cloud unless opt-in

## Cloud Metrics (Optional)

- Firebase sync stores project documents only when the user connects cloud sync
- Metrics remain local and exportable from the browser dashboard

## Web Analytics (Vercel)

- Vercel Analytics records aggregate page views for the deployed web app.
- Vercel Speed Insights records anonymized performance measurements.
- Editor contents, project names, conversion results, Firebase documents, and
	exported files are not sent to analytics.
- The app does not use analytics to identify or profile individual users.

## Opt-In & Controls

- Metrics dashboard with export option
- Cloud sync controls only appear when Firebase public config is present

## Policy

- No conversion data or personal project data is collected by default.
- Hosting analytics may process standard request and performance data according
	to Vercel's privacy documentation.
- See Firebase privacy policy if enabled
