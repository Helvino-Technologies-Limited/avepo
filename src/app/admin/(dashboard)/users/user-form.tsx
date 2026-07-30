import { Field, TextInput, Select, Checkbox, SubmitButton } from "@/components/admin/ui";
import type { User } from "@prisma/client";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONTENT_CREATOR: "Content Creator",
  BRANCH_MANAGER: "Branch Manager",
  READ_ONLY: "Read Only",
};

export function UserForm({
  action,
  user,
  isSelf,
}: {
  action: (formData: FormData) => Promise<void>;
  user?: User;
  isSelf?: boolean;
}) {
  return (
    <form action={action} className="space-y-4">
      <Field label="Name" htmlFor="name">
        <TextInput id="name" name="name" required defaultValue={user?.name} />
      </Field>

      <Field label="Email" htmlFor="email">
        <TextInput id="email" name="email" type="email" required defaultValue={user?.email} />
      </Field>

      <Field label={user ? "New Password (leave blank to keep current)" : "Password"} htmlFor="password">
        <TextInput
          id="password"
          name="password"
          type="password"
          required={!user}
          minLength={user ? undefined : 8}
        />
      </Field>

      <Field label="Role" htmlFor="role">
        <Select id="role" name="role" defaultValue={user?.role ?? "CONTENT_CREATOR"} disabled={isSelf}>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        {isSelf && <p className="mt-1 text-xs text-neutral-500">You can&apos;t change your own role here.</p>}
      </Field>

      <Checkbox
        name="isActive"
        label="Active"
        defaultChecked={user?.isActive ?? true}
        disabled={isSelf}
      />

      <SubmitButton>{user ? "Save Changes" : "Create User"}</SubmitButton>
    </form>
  );
}
