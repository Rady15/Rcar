import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const carId = searchParams.get("carId");
  const reviews = await db.review.findMany({
    where: carId ? { carId } : {},
    include: {
      user: { select: { id: true, name: true } },
      car: { select: { id: true, brand: true, model: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const review = await db.review.create({
    data: {
      userId: body.userId, carId: body.carId, rating: Number(body.rating),
      comment: body.comment, tripType: body.tripType || null,
    },
    include: { user: { select: { name: true } } },
  });
  const all = await db.review.findMany({ where: { carId: body.carId }, select: { rating: true } });
  if (all.length > 0) {
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await db.car.update({ where: { id: body.carId }, data: { rating: Math.round(avg * 10) / 10, reviewCount: all.length } });
  }
  return NextResponse.json({ review }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
