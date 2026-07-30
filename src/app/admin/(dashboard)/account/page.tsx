import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Field, TextInput, SubmitButton } from "@/components/admin/ui";
import { SavedBanner } from "@/components/admin/saved-banner";
import { updateUser } from "@/app/admin/(dashboard)/users/actions";

export default async function MyAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { saved } = await searchParams;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/admin/dashboard");

  return (
    <div className="max-w-md">
      <SavedBanner show={saved === "1"} label="Account updated successfully." />
      <h1 className="text-2xl font-semibold text-neutral-900">My Account</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Update your name, email, or password. Your role is {user.role.replaceAll("_", " ")}.
      </p>

      <form action={updateUser.bind(null, user.id)} className="mt-6 space-y-4">
        <Field label="Name" htmlFor="name">
          <TextInput id="name" name="name" required defaultValue={user.name} />
        </Field>
        <Field label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" required defaultValue={user.email} />
        </Field>
        <Field label="New Password (leave blank to keep current)" htmlFor="password">
          <TextInput id="password" name="password" type="password" />
        </Field>
        <SubmitButton>Save Changes</SubmitButton>
      </form>
    </div>
  );
}
