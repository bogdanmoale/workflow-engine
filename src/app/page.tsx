import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

const page = async () => {
  const users = await prisma.user.findMany();
  return (
    <div className="text-red-500 bold">
      {users.map((user) => (
        <div key={user.id}>
          {user.name} {user.email}
        </div>
      ))}
    </div>
  );
};

export default page;
