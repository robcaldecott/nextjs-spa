import type * as React from "react";
import { Card } from "./card";

export function Statistic(props: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <Card className="space-y-2 p-6">
      <p className="text-sm text-muted-foreground">{props.label}</p>
      <h2 className="text-4xl font-semibold tracking-tight">{props.value}</h2>
    </Card>
  );
}
