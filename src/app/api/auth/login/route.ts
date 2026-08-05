import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id, email: user.email, name: user.name, role: user.role,
      phone: user.phone, licenseNumber: user.licenseNumber,
      loyaltyPoints: user.loyaltyPoints, tier: user.tier,
    },
  });
}
