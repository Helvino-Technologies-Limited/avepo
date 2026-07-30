import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { can } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/row-actions";
import { deleteUser } from "./actions";

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.role || !can(session.user.role as Role, "manageUsers")) {
    redirect("/admin/dashboard");
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Users</h1>
        <Link
          href="/admin/users/new"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Add User
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={users}
          emptyMessage="No users yet."
          editHref={(u) => `/admin/users/${u.id}`}
          columns={[
            { header: "Name", render: (u) => u.name },
            { header: "Email", render: (u) => u.email },
            { header: "Role", render: (u) => u.role.replaceAll("_", " ") },
            { header: "Active", render: (u) => (u.isActive ? "Yes" : "No") },
          ]}
          rowActions={(u) =>
            u.id !== session?.user?.id ? <DeleteButton action={deleteUser.bind(null, u.id)} /> : null
          }
        />
      </div>
    </div>
  );
}
