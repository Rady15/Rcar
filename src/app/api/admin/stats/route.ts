import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [cars, bookings, users, reviews, deals] = await Promise.all([
    db.car.count(),
    db.booking.count(),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.review.count(),
    db.deal.count({ where: { isActive: true } }),
  ]);
  const totalRevenue = await db.booking.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } });
  const upcomingBookings = await db.booking.count({ where: { status: "UPCOMING" } });
  const completedBookings = await db.booking.count({ where: { status: "COMPLETED" } });
  const cancelledBookings = await db.booking.count({ where: { status: "CANCELLED" } });
  const carsByCategory = await db.car.groupBy({ by: ["category"], _count: { _all: true } });
  const recentBookings = await db.booking.findMany({
    take: 5, orderBy: { createdAt: "desc" },
    include: {
      car: { select: { brand: true, model: true, imageUrl: true } },
      user: { select: { name: true, email: true } },
    },
  });
  const topCarsRaw = await db.booking.groupBy({ by: ["carId"], _count: { _all: true }, orderBy: { _count: { carId: "desc" } }, take: 5 });
  const topCars = await Promise.all(topCarsRaw.map(async (t) => {
    const car = await db.car.findUnique({ where: { id: t.carId }, select: { brand: true, model: true, imageUrl: true, pricePerDay: true } });
    return { ...t, car };
  }));
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const recentPaidBookings = await db.booking.findMany({
    where: { paymentStatus: "PAID", createdAt: { gte: sevenDaysAgo } },
    select: { total: true, createdAt: true },
  });
  const revenueByDay: { date: string; revenue: number; bookings: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart.getTime() + 86400000);
    const dayBookings = recentPaidBookings.filter((b) => b.createdAt >= dayStart && b.createdAt < dayEnd);
    revenueByDay.push({ date: dayStart.toISOString().split("T")[0], revenue: dayBookings.reduce((s, b) => s + b.total, 0), bookings: dayBookings.length });
  }
  return NextResponse.json({
    counts: { cars, bookings, users, reviews, deals },
    revenue: totalRevenue._sum.total || 0,
    statusBreakdown: { upcoming: upcomingBookings, completed: completedBookings, cancelled: cancelledBookings },
    carsByCategory, recentBookings, topCars, revenueByDay,
  });
}
