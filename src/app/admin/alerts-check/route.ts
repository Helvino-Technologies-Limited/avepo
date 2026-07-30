import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const [unreadMessages, pendingOrders, pendingReviews] = await Promise.all([
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  return NextResponse.json({ unreadMessages, pendingOrders, pendingReviews });
}
