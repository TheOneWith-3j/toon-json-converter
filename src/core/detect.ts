// Auto-detect input type: JSON, TOON, Unknown
import { decodeToon } from "./codec/toon";

export type DetectedType = "json" | "toon" | "unknown";

export function detectInputType(input: string): DetectedType {
  const trimmed = input.trim();
  if (!trimmed) return "unknown";
  try {
    JSON.parse(trimmed);
    return "json";
  } catch {}
  // A bare scalar is too ambiguous to classify as TOON while editing.
  if (!trimmed.includes(":") && !trimmed.includes("[") && !trimmed.includes("- ")) {
    return "unknown";
  }
  try {
    decodeToon(trimmed);
    return "toon";
  } catch {}
  return "unknown";
}
