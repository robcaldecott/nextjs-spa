"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";
import type { ButtonProps } from "./button";
import { Button } from "./button";

export interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export const LoadingButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  LoadingButtonProps
>(({ className, children, loading, onClick, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(loading && "relative cursor-not-allowed", className)}
      aria-disabled={loading}
      onClick={(event) => {
        if (!loading) {
          onClick?.(event);
        }
      }}
      {...props}
    >
      {loading ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin" />
          </span>
          <span className="invisible">{children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
});
LoadingButton.displayName = "LoadingButton";
