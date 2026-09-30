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
  const analytics = page
    .locator("section.workspace-panel")
    .filter({ has: page.getByRole("heading", { name: "Usage analytics" }) });
  await expect(analytics.getByText("100%", { exact: true })).toBeVisible();
  await expect(analytics.getByText("successful", { exact: false })).toBeVisible();
  await analytics.getByText("Direction and size details").click();
  await expect(analytics.getByText("JSON to TOON", { exact: true })).toBeVisible();
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
  const editor = page.locator(".cm-editor").first();
  const initialEditorBackground = await editor.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() => editor.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(initialEditorBackground);

  if (isMobile) {
    await expect(page.getByRole("tab", { name: "Input" })).toBeVisible();
    await page.getByRole("tab", { name: "Output" }).click();
    await expect(page.getByRole("tab", { name: "Output" })).toHaveAttribute("aria-selected", "true");
  }
});

test("uses editor tabs at tablet widths", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 });
  await expect(page.getByRole("tab", { name: "Input" })).toBeVisible();
  await expect(page.locator(".editor-card.is-output")).toBeHidden();

  await page.getByRole("tab", { name: "Output" }).click();
  await expect(page.locator(".editor-card.is-output")).toBeVisible();
  await expect(page.locator(".editor-card.is-input")).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
});

test("serves indexable guide and policy pages", async ({ page }) => {
  const routes = [
    ["/examples", "See how JSON becomes TOON"],
    ["/json-to-toon", "Convert JSON to TOON"],
    ["/toon-to-json", "Convert TOON to JSON"],
    ["/toon-vs-json", "TOON vs JSON: when to use each format"],
    ["/privacy", "Your data stays yours"],
    ["/contact", "Help improve the converter"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${route}/?$`),
    );
  }
});

test("contact form prepares a public feedback issue", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("What can we help with?").selectOption("Bug report");
  await page.getByLabel("Subject").fill("Example page issue");
  await page.getByLabel("Message").fill("The sample output should be clearer.");
  await page.getByRole("button", { name: "Prepare message" }).click();

  const submitLink = page.getByRole("link", { name: "Continue to GitHub to submit" });
  await expect(submitLink).toBeVisible();
  await expect(submitLink).toHaveAttribute("href", /issues\/new\?title=/);
});

test("keeps the selected theme across content-page navigation", async ({ page }) => {
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goto("/privacy");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Toggle color theme" })).toContainText("Light");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Examples" })
    .click();
  await expect(page).toHaveURL(/\/examples\/?$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
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
