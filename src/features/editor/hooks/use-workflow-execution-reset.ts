"use client";

import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { WORKFLOW_EXECUTION_STARTED_CHANNEL } from "@/inngest/channels/workflow-execution-started";
import { fetchExecutionResetToken } from "../actions/fetch-execution-reset-token";
import { executionResetAtom } from "../store/atoms";

export function useWorkflowExecutionReset(workflowId: string) {
  const setResetCount = useSetAtom(executionResetAtom);
  const lastSeenAt = useRef<string | null>(null);

  const { data } = useInngestSubscription({
    refreshToken: fetchExecutionResetToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) return;

    const latest = data
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === WORKFLOW_EXECUTION_STARTED_CHANNEL &&
          msg.topic === "started" &&
          msg.data.workflowId === workflowId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (latest?.kind === "data") {
      const createdAt = latest.createdAt.toString();
      if (createdAt !== lastSeenAt.current) {
        lastSeenAt.current = createdAt;
        setResetCount((c) => c + 1);
      }
    }
  }, [data, workflowId, setResetCount]);
}
