// Transform engine for JSON
export type TransformRule = {
  type: "rename" | "filter" | "prefix" | "map";
  path?: string;
  newKey?: string;
  include?: string[];
  exclude?: string[];
  prefix?: string;
  mapFn?: (value: unknown) => unknown;
};

export function applyTransforms(json: unknown, rules: TransformRule[]): unknown {
  const result = JSON.parse(JSON.stringify(json)) as Record<string, unknown>;
  for (const rule of rules) {
    const path = rule.path?.split(".").filter(Boolean) ?? [];
    const targets = getTargets(result, path);
    for (const target of targets) {
      if (rule.type === "rename" && rule.newKey && target.parent && target.key !== undefined) {
        setTarget(target.parent, rule.newKey, getTarget(target.parent, target.key));
        deleteTarget(target.parent, target.key);
      } else if (rule.type === "prefix" && rule.prefix && typeof target.value === "string") {
        if (target.parent) setTarget(target.parent, target.key, `${rule.prefix}${target.value}`);
      } else if (rule.type === "map" && rule.mapFn) {
        if (target.parent) setTarget(target.parent, target.key, rule.mapFn(target.value));
      } else if (rule.type === "filter" && Array.isArray(target.value)) {
        const filtered = target.value.filter((item: unknown) => {
          const included = rule.include?.includes(String(item));
          const excluded = rule.exclude?.includes(String(item));
          return (!rule.include || included) && (!rule.exclude || !excluded);
        });
        if (target.parent) setTarget(target.parent, target.key, filtered);
      } else if (rule.type === "filter" && target.parent && Array.isArray(target.parent)) {
        const include = rule.include?.includes(String(target.value));
        const exclude = rule.exclude?.includes(String(target.value));
        if ((rule.include && !include) || (rule.exclude && exclude)) {
          target.parent.splice(Number(target.key), 1);
        }
      }
    }
  }
  return result;
}

type Parent = Record<string, unknown> | unknown[];
type Target = { parent: Parent | null; key: string | number; value: unknown };

function getTargets(value: unknown, path: string[]): Target[] {
  const root: Record<string, unknown> = { value };
  return resolveTargets(root, "value", value, path);
}

function resolveTargets(parent: Parent | null, key: string | number, value: unknown, path: string[]): Target[] {
  if (path.length === 0) return [{ parent, key, value }];
  const [segment, ...rest] = path;
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => resolveTargets(value, index, item, path));
  }
  if (value && typeof value === "object" && segment in value) {
    const objectValue = value as Record<string, unknown>;
    return resolveTargets(objectValue, segment, objectValue[segment], rest);
  }
  return [];
}

function getTarget(parent: Parent, key: string | number): unknown {
  return Array.isArray(parent) ? parent[Number(key)] : parent[String(key)];
}

function setTarget(parent: Parent, key: string | number, value: unknown) {
  if (Array.isArray(parent)) parent[Number(key)] = value;
  else parent[String(key)] = value;
}

function deleteTarget(parent: Parent, key: string | number) {
  if (Array.isArray(parent)) parent.splice(Number(key), 1);
  else delete parent[String(key)];
}
