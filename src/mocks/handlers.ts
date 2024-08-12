import { fakerEN_GB as faker } from "@faker-js/faker";
import type { DefaultBodyType, PathParams, StrictResponse } from "msw";
import { delay, http, HttpResponse } from "msw";
import type {
  Chart,
  Session,
  Summary,
  User,
  Vehicle,
  VehicleFormData,
  VehicleList,
} from "../types";

const user: User = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatarGitHub(),
};

const vehicleCount = faker.number.int({ min: 75, max: 125 });

// Generate vehicle mocks
let vehicles: Array<Vehicle> = [...Array(vehicleCount).keys()].map(() => ({
  id: faker.string.uuid(),
  vrm: faker.vehicle.vrm(),
  manufacturer: faker.vehicle.manufacturer(),
  model: faker.vehicle.model(),
  type: faker.vehicle.type(),
  fuel: faker.vehicle.fuel(),
  color: faker.vehicle.color(),
  vin: faker.vehicle.vin(),
  mileage: faker.number.int({ min: 1000, max: 25000 }),
  registrationDate: faker.date.past({ years: 10 }).toISOString().split("T")[0],
  price: faker.commerce.price({ min: 2000, max: 50000 }),
}));

const DELAY = undefined;

export const handlers = [
  http.post<PathParams, { email: string; password: string }, Session>(
    `${process.env.NEXT_PUBLIC_API_URL}/login`,
    async ({ request }) => {
      await delay(DELAY);

      const body = await request.json();
      if (
        body.email === "jane.doe@company.com" &&
        body.password === "verystrongpassword"
      ) {
        return HttpResponse.json({ token: faker.string.uuid() });
      }

      return new HttpResponse(null, { status: 401 }) as StrictResponse<never>;
    },
  ),

  http.get<PathParams, DefaultBodyType, User>(
    `${process.env.NEXT_PUBLIC_API_URL}/me`,
    async () => {
      await delay(DELAY);

      return HttpResponse.json(user);
    },
  ),

  http.get<PathParams, DefaultBodyType, Summary>(
    `${process.env.NEXT_PUBLIC_API_URL}/summary`,
    async () => {
      await delay(DELAY);

      return HttpResponse.json({
        count: vehicles.length,
        oems: new Set(vehicles.map((vehicle) => vehicle.manufacturer)).size,
        value: vehicles.reduce(
          (total, vehicle) => total + Number(vehicle.price),
          0,
        ),
      });
    },
  ),

  http.get<PathParams, DefaultBodyType, Array<Chart>>(
    `${process.env.NEXT_PUBLIC_API_URL}/chart`,
    async ({ request }) => {
      await delay(DELAY);

      const url = new URL(request.url);
      const type = url.searchParams.get("type");

      if (type === "FUEL_TYPE") {
        return HttpResponse.json([
          {
            key: "petrol",
            value: vehicles.filter((v) => v.fuel === "Gasoline").length,
          },
          {
            key: "diesel",
            value: vehicles.filter((v) => v.fuel === "Diesel").length,
          },
          {
            key: "hybrid",
            value: vehicles.filter((v) => v.fuel === "Hybrid").length,
          },
          {
            key: "electric",
            value: vehicles.filter((v) => v.fuel === "Electric").length,
          },
        ]);
      }

      if (type === "OEM") {
        // Build a list of unique manufacturers
        const oems: Record<string, number> = {};

        for (let i = 0; i < vehicles.length; i++) {
          const vehicle = vehicles[i];
          if (typeof oems[vehicle.manufacturer] === "undefined") {
            oems[vehicle.manufacturer] = 1;
          } else {
            oems[vehicle.manufacturer]++;
          }
        }

        // Convert the object to an array
        return HttpResponse.json(
          Object.entries(oems)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => a.key.localeCompare(b.key)),
        );
      }

      if (type === "REGISTRATION_YEAR") {
        // Find the earliest year
        const minYear = Math.min(
          ...vehicles.map((v) => new Date(v.registrationDate).getFullYear()),
        );

        // Create a map of year > count
        const years: Record<number, number> = {};
        const thisYear = new Date().getFullYear();
        for (let i = minYear; i <= thisYear; i++) {
          years[i] = 0;
        }

        // Count the number of vehicles per year
        for (let i = 0; i < vehicles.length; i++) {
          const vehicle = vehicles[i];
          const year = new Date(vehicle.registrationDate).getFullYear();
          if (typeof years[year] === "undefined") {
            years[year] = 1;
          } else {
            years[year]++;
          }
        }

        return HttpResponse.json(
          Object.entries(years)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => a.key.localeCompare(b.key)),
        );
      }

      return HttpResponse.json([]);
    },
  ),

  http.get<PathParams, DefaultBodyType, VehicleList>(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicles`,
    async ({ request }) => {
      await delay(DELAY);

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page"));
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const q = url.searchParams.get("q");

      // Filter the results
      const filtered = vehicles.filter((vehicle) => {
        if (q) {
          if (vehicle.manufacturer.toLowerCase().includes(q.toLowerCase())) {
            return true;
          }
          if (vehicle.model.toLowerCase().includes(q.toLowerCase())) {
            return true;
          }
          if (vehicle.type.toLowerCase().includes(q.toLowerCase())) {
            return true;
          }
          return false;
        }
        return true;
      });

      return HttpResponse.json({
        summary: {
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / pageSize),
          page,
          pageSize,
        },
        vehicles: filtered.slice(start, end).map((vehicle) => ({
          id: vehicle.id,
          vrm: vehicle.vrm,
          manufacturer: vehicle.manufacturer,
          model: vehicle.model,
          type: vehicle.type,
          color: vehicle.color,
          fuel: vehicle.fuel,
          price: vehicle.price,
        })),
      });
    },
  ),

  http.get<PathParams, DefaultBodyType, Vehicle>(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicles/:id`,
    async ({ params }) => {
      await delay(DELAY);

      const vehicle = vehicles.find((v) => v.id === params.id);
      if (vehicle === undefined) {
        return new HttpResponse(null, { status: 404 }) as StrictResponse<never>;
      }
      return HttpResponse.json(vehicle);
    },
  ),

  http.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicles/:id`,
    async ({ params }) => {
      await delay(DELAY);

      // Remove the vehicle from the array
      vehicles = vehicles.filter((v) => v.id !== params.id);

      return HttpResponse.json({});
    },
  ),

  http.get<PathParams, DefaultBodyType, Array<string>>(
    `${process.env.NEXT_PUBLIC_API_URL}/manufacturers`,
    async () => {
      await delay(DELAY);

      // Build a set of manufacturers
      const manufacturers = new Set(
        vehicles.map((vehicle) => vehicle.manufacturer),
      );

      return HttpResponse.json(
        [...manufacturers].sort((a, b) => a.localeCompare(b)),
      );
    },
  ),

  http.get<PathParams, DefaultBodyType, Array<string>>(
    `${process.env.NEXT_PUBLIC_API_URL}/models`,
    async () => {
      await delay(DELAY);

      // Build a set of manufacturers
      const models = new Set(vehicles.map((vehicle) => vehicle.model));

      return HttpResponse.json([...models].sort((a, b) => a.localeCompare(b)));
    },
  ),

  http.get<PathParams, DefaultBodyType, Array<string>>(
    `${process.env.NEXT_PUBLIC_API_URL}/types`,
    async () => {
      await delay(DELAY);

      // Build a set of manufacturers
      const types = new Set(vehicles.map((vehicle) => vehicle.type));

      return HttpResponse.json([...types].sort((a, b) => a.localeCompare(b)));
    },
  ),

  http.get<PathParams, DefaultBodyType, Array<string>>(
    `${process.env.NEXT_PUBLIC_API_URL}/colors`,
    async () => {
      await delay(DELAY);

      // Build a set of manufacturers
      const colors = new Set(vehicles.map((vehicle) => vehicle.color));

      return HttpResponse.json([...colors].sort((a, b) => a.localeCompare(b)));
    },
  ),

  http.post<PathParams, VehicleFormData, Vehicle>(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicles`,
    async ({ request }) => {
      await delay(DELAY);

      const body = await request.json();
      const vehicle: Vehicle = { ...body, id: faker.string.uuid() };
      // Add to the array
      vehicles.push(vehicle);
      // Return the new vehicle
      return HttpResponse.json(vehicle);
    },
  ),
];
