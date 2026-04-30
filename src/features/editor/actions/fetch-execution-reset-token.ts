"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { workflowExecutionStartedChannel } from "@/inngest/channels/workflow-execution-started";
import { inngest } from "@/inngest/client";

export type ExecutionResetToken = Realtime.Token<
  typeof workflowExecutionStartedChannel,
  ["started"]
>;

export async function fetchExecutionResetToken(): Promise<ExecutionResetToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: workflowExecutionStartedChannel(),
    topics: ["started"],
  });

  return token;
}
