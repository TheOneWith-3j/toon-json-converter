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
  } catch (jsonErr: any) {
    // Try TOON
    try {
      decodeToon(input);
      return { valid: true, type: "toon" };
    } catch (toonErr: any) {
      // Extract line/column if available
      const match = toonErr?.message?.match(/line (\d+), column (\d+)/);
      return {
        valid: false,
        type: "unknown",
        error: {
          message: toonErr?.message || jsonErr?.message || "Unknown error",
          line: match ? parseInt(match[1], 10) : undefined,
          column: match ? parseInt(match[2], 10) : undefined,
        },
      };
    }
  }
}
