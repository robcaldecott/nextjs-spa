import type { BrowserContext, Page } from "@playwright/test";
import {
  mockFuelChartData,
  mockOemChartData,
  mockRegistrationChartData,
  mockSummary,
  mockUser,
} from "./mocks";

export async function mockAll(page: Page, context: BrowserContext) {
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
}
