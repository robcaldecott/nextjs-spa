"use client";

import {
  createVehicle,
  getColors,
  getManufacturers,
  getModels,
  getTypes,
} from "@/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Card, CardContent, CardFooter } from "@/components/card";
import { ErrorPage } from "@/components/error-page";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { LoadingButton } from "@/components/loading-button";
import { Select } from "@/components/select";
import { Separator } from "@/components/separator";
import { Skeleton } from "@/components/skeleton";
import { getColorName } from "@/lib/color";
import { Vehicle, VehicleFormData } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["add"],
    queryFn: async () => {
      const [manufacturers, models, types, colors] = await Promise.all([
        getManufacturers(),
        getModels(),
        getTypes(),
        getColors(),
      ]);
      return { manufacturers, models, types, colors };
    },
  });

  const mutation = useMutation<Vehicle, Error, VehicleFormData>({
    mutationFn: createVehicle,
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
            <BreadcrumbPage>Add Vehicle</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);

          mutation.mutate(
            {
              vrm: formData.get("vrm") as string,
              manufacturer: formData.get("manufacturer") as string,
              model: formData.get("model") as string,
              type: formData.get("type") as string,
              color: formData.get("color") as string,
              fuel: formData.get("fuel") as string,
              mileage: Number(formData.get("mileage")),
              price: formData.get("price") as string,
              registrationDate: formData.get("registrationDate") as string,
              vin: formData.get("vin") as string,
            },
            {
              onSuccess: (data) => {
                router.push(`/vehicles/details?id=${data.id}`);
              },
            },
          );
        }}
      >
        <Card>
          <CardContent className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* VRM */}
            <div className="space-y-1">
              <Label htmlFor="vrm">Registration number</Label>
              <Input id="vrm" name="vrm" type="text" required />
            </div>

            <Separator className="col-span-full" />

            {/* Manufacturer */}
            <div className="col-start-1 space-y-1">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select
                id="manufacturer"
                name="manufacturer"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a manufacturer
                </option>
                {query.data.manufacturers.map((manufacturer) => (
                  <option key={manufacturer}>{manufacturer}</option>
                ))}
              </Select>
            </div>

            {/* Model */}
            <div className="space-y-1">
              <Label htmlFor="model">Model</Label>
              <Select id="model" name="model" defaultValue="" required>
                <option value="" disabled>
                  Select a model
                </option>
                {query.data.models.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <Label htmlFor="type">Type</Label>
              <Select id="type" name="type" defaultValue="" required>
                <option value="" disabled>
                  Select a type
                </option>
                {query.data.types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>
            </div>

            {/* Color */}
            <div className="space-y-1">
              <Label htmlFor="color">Colour</Label>
              <Select id="color" name="color" defaultValue="" required>
                <option value="" disabled>
                  Select a colour
                </option>
                {query.data.colors.map((color) => (
                  <option key={color}>{getColorName(color)}</option>
                ))}
              </Select>
            </div>

            {/* Fuel type */}
            <div className="space-y-1">
              <Label htmlFor="fuel">Fuel</Label>
              <Select id="fuel" name="fuel" defaultValue="" required>
                <option value="" disabled>
                  Select a fuel type
                </option>
                <option value="Gasoline">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
            </div>

            {/* Mileage */}
            <div className="space-y-1">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="text"
                inputMode="numeric"
                required
                pattern="\d*"
                title="Only whole numbers are allowed"
              />
            </div>

            {/* Registration date */}
            <div className="space-y-1">
              <Label htmlFor="registrationDate">Registration date</Label>
              <Input
                id="registrationDate"
                name="registrationDate"
                type="date"
                required
              />
            </div>

            {/* VIN */}
            <div className="space-y-1">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" name="vin" type="text" required />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="text"
                inputMode="numeric"
                required
                pattern="\d*"
                title="Only whole numbers are allowed"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <LoadingButton type="submit" loading={mutation.isPending}>
              Add
            </LoadingButton>
          </CardFooter>

          {mutation.isError && (
            <CardFooter>
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>{mutation.error.message}</AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
      </form>
    </>
  );
}
