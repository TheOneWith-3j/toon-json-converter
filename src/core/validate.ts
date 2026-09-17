// Validate input and return error info
import { decodeToon } from "./codec/toon";

export interface ValidationResult {
  valid: boolean;
  type: "json" | "toon" | "unknown";
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}

export function validateInput(input: string): ValidationResult {
  try {
    JSON.parse(input);
    return { valid: true, type: "json" };
  } catch (jsonErr: unknown) {
    // Try TOON
    try {
      decodeToon(input);
      return { valid: true, type: "toon" };
    } catch (toonErr: unknown) {
      // Extract line/column if available
      const toonMessage = toonErr instanceof Error ? toonErr.message : "";
      const jsonMessage = jsonErr instanceof Error ? jsonErr.message : "";
      const match = toonMessage.match(/line (\d+), column (\d+)/);
      return {
        valid: false,
        type: "unknown",
        error: {
          message: toonMessage || jsonMessage || "Unknown error",
          line: match ? parseInt(match[1], 10) : undefined,
          column: match ? parseInt(match[2], 10) : undefined,
        },
      };
    }
  }
}
