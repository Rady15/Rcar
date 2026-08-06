import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Auto-update booking statuses based on dates:
// - UPCOMING → ACTIVE when pickupDate <= now
// - ACTIVE → COMPLETED when returnDate < now
export async function POST() {
  const now = new Date();
  let updated = 0;

  // UPCOMING → ACTIVE
  const toActive = await db.booking.findMany({
    where: {
      status: "UPCOMING",
      pickupDate: { lte: now },
    },
    select: { id: true },
  });
  for (const b of toActive) {
    await db.booking.update({ where: { id: b.id }, data: { status: "ACTIVE" } });
    updated++;
  }

  // ACTIVE → COMPLETED
  const toCompleted = await db.booking.findMany({
    where: {
      status: "ACTIVE",
      returnDate: { lt: now },
    },
    select: { id: true },
  });
  for (const b of toCompleted) {
    await db.booking.update({ where: { id: b.id }, data: { status: "COMPLETED" } });
    updated++;
  }

  return NextResponse.json({ success: true, updated, checked: toActive.length + toCompleted.length });
}
