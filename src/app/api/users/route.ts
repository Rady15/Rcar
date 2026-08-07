import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const users = await db.user.findMany({
    where: role ? { role } : {},
    select: { id: true, email: true, name: true, phone: true, role: true, isSuspended: true, createdAt: true, _count: { select: { bookings: true, reviews: true } } },
    orderBy: { createdAt: "desc" },
  });
  const usersWithStats = await Promise.all(users.map(async (u) => {
    if (u.role === "CUSTOMER") {
      const spent = await db.booking.aggregate({ _sum: { total: true }, where: { userId: u.id, paymentStatus: "PAID" } });
      return { ...u, totalSpent: spent._sum.total || 0 };
    }
    return { ...u, totalSpent: 0 };
  }));
  return NextResponse.json({ users: usersWithStats });
}
