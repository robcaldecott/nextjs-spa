import { expect, test } from "@playwright/test";
import { mockUser } from "./mocks";

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    { name: "token", value: "123", path: "/", domain: "localhost" },
  ]);

  await page.route("**/api/me", async (route) => {
    await route.fulfill({ json: mockUser });
  });
});

test("vehicles", async ({ page }) => {
  // Mock out the vehicles endpoint
  await page.route("**/api/vehicles?*", async (route) => {
    await route.fulfill({
      json: {
        summary: {
          total: 100,
          totalPages: 10,
          page: 1,
          pageSize: 10,
        },
        vehicles: [...Array(10).keys()].map((i) => ({
          id: String(i),
          vrm: `VRM${i + 1}`,
          manufacturer: `Manufacturer`,
          model: `Model`,
          type: `Type`,
          color: `black`,
          fuel: `Gasoline`,
          price: "29999",
        })),
      },
    });
  });

  await page.goto("/vehicles");

  await expect(
    page.getByLabel("breadcrumb").getByRole("link", { name: "Home" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("breadcrumb").getByRole("link", { name: "Vehicles" }),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Inventory" })).toBeVisible();
  await expect(page.getByText("100")).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeVisible();

  await expect(page.getByRole("table").getByRole("row")).toHaveCount(11);

  // Check headers
  const headingRow = page.getByRole("row").nth(0);
  await expect(
    headingRow.getByRole("cell", { name: "Registration" }),
  ).toBeVisible();
  await expect(
    headingRow.getByRole("cell", { name: "Manufacturer", exact: true }),
  ).toBeVisible();
  await expect(
    headingRow.getByRole("cell", { name: "Description" }),
  ).toBeVisible();
  await expect(headingRow.getByRole("cell", { name: "Fuel" })).toBeVisible();
  await expect(headingRow.getByRole("cell", { name: "Price" })).toBeVisible();

  // Check the first table row
  const firstRow = page.getByRole("row").nth(1);
  await expect(firstRow.getByRole("link", { name: "VRM1" })).toHaveAttribute(
    "href",
    "/vehicles/details?id=0",
  );
  await expect(
    firstRow.getByRole("cell", { name: "Manufacturer" }),
  ).toBeVisible();
  await expect(
    firstRow.getByRole("cell", { name: "Model Type" }),
  ).toBeVisible();
  await expect(firstRow.getByRole("cell", { name: "Petrol" })).toBeVisible();
  await expect(firstRow.getByRole("cell", { name: "£29,999" })).toBeVisible();

  // Paginsation should be visible
  await expect(page.getByText("Page 1 of 10")).toBeVisible();
  await expect(page.getByRole("button", { name: "Prev" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next" })).toBeEnabled();
});

test("no results", async ({ page }) => {
  await page.route("**/api/vehicles?*", async (route) => {
    await route.fulfill({
      json: {
        summary: {
          total: 0,
          totalPages: 0,
          page: 1,
          pageSize: 10,
        },
        vehicles: [],
      },
    });
  });

  await page.goto("/vehicles");

  await expect(
    page.getByRole("heading", { name: "No results found" }),
  ).toBeVisible();
  await expect(page.getByText("Try adjusting your search")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Clear filters" }),
  ).toBeVisible();
});

test("no pagination", async ({ page }) => {
  await page.route("**/api/vehicles?*", async (route) => {
    await route.fulfill({
      json: {
        summary: {
          total: 1,
          totalPages: 1,
          page: 1,
          pageSize: 10,
        },
        vehicles: [
          {
            id: "1",
            vrm: "VRM1",
            manufacturer: "Manufacturer",
            model: "Model",
            type: "Type",
            color: "black",
            fuel: "Gasoline",
            price: "29999",
          },
        ],
      },
    });
  });

  await page.goto("/vehicles");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
  // No paginsation
  await expect(
    page.getByRole("navigation", { name: "Pagination" }),
  ).not.toBeVisible();
});

test("last page", async ({ page }) => {
  await page.route("**/api/vehicles?*", async (route) => {
    await route.fulfill({
      json: {
        summary: {
          total: 30,
          totalPages: 3,
          page: 3,
          pageSize: 10,
        },
        vehicles: [
          {
            id: "1",
            vrm: "VRM1",
            manufacturer: "Manufacturer",
            model: "Model",
            type: "Type",
            color: "black",
            fuel: "Gasoline",
            price: "29999",
          },
        ],
      },
    });
  });

  await page.goto("/vehicles");

  await expect(page.getByText("Page 3 of 3")).toBeVisible();
  await expect(page.getByRole("button", { name: "Prev" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
});

test("search", async ({ page }) => {
  await page.route("**/api/vehicles?*", async (route) => {
    await route.fulfill({
      json: {
        summary: {
          total: 1,
          totalPages: 1,
          page: 1,
          pageSize: 10,
        },
        vehicles: [
          {
            id: "1",
            vrm: "VRM1",
            manufacturer: "Manufacturer",
            model: "Model",
            type: "Type",
            color: "black",
            fuel: "Gasoline",
            price: "29999",
          },
        ],
      },
    });
  });

  await page.goto("/vehicles");

  await page.getByRole("searchbox").fill("test");
  await page.keyboard.press("Enter");

  // Check the URL
  await expect(page).toHaveURL("/vehicles?page=1&q=test");
});
