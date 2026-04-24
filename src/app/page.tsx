"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

// import { requireAuth } from "@/lib/auth-utils";

export default function Home() {
  // await requireAuth();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const createWorkflow = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Workflow creation queued!");
      },
    }),
  );

  const testAi = useMutation(trpc.testAi.mutationOptions());

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      {JSON.stringify(data, null, 2)}
      <Button
        disabled={testAi.isPending}
        onClick={() => {
          testAi.mutate();
        }}
      >
        Test AI
      </Button>
      <Button
        disabled={createWorkflow.isPending}
        onClick={() => {
          createWorkflow.mutate();
        }}
      >
        Create Workflow
      </Button>
    </div>
  );
}
