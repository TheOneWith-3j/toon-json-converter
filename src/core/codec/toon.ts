// Wrapper around @toon-format/toon for encoding/decoding
import {
  decode,
  decodeStream,
  encode,
  encodeLines,
  type DecodeOptions,
  type DecodeStreamOptions,
  type EncodeOptions,
  type JsonStreamEvent,
  type JsonValue,
} from "@toon-format/toon";

export function encodeToon(json: unknown, options?: EncodeOptions): string {
  return encode(json, options);
}

export function decodeToon(toon: string, options?: DecodeOptions): JsonValue {
  return decode(toon, options);
}

export function encodeToonLines(json: unknown, options?: EncodeOptions): Iterable<string> {
  return encodeLines(json, options);
}

export function decodeToonStream(
  toon: Iterable<string> | AsyncIterable<string>,
  options?: DecodeStreamOptions,
): AsyncIterable<JsonStreamEvent> {
  return decodeStream(toon, options);
}
