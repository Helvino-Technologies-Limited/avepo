import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { can } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import { UserForm } from "../user-form";
import { updateUser } from "../actions";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.role || !can(session.user.role as Role, "manageUsers")) {
    redirect("/admin/dashboard");
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit User</h1>
      <div className="mt-6 max-w-2xl">
        <UserForm action={updateUser.bind(null, id)} user={user} isSelf={id === session.user.id} />
      </div>
    </div>
  );
}
