import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const USER_SELECT = {
  id: true, email: true, name: true, phone: true, role: true, isSuspended: true,
  licenseNumber: true, loyaltyPoints: true, tier: true,
} as const;

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, name, phone, licenseNumber } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const existing = await db.user.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (phone !== undefined) update.phone = phone;
  if (licenseNumber !== undefined) update.licenseNumber = licenseNumber;
  if (body.isSuspended !== undefined) update.isSuspended = !!body.isSuspended;
  if (typeof body.newPassword === "string" && body.newPassword.length >= 6) update.password = body.newPassword;
  const updated = await db.user.update({ where: { id }, data: update, select: USER_SELECT });
  return NextResponse.json({ user: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await db.user.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (existing.role === "ADMIN") return NextResponse.json({ error: "Cannot delete an admin account" }, { status: 400 });
  await db.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
