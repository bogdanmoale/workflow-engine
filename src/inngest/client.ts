import { realtimeMiddleware } from "@inngest/realtime/middleware";
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "workflow-engine",
  middleware: [realtimeMiddleware()],
});
