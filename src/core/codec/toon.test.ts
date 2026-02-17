import { encodeToon, decodeToon } from "./toon";
import { describe, it, expect } from "vitest";

describe("TOON codec", () => {
  it("should encode and decode JSON correctly", () => {
    const json = { foo: "bar", arr: [1, 2, 3] };
    const toon = encodeToon(json);
    const decoded = decodeToon(toon);
    expect(decoded).toEqual(json);
  });
});
