import { describe, expect, it } from "vitest";
import { getBatchOutputName } from "./batch";

describe("batch file naming", () => {
  it("preserves relative folders while changing the output extension", () => {
    expect(getBatchOutputName("fixtures/users.json", "json-toon")).toBe(
      "fixtures/users.toon",
    );
  });

  it("adds an extension when the input file has none", () => {
    expect(getBatchOutputName("fixtures/users", "toon-json")).toBe(
      "fixtures/users.json",
    );
  });
});
