import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { Chart } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import type { ChartConfig } from "./chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";

export function RegistrationYearChart(props: { data: Array<Chart> }) {
  const yearChartConfig: ChartConfig = { value: { label: "Vehicles" } };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrations By Year</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={yearChartConfig} className="max-h-80 w-full">
          <AreaChart
            accessibilityLayer
            data={props.data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ left: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area dataKey="value" type="linear" fill="url(#fill)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
