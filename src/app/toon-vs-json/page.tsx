import type { Metadata } from "next";
import ConversionLandingPage from "../../components/ConversionLandingPage";

export const metadata: Metadata = {
  title: "TOON vs JSON: Differences and Examples",
  description:
    "Compare TOON and JSON with a real encoded example. Learn where TOON is useful, when JSON remains the better choice, and how to test your own data.",
  alternates: { canonical: "/toon-vs-json" },
};

export default function ToonVsJsonPage() {
  return <ConversionLandingPage kind="toon-vs-json" />;
}
