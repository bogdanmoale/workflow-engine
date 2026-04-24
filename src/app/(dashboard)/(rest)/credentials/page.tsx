import { requireAuth } from "@/lib/auth-utils";

const CredentialsPage = async () => {
  await requireAuth();
  return <p>Credentials</p>;
};

export default CredentialsPage;
