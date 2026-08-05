import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, name, phone } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: { email, password: hashedPassword, name, phone: phone || null, role: "CUSTOMER" },
    select: { id: true, email: true, name: true, role: true, phone: true, loyaltyPoints: true, tier: true },
  });
  return NextResponse.json({ user }, { status: 201 });
}
