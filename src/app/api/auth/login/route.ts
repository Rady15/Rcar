import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, generateSessionToken } from "@/lib/auth";
import { getJsonBody } from "@/lib/request";

export async function POST(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  const { email, password } = body;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Verify password — supports both hashed and legacy plaintext
  let isValid = false;
  if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
    // Hashed password
    isValid = await verifyPassword(password, user.password);
  } else {
    // Legacy plaintext (will be migrated on next password change)
    isValid = user.password === password;
  }

  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (user.isSuspended) {
    return NextResponse.json({ error: "Account suspended. Contact support." }, { status: 403 });
  }

  const token = generateSessionToken(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      licenseNumber: user.licenseNumber,
      loyaltyPoints: user.loyaltyPoints,
      tier: user.tier,
    },
    token,
  });
}
