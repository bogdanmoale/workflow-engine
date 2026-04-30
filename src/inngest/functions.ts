import { NonRetriableError } from "inngest";
import { CronExpressionParser } from "cron-parser";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort, sendWorkflowExecution } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { timerTriggerChannel } from "./channels/timer-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
import { workflowExecutionStartedChannel } from "./channels/workflow-execution-started";

// Restart the cycle function after this many iterations to stay within Inngest's step limit.
const MAX_CYCLE_ITERATIONS = 300;

export const scheduleDateTimer = inngest.createFunction(
  {
    id: "schedule-date-timer",
    cancelOn: [{ event: "timer/cancel", match: "data.workflowId" }],
  },
  { event: "timer/date.schedule" },
  async ({ event, step }) => {
    const { workflowId, scheduledAt } = event.data as {
      workflowId: string;
      scheduledAt: string;
    };

    await step.sleepUntil("wait-for-scheduled-time", new Date(scheduledAt));

    await step.run("trigger-workflow", async () => {
      await sendWorkflowExecution({
        workflowId,
        initialData: {
          timer: { mode: "date", firedAt: new Date().toISOString(), scheduledAt },
        },
      });
    });
  },
);

export const scheduleCycleTimer = inngest.createFunction(
  {
    id: "schedule-cycle-timer",
    cancelOn: [{ event: "timer/cancel", match: "data.workflowId" }],
  },
  { event: "timer/cycle.start" },
  async ({ event, step }) => {
    const { workflowId, cronExpression } = event.data as {
      workflowId: string;
      cronExpression: string;
      startIteration?: number;
    };
    const startIteration: number = (event.data as { startIteration?: number }).startIteration ?? 0;

    for (let i = 0; i < MAX_CYCLE_ITERATIONS; i++) {
      const iter = startIteration + i;
        const nextRun = await step.run(`calc-${iter}`, () => {
        const parsed = CronExpressionParser.parse(cronExpression);
        const next = parsed.next();
        if (!next) throw new Error("Cron expression produced no next date");
        return next.toISOString();
      });

      await step.sleepUntil(`sleep-${iter}`, nextRun as string);

      await step.run(`fire-${iter}`, async () => {
        await sendWorkflowExecution({
          workflowId,
          initialData: {
            timer: { mode: "cycle", firedAt: new Date().toISOString(), cronExpression },
          },
        });
      });
    }

    // Restart with a fresh function instance to avoid hitting the Inngest step limit.
    await step.run("restart", async () => {
      await inngest.send({
        name: "timer/cycle.start",
        data: {
          workflowId,
          cronExpression,
          startIteration: startIteration + MAX_CYCLE_ITERATIONS,
        },
      });
    });
  },
);

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0, // TODO: REMOVE IN PRODUCTION
    onFailure: async ({ event, step }) => {
      return prisma.execution.update({
        where: { inngestEventId: event.data.event.id },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      workflowExecutionStartedChannel(),
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      timerTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
      discordChannel(),
      slackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!inngestEventId || !workflowId) {
      throw new NonRetriableError("Event ID or workflow ID is missing");
    }

    // Signal all nodes in the editor to reset their status to "initial".
    await publish(
      workflowExecutionStartedChannel().started({
        workflowId,
        startedAt: new Date().toISOString(),
      }),
    );

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId,
          inngestEventId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("get-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });

      return workflow.userId;
    });

    // Initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });
    }

    await step.run("update-execution", async () => {
      return prisma.execution.update({
        where: { inngestEventId, workflowId },
        data: {
          status: ExecutionStatus.SUCCESS,
          completedAt: new Date(),
          output: context,
        },
      });
    });

    return {
      workflowId,
      result: context,
    };
  },
);
