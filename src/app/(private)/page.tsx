"use client";

import * as React from "react";
import { getChartData, getSummary } from "@/api";
import { Card } from "@/components/card";
import { ErrorPage } from "@/components/error-page";
import { FuelChart } from "@/components/fuel-chart";
import { OemChart } from "@/components/oem-chart";
import { RegistrationYearChart } from "@/components/registration-year-chart";
import { Skeleton } from "@/components/skeleton";
import { Statistic } from "@/components/statistic";
import { formatCurrency, formatNumber } from "@/lib/intl";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";

function Content(props: {
  count: React.ReactNode;
  oems: React.ReactNode;
  value: React.ReactNode;
  oemChart: React.ReactNode;
  fuelChart: React.ReactNode;
  yearChart: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {props.count}
        {props.oems}
        {props.value}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 last:*:col-span-1 md:grid-cols-2 md:last:*:col-span-2">
        {props.oemChart}
        {props.fuelChart}
        {props.yearChart}
      </section>
    </div>
  );
}

export default function HomePage() {
  const query = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const [summary, fuelChart, oemChart, yearChart] = await Promise.all([
        getSummary(),
        getChartData("FUEL_TYPE"),
        getChartData("OEM"),
        getChartData("REGISTRATION_YEAR"),
      ]);
      return { summary, fuelChart, oemChart, yearChart };
    },
  });

  if (query.isPending) {
    return (
      <Content
        count={<Skeleton className="h-[120px]" />}
        oems={<Skeleton className="h-[120px]" />}
        value={<Skeleton className="h-[120px]" />}
        oemChart={<Skeleton className="h-[300px]" />}
        fuelChart={<Skeleton className="h-[300px]" />}
        yearChart={<Skeleton className="h-[300px]" />}
      />
    );
  }

  if (query.isError) {
    return <ErrorPage message={query.error.message} onRetry={query.refetch} />;
  }

  return (
    <Content
      count={
        <Statistic
          label="Vehicles in stock"
          value={formatNumber(query.data.summary.count)}
        />
      }
      oems={
        <Statistic
          label="Unique OEMs"
          value={formatNumber(query.data.summary.oems)}
        />
      }
      value={
        <Statistic
          label="Stock value"
          value={formatCurrency(query.data.summary.value, {
            notation: "compact",
          })}
        />
      }
      oemChart={<OemChart data={query.data.oemChart} />}
      fuelChart={<FuelChart data={query.data.fuelChart} />}
      yearChart={<RegistrationYearChart data={query.data.yearChart} />}
    />
  );
}
