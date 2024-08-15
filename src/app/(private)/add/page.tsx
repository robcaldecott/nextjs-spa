"use client";

import { Form, useForm } from "react-hook-form";
import {
  createVehicle,
  getColors,
  getManufacturers,
  getModels,
  getTypes,
} from "@/api";
import { Vehicle, VehicleFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
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
import { FormError } from "@/components/form-error";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { LoadingButton } from "@/components/loading-button";
import { Select } from "@/components/select";
import { Separator } from "@/components/separator";
import { Skeleton } from "@/components/skeleton";
import { getColorName } from "@/lib/color";

const schema = z.object({
  vrm: z.string().min(1, "Registration number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  color: z.string().min(1, "Color is required"),
  fuel: z.string().min(1, "Fuel type is required"),
  mileage: z
    .number({
      required_error: "Mileage is required",
      invalid_type_error: "Mileage is required",
    })
    .int(),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price is required",
    })
    .int(),
  registrationDate: z.string().min(1, "Registration date is required"),
  vin: z.string().min(1, "VIN is required"),
});

type AddFormData = z.infer<typeof schema>;

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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddFormData>({ resolver: zodResolver(schema) });

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
        onSubmit={handleSubmit((data) => {
          mutation.mutate(
            { ...data, price: String(data.price) },
            {
              onSuccess: (data) => {
                router.push(`/vehicles/details?id=${data.id}`);
              },
            },
          );
        })}
      >
        <Card>
          <CardContent className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* VRM */}
            <div className="space-y-1">
              <Label htmlFor="vrm">Registration number</Label>
              <Input id="vrm" type="text" {...register("vrm")} />
              {errors.vrm && <FormError>{errors.vrm.message}</FormError>}
            </div>

            <Separator className="col-span-full" />

            {/* Manufacturer */}
            <div className="col-start-1 space-y-1">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select
                id="manufacturer"
                defaultValue=""
                {...register("manufacturer")}
              >
                <option value="" disabled>
                  Select a manufacturer
                </option>
                {query.data.manufacturers.map((manufacturer) => (
                  <option key={manufacturer}>{manufacturer}</option>
                ))}
              </Select>
              {errors.manufacturer && (
                <FormError>{errors.manufacturer.message}</FormError>
              )}
            </div>

            {/* Model */}
            <div className="space-y-1">
              <Label htmlFor="model">Model</Label>
              <Select id="model" defaultValue="" {...register("model")}>
                <option value="" disabled>
                  Select a model
                </option>
                {query.data.models.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </Select>
              {errors.model && <FormError>{errors.model.message}</FormError>}
            </div>

            {/* Type */}
            <div className="space-y-1">
              <Label htmlFor="type">Type</Label>
              <Select id="type" defaultValue="" {...register("type")}>
                <option value="" disabled>
                  Select a type
                </option>
                {query.data.types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Select>
              {errors.type && <FormError>{errors.type.message}</FormError>}
            </div>

            {/* Color */}
            <div className="space-y-1">
              <Label htmlFor="color">Colour</Label>
              <Select id="color" defaultValue="" {...register("color")}>
                <option value="" disabled>
                  Select a colour
                </option>
                {query.data.colors.map((color) => (
                  <option key={color}>{getColorName(color)}</option>
                ))}
              </Select>
              {errors.color && <FormError>{errors.color.message}</FormError>}
            </div>

            {/* Fuel type */}
            <div className="space-y-1">
              <Label htmlFor="fuel">Fuel</Label>
              <Select id="fuel" defaultValue="" {...register("fuel")}>
                <option value="" disabled>
                  Select a fuel type
                </option>
                <option value="Gasoline">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </Select>
              {errors.fuel && <FormError>{errors.fuel.message}</FormError>}
            </div>

            {/* Mileage */}
            <div className="space-y-1">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="text"
                inputMode="numeric"
                {...register("mileage", { valueAsNumber: true })}
              />
              {errors.mileage && (
                <FormError>{errors.mileage.message}</FormError>
              )}
            </div>

            {/* Registration date */}
            <div className="space-y-1">
              <Label htmlFor="registrationDate">Registration date</Label>
              <Input
                id="registrationDate"
                type="date"
                {...register("registrationDate")}
              />
              {errors.registrationDate && (
                <FormError>{errors.registrationDate.message}</FormError>
              )}
            </div>

            {/* VIN */}
            <div className="space-y-1">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" type="text" {...register("vin")} />
              {errors.vin && <FormError>{errors.vin.message}</FormError>}
            </div>

            {/* Price */}
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <FormError>{errors.price.message}</FormError>}
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
