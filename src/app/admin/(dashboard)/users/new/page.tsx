import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import { UserForm } from "../user-form";
import { createUser } from "../actions";

export default async function NewUserPage() {
  const session = await auth();
  if (!session?.user?.role || !can(session.user.role as Role, "manageUsers")) {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Add User</h1>
      <div className="mt-6 max-w-2xl">
        <UserForm action={createUser} />
      </div>
    </div>
  );
}
