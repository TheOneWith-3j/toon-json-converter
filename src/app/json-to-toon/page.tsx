import type { Metadata } from "next";
import ConversionLandingPage from "../../components/ConversionLandingPage";

export const metadata: Metadata = {
  title: "JSON to TOON Converter",
  description:
    "Convert JSON to TOON online with local processing, validation, round-trip verification, and real examples for structured data.",
  alternates: { canonical: "/json-to-toon" },
};

export default function JsonToToonPage() {
  return <ConversionLandingPage kind="json-to-toon" />;
}
