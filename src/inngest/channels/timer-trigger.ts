import { channel, topic } from "@inngest/realtime";

export const TIMER_TRIGGER_CHANNEL_NAME = "timer-trigger-execution";

export const timerTriggerChannel = channel(
  TIMER_TRIGGER_CHANNEL_NAME,
).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
