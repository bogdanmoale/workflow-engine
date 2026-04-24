import prisma from "@/lib/db";
import { inngest } from "./client";

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    await step.sleep("do-something", "5s");

    await step.sleep("do-something-else", "5s");

    await step.run("create-workflow", async () => {
      return prisma.workflow.create({
        data: {
          name: "Workflow from Inngest",
        },
      });
    });
  },
);
