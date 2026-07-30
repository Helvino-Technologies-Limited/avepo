"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { auth } from "@/auth";

const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "CONTENT_CREATOR",
  "BRANCH_MANAGER",
  "READ_ONLY",
] as const;

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(ROLES),
  isActive: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().optional().or(z.literal("")),
  role: z.enum(ROLES),
  isActive: z.string().optional(),
});

export async function createUser(formData: FormData) {
  await requireRole("manageUsers");
  const data = createSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    isActive: formData.get("isActive") ?? undefined,
  });

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function updateUser(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authorized to perform this action.");
  }

  const isEditingSelf = id === session.user.id;
  // Editing your own name/email/password only requires being logged in.
  // Editing someone else's account (or changing role/active status) requires manageUsers.
  if (!isEditingSelf) {
    const { can } = await import("@/lib/rbac");
    if (!can(session.user.role as never, "manageUsers")) {
      throw new Error("Not authorized to perform this action.");
    }
  }

  const data = updateSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") ?? "",
    role: formData.get("role"),
    isActive: formData.get("isActive") ?? undefined,
  });

  // Don't let a user lock themselves out or de-privilege their own account
  // through this form — role/active-status changes to yourself are no-ops.
  const existing = isEditingSelf ? await prisma.user.findUniqueOrThrow({ where: { id } }) : null;
  const role = isEditingSelf ? existing!.role : data.role;
  const isActive = isEditingSelf ? existing!.isActive : data.isActive === "on";

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      role,
      isActive,
      ...(data.password ? { passwordHash: await bcrypt.hash(data.password, 12) } : {}),
    },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/account");
  redirect(isEditingSelf ? "/admin/account?saved=1" : "/admin/users?saved=1");
}

export async function deleteUser(id: string) {
  const session = await requireRole("manageUsers");
  if (id === session.user.id) {
    throw new Error("You cannot delete your own account.");
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
