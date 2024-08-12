import type * as React from "react";
import { AlertCircle } from "lucide-react";

export function FormError(props: React.PropsWithChildren) {
  return (
    <div
      role="alert"
      className="flex items-center gap-1 text-sm text-destructive"
    >
      <AlertCircle className="size-4" />
      {props.children}
    </div>
  );
}
