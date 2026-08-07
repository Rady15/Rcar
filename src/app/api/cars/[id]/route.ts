import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await db.car.findUnique({ where: { id } });
  if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });
  const reviews = await db.review.findMany({
    where: { carId: id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ car, reviews });
}

export async function PATCH(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const { id, ...update } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const cleaned: Record<string, unknown> = { ...update };
  if (cleaned.features && Array.isArray(cleaned.features)) cleaned.features = JSON.stringify(cleaned.features);
  for (const k of ["year", "pricePerDay", "seats", "doors", "horsePower", "topSpeed", "zeroToHundred", "rating"]) {
    if (cleaned[k] !== undefined) cleaned[k] = Number(cleaned[k]);
  }
  const car = await db.car.update({ where: { id }, data: cleaned });
  return NextResponse.json({ car });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.car.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
