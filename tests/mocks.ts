import type { Chart, Summary, User } from "../src/types";

export const mockUser: User = {
  id: "1",
  name: "Jane Doe",
  email: "jane.doe@company.com",
  avatar: "https://avatars.githubusercontent.com/u/2245692",
};

export const mockSummary: Summary = { count: 104, oems: 30, value: 2943354 };

export const mockFuelChartData: Array<Chart> = [
  {
    key: "petrol",
    value: 25,
  },
  {
    key: "diesel",
    value: 19,
  },
  {
    key: "hybrid",
    value: 34,
  },
  {
    key: "electric",
    value: 26,
  },
];

export const mockOemChartData: Array<Chart> = [
  {
    key: "Aston Martin",
    value: 5,
  },
  {
    key: "Audi",
    value: 2,
  },
  {
    key: "Bentley",
    value: 3,
  },
  {
    key: "BMW",
    value: 4,
  },
  {
    key: "Bugatti",
    value: 5,
  },
];

export const mockRegistrationChartData: Array<Chart> = [
  {
    key: "2014",
    value: 2,
  },
  {
    key: "2015",
    value: 7,
  },
  {
    key: "2016",
    value: 10,
  },
  {
    key: "2017",
    value: 10,
  },
  {
    key: "2018",
    value: 11,
  },
  {
    key: "2019",
    value: 8,
  },
  {
    key: "2020",
    value: 8,
  },
  {
    key: "2021",
    value: 14,
  },
  {
    key: "2022",
    value: 14,
  },
  {
    key: "2023",
    value: 11,
  },
  {
    key: "2024",
    value: 9,
  },
];
