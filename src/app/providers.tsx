"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";

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

function ClientProvider(props: { children: React.ReactNode }) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? props.children : null;
}

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  );

  return (
    <ClientProvider>
      <MockServiceWorker>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {props.children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </MockServiceWorker>
    </ClientProvider>
  );
}
