import { Loader2 } from "lucide-react";

export function AppLoading() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <Loader2 className="size-10 animate-spin text-primary" />
      <h1 className="text-sm">Loading...</h1>
    </main>
  );
}
