"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

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
  redirect("/admin/users");
}

export async function updateUser(id: string, formData: FormData) {
  const session = await requireRole("manageUsers");
  const data = updateSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") ?? "",
    role: formData.get("role"),
    isActive: formData.get("isActive") ?? undefined,
  });

  const isEditingSelf = id === session.user.id;
  // Don't let an admin lock themselves out or de-privilege their own account
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
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  const session = await requireRole("manageUsers");
  if (id === session.user.id) {
    throw new Error("You cannot delete your own account.");
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
