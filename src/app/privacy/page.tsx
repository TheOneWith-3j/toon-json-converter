import type { Metadata } from "next";
import ContentPageShell from "../../components/ContentPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How TOONWORKS handles conversion data, local projects, optional Firebase sync, and aggregate site analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ContentPageShell
      eyebrow="PRIVACY / DATA HANDLING"
      title="Your data stays yours"
      description="Last updated September 30, 2026. Conversion is local-first. Cloud sync is optional and requires an explicit sign-in."
    >
      <div className="grid gap-8 text-sm leading-relaxed text-[var(--foreground)]">
        <section>
          <h2 className="text-lg font-bold">Conversion data</h2>
          <p>
            JSON and TOON conversion runs in your browser. The app does not
            upload editor contents, conversion results, or batch files to its
            application server.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Local storage</h2>
          <p>
            Saved projects and conversion metrics are stored in your browser
            using IndexedDB and local storage. They remain on that browser until
            you delete them or clear its site data.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Optional cloud sync</h2>
          <p>
            If you choose Connect sync and sign in with Google, project
            documents are stored in Firebase Firestore under your user account.
            You can disconnect from sync in the app. Cloud copies may remain
            until deleted from your Firebase account or project controls.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Site analytics</h2>
          <p>
            Vercel Analytics measures aggregate page views and Vercel Speed
            Insights measures performance. Conversion contents, project names,
            and exported files are not sent to these analytics tools. See{" "}
            <a
              className="underline underline-offset-4"
              href="https://vercel.com/docs/analytics/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              Vercel’s analytics privacy information
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Questions</h2>
          <p>
            For privacy questions, use the{" "}
            <a className="underline underline-offset-4" href="/contact">
              contact form
            </a>
            . Do not include private payloads or credentials in a public issue.
          </p>
        </section>
      </div>
    </ContentPageShell>
  );
}
