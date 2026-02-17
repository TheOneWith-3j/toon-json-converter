// Auto-detect input type: JSON, TOON, Unknown
import { decodeToon } from "./codec/toon";

export type DetectedType = "json" | "toon" | "unknown";

export function detectInputType(input: string): DetectedType {
  try {
    JSON.parse(input);
    return "json";
  } catch {}
  try {
    decodeToon(input);
    return "toon";
  } catch {}
  return "unknown";
}
