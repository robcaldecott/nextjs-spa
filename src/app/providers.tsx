"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MockServiceWorker(props: { children: React.ReactNode }) {
  const initialised = React.useRef(false);
  const [loaded, setLoaded] = React.useState(() => {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_MSW === "true"
    ) {
      return false;
    }

    return true;
  });

  React.useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;

      if (
        process.env.NODE_ENV === "development" &&
        process.env.NEXT_PUBLIC_MSW === "true"
      ) {
        import("@/mocks/browser").then((module) => {
          module.enableMocking().then(() => {
            setLoaded(true);
          });
        });
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  return loaded ? props.children : null;
}

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <MockServiceWorker>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {props.children}
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </MockServiceWorker>
  );
}
