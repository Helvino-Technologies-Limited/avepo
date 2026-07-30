import { auth } from "@/auth";
import type { Role } from "@prisma/client";
import { Sidebar } from "@/components/admin/sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { VoiceAlerts } from "@/components/admin/voice-alerts";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 md:flex-row">
      <Sidebar role={(session?.user?.role as Role) ?? "READ_ONLY"} />
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4 py-3 sm:px-6">
          <div className="text-sm text-neutral-500">
            Signed in as{" "}
            <span className="font-medium text-neutral-800">{session?.user?.email}</span>{" "}
            <span className="ml-1 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">
              {session?.user?.role}
            </span>
          </div>
          <SignOutButton />
        </header>
        <main className="overflow-x-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
