import { describe, expect, it } from "vitest";
import { applyTransforms } from "./transformEngine";

describe("applyTransforms", () => {
  it("renames nested keys and prefixes values", () => {
    const result = applyTransforms(
      { users: [{ name: "Ada" }] },
      [
        { type: "rename", path: "users.name", newKey: "displayName" },
        { type: "prefix", path: "users.displayName", prefix: "@" },
      ],
    );
    expect(result).toEqual({ users: [{ displayName: "@Ada" }] });
  });

  it("filters array values", () => {
    const result = applyTransforms(
      { tags: ["keep", "remove"] },
      [{ type: "filter", path: "tags", include: ["keep"] }],
    );
    expect(result).toEqual({ tags: ["keep"] });
  });
});
