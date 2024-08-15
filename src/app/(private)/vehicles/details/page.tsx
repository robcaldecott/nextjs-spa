"use client";

import * as React from "react";
import { deleteVehicle, getVehicle } from "@/api";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { ErrorPage } from "@/components/error-page";
import { LoadingButton } from "@/components/loading-button";
import { Separator } from "@/components/separator";
import { Skeleton } from "@/components/skeleton";
import { getColorName, getWebColor } from "@/lib/color";
import { formatCurrency, formatNumber } from "@/lib/intl";
import { fuelLabels } from "@/lib/labels";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function DeleteButton(props: { vehicleId: string }) {
  const router = useRouter();
  const mutation = useMutation<unknown, Error, string>({
    mutationFn: (id) => deleteVehicle(id),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this vehicle?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            vehicle from your stock inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            loading={mutation.isPending}
            onClick={() => {
              mutation.mutate(props.vehicleId, {
                onSuccess: () => {
                  toast.success("Vehicle successfully deleted");
                  router.push("/");
                },
              });
            }}
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Detail(props: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold text-muted-foreground">{props.label}</dt>
      <dd className="mb-4 last:mb-0">{props.value}</dd>
    </>
  );
}

export default function DetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const query = useQuery({
    queryKey: ["details", id],
    queryFn: () => getVehicle(id),
    enabled: Boolean(id),
  });

  if (query.isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorPage message={query.error.message} onRetry={query.refetch} />;
  }

  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vehicles">Vehicles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{query.data.vrm}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{query.data.vrm}</CardTitle>
          <CardDescription>
            {query.data.manufacturer} {query.data.model}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <dl className="mt-6 text-base">
            <Detail label="Manufacturer" value={query.data.manufacturer} />
            <Detail label="Model" value={query.data.model} />
            <Detail label="Type" value={query.data.type} />
            <Detail label="Fuel" value={fuelLabels[query.data.fuel]} />
            <Detail
              label="Colour"
              value={
                <div className="flex items-center gap-1.5">
                  <div
                    className="size-4 shrink-0 rounded-full border"
                    style={{ backgroundColor: getWebColor(query.data.color) }}
                  />
                  <span>{getColorName(query.data.color)}</span>
                </div>
              }
            />
            <Detail label="Mileage" value={formatNumber(query.data.mileage)} />
            <Detail
              label="Price"
              value={formatCurrency(parseInt(query.data.price, 10), {
                minimumFractionDigits: 0,
              })}
            />
            <Detail
              label="Registration date"
              value={new Intl.DateTimeFormat("en-GB", {
                dateStyle: "long",
              }).format(new Date(query.data.registrationDate))}
            />
            <Detail label="VIN" value={query.data.vin} />
          </dl>
        </CardContent>
        <CardFooter>
          <DeleteButton vehicleId={id} />
        </CardFooter>
      </Card>
    </>
  );
}
