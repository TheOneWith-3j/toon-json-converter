import { encodeToon, decodeToon } from "./toon";
import { describe, it, expect } from "vitest";

describe("TOON codec", () => {
  it("should encode and decode JSON correctly", () => {
    const json = { foo: "bar", arr: [1, 2, 3] };
    const toon = encodeToon(json);
    const decoded = decodeToon(toon);
    expect(decoded).toEqual(json);
  });

  it("round-trips nested objects, tabular arrays, and mixed types", () => {
    const json = {
      user: { id: 42, name: "Ada Lovelace", active: true, notes: null },
      items: [
        { sku: "A-1", qty: 12, price: 9.99 },
        { sku: "B-2", qty: 4, price: -1.5 },
      ],
      tags: ["alpha", "beta", "gamma"],
      empty: {},
      emptyArr: [],
    };
    const toon = encodeToon(json);
    expect(decodeToon(toon)).toEqual(json);
  });

  it("round-trips strings needing quoting and unicode content", () => {
    const json = {
      quoted: 'has "quotes" and, commas',
      colonValue: "10:30",
      unicode: "héllo wörld 日本語 🎉",
      newline: "line one\nline two",
    };
    const toon = encodeToon(json);
    expect(decodeToon(toon)).toEqual(json);
  });

  it("produces real TOON syntax rather than passing through JSON", () => {
    const toon = encodeToon({ id: 1, name: "Ada" });
    expect(toon).not.toContain("{");
    expect(toon).toContain("id: 1");
    expect(toon).toContain("name: Ada");
  });

  it("rejects malformed TOON input", () => {
    expect(() => decodeToon("users[2]:\n  - id: 1")).toThrow(
      /Expected 2 list array items/,
    );
  });
});
