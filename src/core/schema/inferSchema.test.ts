import { describe, expect, it } from "vitest";
import { inferSchema } from "./inferSchema";

describe("inferSchema", () => {
  it("marks fields missing from some array items as optional", () => {
    const schema = inferSchema([{ id: 1, name: "Ada" }, { id: 2 }]);
    expect(schema.children).toEqual([
      { key: "id", type: "number", optional: false },
      { key: "name", type: "string", optional: true },
    ]);
  });
});
