import ky from "ky";
import type {
  Chart,
  Session,
  Summary,
  User,
  Vehicle,
  VehicleFormData,
  VehicleList,
} from "./types";

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  retry: 0,
});

export async function login(email: string, password: string) {
  const user: Session = await api
    .post("login", { json: { email, password } })
    .json();
  return user;
}

export async function getUser() {
  const user: User = await api.get("me").json();
  return user;
}

export async function getSummary() {
  const summary: Summary = await api.get("summary").json();
  return summary;
}

export async function getChartData(
  type: "FUEL_TYPE" | "OEM" | "REGISTRATION_YEAR",
) {
  const chartData: Array<Chart> = await api
    .get("chart", {
      searchParams: { type },
    })
    .json();
  return chartData;
}

export async function getVehicles(page: number, q: string) {
  const vehicles: VehicleList = await api
    .get("vehicles", { searchParams: { page, q } })
    .json();
  return vehicles;
}

export async function getVehicle(id: string) {
  const vehicle: Vehicle = await api.get(`vehicles/${id}`).json();
  return vehicle;
}

export async function deleteVehicle(id: string) {
  const result = await api.delete(`vehicles/${id}`).json();
  return result;
}

export async function getManufacturers() {
  const manufacturers: Array<string> = await api.get("manufacturers").json();
  return manufacturers;
}

export async function getModels() {
  const models: Array<string> = await api.get("models").json();
  return models;
}

export async function getTypes() {
  const types: Array<string> = await api.get("types").json();
  return types;
}

export async function getColors() {
  const colors: Array<string> = await api.get("colors").json();
  return colors;
}

export async function createVehicle(body: VehicleFormData) {
  const vehicle: Vehicle = await api.post("vehicles", { json: body }).json();
  return vehicle;
}
