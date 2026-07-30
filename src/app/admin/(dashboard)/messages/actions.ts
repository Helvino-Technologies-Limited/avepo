"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export async function markMessageRead(id: string) {
  await requireRole("update");
  await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}

export async function deleteMessage(id: string) {
  await requireRole("delete");
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}
