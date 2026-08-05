import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");
  const bookings = await db.booking.findMany({
    where: { ...(userId ? { userId } : {}), ...(status ? { status } : {}) },
    include: { car: true, user: { select: { id: true, name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const car = await db.car.findUnique({ where: { id: body.carId } });
  if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });
  const pickupDate = new Date(body.pickupDate);
  const returnDate = new Date(body.returnDate);
  const daysCount = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / 86400000));
  const EXTRAS_PRICES: Record<string, number> = { child_seat: 8, gps: 5, additional_driver: 12, unlimited_miles: 15 };
  const extras = body.extras || [];
  const extrasTotal = extras.reduce((s: number, id: string) => s + (EXTRAS_PRICES[id] || 0), 0) * daysCount;
  const insuranceFee = body.insurance ? 12 * daysCount : 0;
  const subtotal = car.pricePerDay * daysCount + extrasTotal;
  const serviceFee = subtotal * 0.08;
  const total = subtotal + insuranceFee + serviceFee;
  const bookingCode = `RD${Math.floor(Math.random() * 900000 + 100000)}`;
  const booking = await db.booking.create({
    data: {
      userId: body.userId, carId: body.carId, pickupDate, returnDate,
      pickupLocation: body.pickupLocation, returnLocation: body.returnLocation,
      daysCount, pricePerDay: car.pricePerDay, subtotal, insuranceFee, serviceFee, total,
      status: "UPCOMING", bookingCode, extras: JSON.stringify(extras),
      paymentMethod: body.paymentMethod || null, paymentStatus: "PAID",
    },
    include: { car: true, user: true },
  });
  return NextResponse.json({ booking }, { status: 201 });
}
