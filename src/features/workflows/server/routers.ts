import { generateSlug } from "random-word-slugs";
import prisma from "@/lib/db";
import type { Node, Edge } from "@xyflow/react";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  create: protectedProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: "TODO",
        userId: ctx.auth.user.id,
      },
    });
  }),
});
