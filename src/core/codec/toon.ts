// Wrapper around @toon-format/toon for encoding/decoding
import { encode, decode, encodeLines, decodeStream } from "@toon-format/toon";

export function encodeToon(json: any, options?: any): string {
  return encode(json, options);
}

export function decodeToon(toon: string, options?: any): any {
  return decode(toon, options);
}

export function encodeToonLines(json: any, options?: any): string[] {
  return encodeLines(json, options);
}

export function decodeToonStream(toon: string, options?: any): any {
  return decodeStream(toon, options);
}
