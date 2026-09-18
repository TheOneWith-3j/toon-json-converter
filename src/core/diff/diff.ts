// Diff utilities for JSON and TOON
import { diffLines, diffJson } from "diff";

export function getLineDiff(a: string, b: string) {
  return diffLines(a, b);
}

export function getJsonDiff(a: string | object, b: string | object) {
  return diffJson(a, b);
}
