// Infer schema from JSON value
export interface SchemaNode {
  key: string;
  type: string;
  children?: SchemaNode[];
  optional?: boolean;
}

export function inferSchema(value: unknown, key = "root"): SchemaNode {
  if (Array.isArray(value)) {
    const objects = value.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    );
    if (objects.length > 0) {
      const keys = new Set(objects.flatMap((item) => Object.keys(item)));
      return {
        key,
        type: "array",
        children: [...keys].map((childKey) => {
          const presentValues = objects
            .filter((item) => childKey in item)
            .map((item) => item[childKey]);
          const child = inferSchema(presentValues[0], childKey);
          return { ...child, optional: presentValues.length < objects.length };
        }),
      };
    }
    return {
      key,
      type: "array",
      children: value.length > 0 ? [inferSchema(value[0], "item")] : [],
    };
  }
  if (typeof value === "object" && value !== null) {
    return {
      key,
      type: "object",
      children: Object.entries(value).map(([k, v]) => inferSchema(v, k)),
    };
  }
  return {
    key,
    type: typeof value,
  };
}
