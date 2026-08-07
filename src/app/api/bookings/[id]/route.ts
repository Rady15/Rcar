import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await db.booking.findUnique({ where: { id }, include: { car: true, user: true } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const { id, ...update } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const booking = await db.booking.update({ where: { id }, data: update, include: { car: true, user: true } });
  return NextResponse.json({ booking });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.booking.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
