import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import type { Chart } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import type { ChartConfig } from "./chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";

export function OemChart(props: { data: Array<Chart> }) {
  const top5oems = props.data.sort((a, b) => b.value - a.value).slice(0, 5);
  const oemChartConfig: ChartConfig = top5oems.reduce(
    (acc, data) => ({ ...acc, [data.key]: { label: data.key } }),
    { oems: { label: "Value" } },
  );

  const oemChartData = top5oems.map((data) => ({
    ...data,
    fill: "hsl(var(--primary))",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 OEMs</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={oemChartConfig} className="max-h-[300px]">
          <BarChart
            accessibilityLayer
            data={oemChartData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="key"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" nameKey="oems" />}
            />
            <Bar dataKey="value" layout="vertical" radius={16}>
              <LabelList
                dataKey="key"
                position="insideLeft"
                offset={16}
                className="fill-primary-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
