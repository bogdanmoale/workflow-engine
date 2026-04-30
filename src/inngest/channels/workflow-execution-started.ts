import { channel, topic } from "@inngest/realtime";

export const WORKFLOW_EXECUTION_STARTED_CHANNEL = "workflow-execution-started";

export const workflowExecutionStartedChannel = channel(
  WORKFLOW_EXECUTION_STARTED_CHANNEL,
).addTopic(
  topic("started").type<{ workflowId: string; startedAt: string }>(),
);
