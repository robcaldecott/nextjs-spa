import { handlers } from "./handlers";

export async function enableMocking() {
  if (typeof window !== "undefined") {
    const { setupWorker } = require("msw/browser");
    const worker = setupWorker(...handlers);
    return worker.start({ onUnhandledRequest: "bypass" });
  }
}
