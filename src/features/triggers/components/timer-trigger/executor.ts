import type { NodeExecutor } from "@/features/executions/types";
import { timerTriggerChannel } from "@/inngest/channels/timer-trigger";

type TimerTriggerData = {
  mode?: "date" | "cycle";
  scheduledAt?: string;
  cronExpression?: string;
};

export const timerTriggerExecutor: NodeExecutor<TimerTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    timerTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  const result = await step.run("timer-trigger", async () => context);

  await publish(
    timerTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
