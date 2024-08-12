import { expect, test } from "@playwright/test";
import { mockAll } from "./helpers";

test.beforeEach(async ({ page, context }) => {
  await mockAll(page, context);

  await page.route("**/api/manufacturers", async (route) => {
    await route.fulfill({ json: ["Audi", "Ford"] });
  });

  await page.route("**/api/models", async (route) => {
    await route.fulfill({ json: ["A4", "Focus"] });
  });

  await page.route("**/api/types", async (route) => {
    await route.fulfill({ json: ["Saloon", "Coupe"] });
  });

  await page.route("**/api/colors", async (route) => {
    await route.fulfill({ json: ["black", "white"] });
  });
});

test("add", async ({ page }) => {
  await page.route("**/api/vehicles", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ json: { id: "1" } });
    }
  });

  await page.route("**/api/vehicles/1", async (route) => {
    await route.fulfill({
      json: {
        id: "1",
        vrm: "AB72 XYZ",
        manufacturer: "Ford",
        model: "Focus",
        type: "Saloon",
        fuel: "Gasoline",
        color: "black",
        vin: "1234567890",
        mileage: 10000,
        registrationDate: "2024-03-01",
        price: "19999",
      },
    });
  });

  await page.goto("/add");

  // Complete the form
  await page.getByLabel("Registration number").fill("AB72 XYZ");
  await page.getByLabel("Manufacturer").selectOption("Ford");
  await page.getByLabel("Model").selectOption("Focus");
  await page.getByLabel("Type").selectOption("Saloon");
  await page.getByLabel("Colour").selectOption("Black");
  await page.getByLabel("Fuel").selectOption("Petrol");
  await page.getByLabel("Mileage").fill("10000");
  await page.getByLabel("Registration date").fill("2024-03-01");
  await page.getByLabel("VIN").fill("XYZ");
  await page.getByLabel("Price").fill("19999");

  await page.getByRole("button", { name: "Add" }).click();

  // Vehicle details page should load
  await expect(page).toHaveURL("/vehicles/details?id=1");
  await expect(page.getByRole("heading", { name: "AB72 XYZ" })).toBeVisible();
});
