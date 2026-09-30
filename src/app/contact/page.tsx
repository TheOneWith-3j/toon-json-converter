import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";
import ContentPageShell from "../../components/ContentPageShell";

export const metadata: Metadata = {
  title: "Contact TOONWORKS",
  description:
    "Send feedback, report a bug, or request a feature for the free JSON to TOON converter.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ContentPageShell
      eyebrow="CONTACT / FEEDBACK"
      title="Help improve the converter"
      description="Tell us what worked, what did not, or what would make your structured-data workflow better."
    >
      <ContactForm />
    </ContentPageShell>
  );
}
