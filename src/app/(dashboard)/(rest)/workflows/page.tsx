import { requireAuth } from "@/lib/auth-utils";

const WorkflowsPage = async () => {
  await requireAuth();
  return <p>Workflows</p>;
};

export default WorkflowsPage;
