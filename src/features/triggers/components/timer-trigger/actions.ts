"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { timerTriggerChannel } from "@/inngest/channels/timer-trigger";
import { inngest } from "@/inngest/client";

export type TimerTriggerToken = Realtime.Token<
  typeof timerTriggerChannel,
  ["status"]
>;

export async function fetchTimerTriggerRealtimeToken(): Promise<TimerTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: timerTriggerChannel(),
    topics: ["status"],
  });

  return token;
}
