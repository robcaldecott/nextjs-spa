import type * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";

export function Pagination(props: React.ComponentProps<"nav">) {
  return (
    <nav role="navigation" aria-label="Pagination" {...props}>
      {props.children}
    </nav>
  );
}

export function PaginationContent(props: React.ComponentProps<"ul">) {
  return (
    <ul
      className="flex flex-wrap items-center justify-end gap-4 p-4"
      {...props}
    >
      {props.children}
    </ul>
  );
}

export function PaginationItem({
  variant,
  className,
  ...props
}: React.ComponentProps<"li"> & { variant: "summary" | "button" }) {
  return (
    <li
      className={cn(
        className,
        variant === "summary" && "w-full grow sm:w-auto",
        variant === "button" && "grow sm:grow-0",
      )}
      {...props}
    >
      {props.children}
    </li>
  );
}

export function PaginationSummary({
  page,
  totalPages,
  className,
  ...props
}: React.ComponentProps<"p"> & { page: number; totalPages: number }) {
  return (
    <p className={cn("text-center text-sm sm:text-left", className)} {...props}>
      Page {page} of {totalPages}
    </p>
  );
}

function PaginationButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("w-full gap-1", className)}
      {...props}
    />
  );
}

export function PaginationPrevious(
  props: Omit<React.ComponentProps<typeof Button>, "children">,
) {
  return (
    <PaginationButton aria-label="Go to previous page" {...props}>
      <ChevronLeft className="size-4" />
      <span>Previous</span>
    </PaginationButton>
  );
}

export function PaginationNext(
  props: Omit<React.ComponentProps<typeof Button>, "children">,
) {
  return (
    <PaginationButton aria-label="Go to next page" {...props}>
      <span>Next</span>
      <ChevronRight className="size-4" />
    </PaginationButton>
  );
}
