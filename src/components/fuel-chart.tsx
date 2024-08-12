import { Pie, PieChart } from "recharts";
import type { Chart } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import type { ChartConfig } from "./chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

const fuelChartConfig = {
  petrol: {
    label: "Petrol",
    color: "hsl(var(--chart-1))",
  },
  diesel: {
    label: "Diesel",
    color: "hsl(var(--chart-2))",
  },
  hybrid: {
    label: "Hybrid",
    color: "hsl(var(--chart-3))",
  },
  electric: {
    label: "Electric",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function FuelChart(props: { data: Array<Chart> }) {
  const fuelChartData = props.data.map((data) => ({
    ...data,
    fill: `var(--color-${data.key})`,
  }));

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-center">Fuel Type Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={fuelChartConfig}
          className="mx-auto aspect-square max-h-[300px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="key" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/5 [&>*]:justify-center"
            />
            <Pie
              data={fuelChartData}
              innerRadius={60}
              dataKey="value"
              nameKey="key"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
