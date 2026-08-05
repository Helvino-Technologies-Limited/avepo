"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export async function approveTipComment(id: string) {
  await requireRole("update");
  await prisma.tipComment.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/admin/farmer-tips/comments");
  revalidatePath("/farmer-tips");
}

export async function rejectTipComment(id: string) {
  await requireRole("update");
  await prisma.tipComment.update({ where: { id }, data: { isApproved: false } });
  revalidatePath("/admin/farmer-tips/comments");
  revalidatePath("/farmer-tips");
}

export async function deleteTipComment(id: string) {
  await requireRole("delete");
  await prisma.tipComment.delete({ where: { id } });
  revalidatePath("/admin/farmer-tips/comments");
  revalidatePath("/farmer-tips");
}
