import { describe, expect, it } from "vitest";
import { mergeProjectsByUpdatedAt } from "./merge";

describe("mergeProjectsByUpdatedAt", () => {
  it("adds cloud-only projects", () => {
    const result = mergeProjectsByUpdatedAt([], [{ id: "cloud-1", name: "Cloud", input: "{}", output: "", updatedAt: "2026-01-01T00:00:00.000Z" }]);
    expect(result.added).toBe(1);
    expect(result.projects).toHaveLength(1);
  });

  it("keeps newer local projects when cloud is older", () => {
    const result = mergeProjectsByUpdatedAt(
      [{ id: "same", name: "Local", input: "{\"a\":2}", output: "a: 2", updatedAt: "2026-01-02T00:00:00.000Z" }],
      [{ id: "same", name: "Cloud", input: "{\"a\":1}", output: "a: 1", updatedAt: "2026-01-01T00:00:00.000Z" }],
    );
    expect(result.conflicts).toBe(1);
    expect(result.updated).toBe(0);
    expect(result.projects[0].input).toBe('{"a":2}');
  });

  it("uses newer cloud projects during conflicts", () => {
    const result = mergeProjectsByUpdatedAt(
      [{ id: "same", name: "Local", input: "{\"a\":1}", output: "a: 1", updatedAt: "2026-01-01T00:00:00.000Z" }],
      [{ id: "same", name: "Cloud", input: "{\"a\":2}", output: "a: 2", updatedAt: "2026-01-02T00:00:00.000Z" }],
    );
    expect(result.conflicts).toBe(1);
    expect(result.updated).toBe(1);
    expect(result.projects[0].input).toBe('{"a":2}');
  });
});