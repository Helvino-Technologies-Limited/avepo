"use server";

import { prisma } from "@/lib/db";

export async function unsubscribe(email: string) {
  await prisma.subscriber.updateMany({ where: { email }, data: { isActive: false } });
}
