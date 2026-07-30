import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const subscribers = await prisma.subscriber.findMany({ orderBy: { subscribedAt: "desc" } });

  const header = "email,isActive,subscribedAt";
  const rows = subscribers.map(
    (s) => `${s.email},${s.isActive},${s.subscribedAt.toISOString()}`
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=avepo-subscribers.csv",
    },
  });
}
