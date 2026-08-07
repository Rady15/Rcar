import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const { id } = await params;
  const cleaned: Record<string, unknown> = { ...body };
  delete cleaned.id;
  if (cleaned.sortOrder !== undefined) cleaned.sortOrder = Number(cleaned.sortOrder);
  if (cleaned.isActive !== undefined) cleaned.isActive = !!cleaned.isActive;
  const existing = await db.location.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Location not found" }, { status: 404 });
  const location = await db.location.update({ where: { id }, data: cleaned });
  return NextResponse.json({ location });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await db.location.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Location not found" }, { status: 404 });
  await db.location.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
