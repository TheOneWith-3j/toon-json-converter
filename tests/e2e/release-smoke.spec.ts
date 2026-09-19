import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto("/");
  expect(consoleErrors).toEqual([]);
});

test("converts a preset and verifies the comparison workflow", async ({ page }) => {
  await page.getByRole("combobox").nth(1).selectOption("User record");

  if (await page.getByRole("tab", { name: "Output" }).isVisible()) {
    await page.getByRole("tab", { name: "Output" }).click();
  }
  await expect(page.getByText("name: Ada Lovelace", { exact: true })).toBeVisible();
  await expect(page.getByText("Verified", { exact: true })).toBeVisible();
  await expect(page.getByText("Size delta")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Copy" })).toBeEnabled();
});

test("saves and searches a local project", async ({ page }) => {
  await page.getByRole("combobox").nth(1).selectOption("Inventory list");
  await page.getByPlaceholder("Project name").fill("Release smoke project");
  await page.getByRole("button", { name: "Save project" }).click();

  await expect(page.getByText("Project saved locally")).toBeVisible();
  await page.getByPlaceholder("Search projects").fill("release smoke");
  await expect(page.getByRole("button", { name: "Release smoke project" })).toBeVisible();
});

test("reports valid and invalid batch files", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.locator('input[type="file"][multiple]').setInputFiles([
    {
      name: "valid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"name":"Ada"}'),
    },
    {
      name: "broken.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not valid"),
    },
  ]);
  await downloadPromise;

  await expect(page.getByText("Batch report")).toBeVisible();
  await expect(page.getByText("valid.toon")).toBeVisible();
  await expect(page.getByText("Input type could not be detected")).toBeVisible();
});

test("toggles theme and exposes mobile editor tabs", async ({ page, isMobile }) => {
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  if (isMobile) {
    await expect(page.getByRole("tab", { name: "Input" })).toBeVisible();
    await page.getByRole("tab", { name: "Output" }).click();
    await expect(page.getByRole("tab", { name: "Output" })).toHaveAttribute("aria-selected", "true");
  }
});

test("typing a full multi-line JSON document lands character-for-character", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "synthetic touch-keyboard typing is unreliable in emulated mobile browsers",
  );
  const json = JSON.stringify(
    {
      company: "Ada & Sons, Inc.",
      tags: ["tech", "café"],
      employees: [
        { id: 1, name: "Grace Hopper", roles: ["engineer", "admiral"] },
        { id: 2, name: "Alan Turing" },
      ],
    },
    null,
    2,
  );

  const input = page.locator(".editor-card.is-input .cm-content");
  await input.click();
  await page.keyboard.type(json, { delay: 2 });

  await expect(input).toHaveText(json.replace(/\n/g, ""));
  await expect(page.getByText("Verified", { exact: true })).toBeVisible();
});
