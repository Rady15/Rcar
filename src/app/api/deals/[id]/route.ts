import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function PATCH(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const { id, ...update } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const cleaned: Record<string, unknown> = { ...update };
  if (cleaned.endDate) cleaned.endDate = new Date(cleaned.endDate as string);
  if (cleaned.discountPercent !== undefined) cleaned.discountPercent = Number(cleaned.discountPercent);
  if (cleaned.isActive !== undefined) cleaned.isActive = !!cleaned.isActive;
  const deal = await db.deal.update({ where: { id }, data: cleaned });
  return NextResponse.json({ deal });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await db.deal.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  await db.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
