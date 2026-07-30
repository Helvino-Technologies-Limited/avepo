import { auth } from "@/auth";
import type { Role } from "@prisma/client";
import { Sidebar } from "@/components/admin/sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar role={(session?.user?.role as Role) ?? "READ_ONLY"} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
          <div className="text-sm text-neutral-500">
            Signed in as{" "}
            <span className="font-medium text-neutral-800">{session?.user?.email}</span>{" "}
            <span className="ml-1 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">
              {session?.user?.role}
            </span>
          </div>
          <SignOutButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
