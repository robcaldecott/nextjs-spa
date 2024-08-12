import { expect, test } from "@playwright/test";
import {
  mockFuelChartData,
  mockOemChartData,
  mockRegistrationChartData,
  mockSummary,
  mockUser,
} from "./mocks";

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    { name: "token", value: "123", path: "/", domain: "localhost" },
  ]);

  await page.route("**/api/me", async (route) => {
    await route.fulfill({ json: mockUser });
  });

  await page.route("**/api/summary", async (route) => {
    await route.fulfill({ json: mockSummary });
  });

  await page.route("**/api/chart?type=FUEL_TYPE", async (route) => {
    await route.fulfill({ json: mockFuelChartData });
  });

  await page.route("**/api/chart?type=OEM", async (route) => {
    await route.fulfill({ json: mockOemChartData });
  });

  await page.route("**/api/chart?type=REGISTRATION_YEAR", async (route) => {
    await route.fulfill({ json: mockRegistrationChartData });
  });

  await page.goto("/");
});

test("light mode", async ({ page }) => {
  await page.getByRole("button", { name: "Mode toggle" }).click();
  await page.getByRole("menuitem", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveClass("light");
});

test("dark mode", async ({ page }) => {
  await page.getByRole("button", { name: "Mode toggle" }).click();
  await page.getByRole("menuitem", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveClass("dark");
});
