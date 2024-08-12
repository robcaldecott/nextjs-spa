import { expect, test } from "@playwright/test";
import {
  mockFuelChartData,
  mockOemChartData,
  mockRegistrationChartData,
  mockSummary,
  mockUser,
} from "./mocks";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/login", async (route) => {
    await route.fulfill({ json: { token: "123" } });
  });

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

test("login", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await expect(
    page.getByText("Enter your email below to login to your account."),
  ).toBeVisible();

  // Complete the form
  await page
    .getByRole("textbox", { name: "Email" })
    .fill("jane.doe@company.com");
  await page.getByLabel("Password").fill("password123");

  // Sign in
  await page.getByRole("button", { name: "Sign in" }).click();

  // We should end up on the home page
  await expect(
    page.getByRole("heading", { name: "Vehicle Manager" }),
  ).toBeVisible();
});

test("login errors", async ({ page }) => {
  await page.route("**/api/login", async (route) => {
    await route.fulfill({ status: 401 });
  });

  await page.goto("/login");

  await page
    .getByRole("textbox", { name: "Email" })
    .fill("jane.doe@company.com");
  await page.getByLabel("Password").fill("password123");

  // Sign in
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { name: "Oops!" })).toBeVisible();
  await expect(
    page.getByText("Request failed with status code 401"),
  ).toBeVisible();
});

test("logout", async ({ page, context }) => {
  // Add the session cookie
  await context.addCookies([
    { name: "token", value: "123", path: "/", domain: "localhost" },
  ]);

  // Navigate to the home page
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Vehicle Manager" }),
  ).toBeVisible();

  // Logout
  await page.getByRole("button", { name: "User menu" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();

  // Login page should appear
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});
