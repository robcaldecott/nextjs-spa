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
});

test("home", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Vehicle Manager" }),
  ).toBeVisible();

  // Side nax links
  await expect(page.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(page.getByRole("link", { name: "Vehicles" })).toHaveAttribute(
    "href",
    "/vehicles",
  );
  await expect(page.getByRole("link", { name: "Add vehicle" })).toHaveAttribute(
    "href",
    "/add",
  );

  // Statistics
  await expect(page.getByText("Vehicles in stock")).toBeVisible();
  await expect(page.getByRole("heading", { name: "104" })).toBeVisible();

  await expect(page.getByText("Unique OEMs")).toBeVisible();
  await expect(page.getByRole("heading", { name: "30" })).toBeVisible();

  await expect(page.getByText("Stock value")).toBeVisible();
  await expect(page.getByRole("heading", { name: "£2.9M" })).toBeVisible();

  // Charts
  await expect(page.getByRole("heading", { name: "Top 5 OEMs" })).toBeVisible();
  await expect(page.getByText("Aston Martin")).toBeVisible();
  await expect(page.getByText("Audi")).toBeVisible();
  await expect(page.getByText("Bugatti")).toBeVisible();
  await expect(page.getByText("Bentley")).toBeVisible();
  await expect(page.getByText("BMW")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Fuel Type Breakdown" }),
  ).toBeVisible();
  await expect(page.getByText("Petrol")).toBeVisible();
  await expect(page.getByText("Diesel")).toBeVisible();
  await expect(page.getByText("Hybrid")).toBeVisible();
  await expect(page.getByText("Electric")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Registrations By Year" }),
  ).toBeVisible();
  await expect(page.getByText("2014")).toBeVisible();
  await expect(page.getByText("2024")).toBeVisible();
});
