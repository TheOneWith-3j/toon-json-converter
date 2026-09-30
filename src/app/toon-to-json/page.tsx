import type { Metadata } from "next";
import ConversionLandingPage from "../../components/ConversionLandingPage";

export const metadata: Metadata = {
  title: "TOON to JSON Converter",
  description:
    "Decode TOON to formatted JSON in your browser. Validate output, inspect the schema, and compare both representations locally.",
  alternates: { canonical: "/toon-to-json" },
};

export default function ToonToJsonPage() {
  return <ConversionLandingPage kind="toon-to-json" />;
}
