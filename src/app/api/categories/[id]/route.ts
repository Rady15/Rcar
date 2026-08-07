import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function PATCH(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const { id, ...update } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const existing = await db.category.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  const category = await db.category.update({ where: { id }, data: update });
  return NextResponse.json({ category });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await db.category.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  await db.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
