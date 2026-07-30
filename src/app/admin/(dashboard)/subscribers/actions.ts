"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";

export async function removeSubscriber(id: string) {
  await requireRole("delete");
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
}
