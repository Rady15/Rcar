import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
  if (typeof body.newPassword === "string" && body.newPassword.length >= 6) update.password = body.newPassword;
  const updated = await db.user.update({
    where: { id }, data: update,
    select: { id: true, email: true, name: true, phone: true, role: true, licenseNumber: true, loyaltyPoints: true, tier: true },
  });
  return NextResponse.json({ user: updated });
}
