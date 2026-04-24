import { requireAuth } from "@/lib/auth-utils";

const ExecutionsPage = async () => {
  await requireAuth();
  return <p>Executions</p>;
};

export default ExecutionsPage;
