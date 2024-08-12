import * as React from "react";
import { cn } from "../lib/cn";

export const Select = React.forwardRef<
  React.ElementRef<"select">,
  React.ComponentPropsWithoutRef<"select">
>(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "bg-[image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE1Ljg4IDkuMjkgMTIgMTMuMTcgOC4xMiA5LjI5YS45OTYuOTk2IDAgMSAwLTEuNDEgMS40MWw0LjU5IDQuNTljLjM5LjM5IDEuMDIuMzkgMS40MSAwbDQuNTktNC41OWEuOTk2Ljk5NiAwIDAgMCAwLTEuNDFjLS4zOS0uMzgtMS4wMy0uMzktMS40MiAwWiIgLz48L3N2Zz4=)] bg-[length:20px_20px] bg-[position:right_12px_center] bg-no-repeat",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = "Select";
