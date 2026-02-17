import { detectInputType } from "./detect";
import { describe, it, expect } from "vitest";

describe("detectInputType", () => {
  it("detects JSON", () => {
    expect(detectInputType('{"a":1}')).toBe("json");
  });
  it("detects TOON", () => {
    const toon = "a: 1";
    expect(detectInputType(toon)).toBe("toon");
  });
  it("detects unknown", () => {
    expect(detectInputType("not valid")).toBe("unknown");
  });
});
