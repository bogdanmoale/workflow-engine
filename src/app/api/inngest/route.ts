import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  executeWorkflow,
  scheduleDateTimer,
  scheduleCycleTimer,
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow, scheduleDateTimer, scheduleCycleTimer],
});
