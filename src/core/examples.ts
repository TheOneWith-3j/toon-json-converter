export type ConversionExample = {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  json: unknown;
};

export const conversionExamples: ConversionExample[] = [
  {
    id: "user-record",
    name: "User record",
    description: "A small object with strings, a number, and a boolean.",
    bestFor: "Basic objects",
    json: { id: 42, name: "Ada Lovelace", active: true },
  },
  {
    id: "inventory-list",
    name: "Inventory list",
    description: "Uniform records can share one field header in TOON.",
    bestFor: "Arrays of uniform objects",
    json: {
      items: [
        { sku: "A-1", qty: 12, warehouse: "west" },
        { sku: "B-2", qty: 4, warehouse: "east" },
        { sku: "C-3", qty: 27, warehouse: "west" },
      ],
    },
  },
  {
    id: "event-payload",
    name: "Event payload",
    description: "A realistic nested event with user and order details.",
    bestFor: "Webhook and event data",
    json: {
      event: "checkout.completed",
      timestamp: "2026-09-14T12:00:00Z",
      order: { id: "ord_1042", total: 99.5, currency: "USD" },
      customer: { id: 42, tier: "standard" },
    },
  },
  {
    id: "service-config",
    name: "Service configuration",
    description: "Nested settings, arrays, and nullable values in one object.",
    bestFor: "Configuration and settings",
    json: {
      service: "search-api",
      retries: 3,
      features: { cache: true, tracing: false },
      regions: ["us-east", "eu-west"],
      fallback: null,
    },
  },
  {
    id: "primitive-arrays",
    name: "Primitive arrays",
    description: "Short lists of primitive values use TOON's inline form.",
    bestFor: "Tags, IDs, and simple lists",
    json: {
      tags: ["production", "payments", "priority"],
      ports: [3000, 8080, 8443],
      enabled: true,
    },
  },
  {
    id: "environment-map",
    name: "Environment map",
    description: "Keyed records demonstrate grouped environment settings.",
    bestFor: "Feature flags and environment maps",
    json: {
      environments: {
        production: { region: "eu-central-1", replicas: 6, debug: false },
        staging: { region: "eu-central-1", replicas: 2, debug: true },
      },
    },
  },
];