"use client";

import * as React from "react";
import { getVehicles } from "@/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Info, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ErrorPage } from "@/components/error-page";
import { Input } from "@/components/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "@/components/pagination";
import { Separator } from "@/components/separator";
import { Skeleton } from "@/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { getWebColor } from "@/lib/color";
import { formatCurrency } from "@/lib/intl";
import { fuelLabels } from "@/lib/labels";

export default function VehiclesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const q = searchParams.get("q") || "";
  const [search, setSearch] = React.useState(q);

  const query = useQuery({
    queryKey: ["vehicles", page, q],
    queryFn: () => getVehicles(page, q),
    placeholderData: keepPreviousData,
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

  const setSearchParams = (page: number, q: string) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("q", q);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Vehicles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <div className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex grow gap-2">
            <h2 className="text-xl font-semibold">Inventory</h2>
            <Badge variant="default">{query.data.summary.total}</Badge>
          </div>

          {/* Search field */}
          <form
            className="relative w-full sm:w-64"
            id="search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchParams(page, search);
            }}
          >
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              className="rounded-full pl-10 [&::-webkit-search-cancel-button]:hidden"
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search inventory"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <Separator />

        {query.data.summary.total === 0 && (
          <div className="flex flex-col items-center gap-4 p-6">
            <Info className="size-10 text-primary" />
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search
            </p>
            <Button
              variant="default"
              onClick={() => {
                router.push(pathname);
                setSearch("");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {query.data.summary.total > 0 && (
          <>
            <Table className="table-auto sm:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto lg:w-32">Registration</TableHead>
                  <TableHead className="w-auto lg:w-60">Manufacturer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-auto text-right lg:w-32">
                    Fuel
                  </TableHead>
                  <TableHead className="w-auto text-right lg:w-32">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Link
                        href={`/vehicles/details?id=${vehicle.id}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {vehicle.vrm}
                      </Link>
                    </TableCell>
                    <TableCell>{vehicle.manufacturer}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <div
                          className="size-5 shrink-0 rounded-full border"
                          style={{
                            backgroundColor: getWebColor(vehicle.color),
                          }}
                        />
                        <span>{`${vehicle.model} ${vehicle.type}`}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {fuelLabels[vehicle.fuel]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(parseInt(vehicle.price, 10), {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {query.data.summary.totalPages > 1 && (
              <>
                <Separator />

                {/* Pagination */}
                <Pagination>
                  <PaginationContent>
                    <PaginationItem variant="summary">
                      <PaginationSummary
                        page={query.data.summary.page}
                        totalPages={query.data.summary.totalPages}
                      />
                    </PaginationItem>
                    <PaginationItem variant="button">
                      <PaginationPrevious
                        disabled={query.data.summary.page === 1}
                        onClick={() =>
                          setSearchParams(query.data.summary.page - 1, q)
                        }
                      />
                    </PaginationItem>
                    <PaginationItem variant="button">
                      <PaginationNext
                        disabled={
                          query.data.summary.page ===
                          query.data.summary.totalPages
                        }
                        onClick={() =>
                          setSearchParams(query.data.summary.page + 1, q)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </>
        )}
      </Card>
    </>
  );
}
