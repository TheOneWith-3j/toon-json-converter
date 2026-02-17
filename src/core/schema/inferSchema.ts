// Infer schema from JSON value
export interface SchemaNode {
  key: string;
  type: string;
  children?: SchemaNode[];
  optional?: boolean;
}

export function inferSchema(value: any, key = "root"): SchemaNode {
  if (Array.isArray(value)) {
    return {
      key,
      type: "array",
      children: value.length > 0 ? [inferSchema(value[0])] : [],
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
