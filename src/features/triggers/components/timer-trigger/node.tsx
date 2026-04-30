"use client";

import { type NodeProps, useReactFlow } from "@xyflow/react";
import { TimerIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { TIMER_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/timer-trigger";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchTimerTriggerRealtimeToken } from "./actions";
import { TimerTriggerDialog } from "./dialog";

export const TimerTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeData = props.data as Record<string, unknown>;

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: TIMER_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchTimerTriggerRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: Record<string, unknown>) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id
          ? { ...node, data: { ...node.data, ...values } }
          : node,
      ),
    );
  };

  const description =
    nodeData.mode === "date"
      ? `Once: ${nodeData.scheduledAt}`
      : nodeData.mode === "cycle"
        ? `Cron: ${nodeData.cronExpression}`
        : "Click to configure";

  return (
    <>
      <TimerTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={nodeData}
        onSubmit={handleSubmit}
      />
      <BaseTriggerNode
        {...props}
        icon={TimerIcon}
        name="Timer"
        description={description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

TimerTriggerNode.displayName = "TimerTriggerNode";
