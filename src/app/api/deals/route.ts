import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const deals = await db.deal.findMany({
    where: { isActive: true },
    include: { car: true },
    orderBy: { endDate: "asc" },
  });
  return NextResponse.json({ deals });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const deal = await db.deal.create({
    data: {
      title: body.title, description: body.description,
      discountLabel: body.discountLabel, discountPercent: Number(body.discountPercent),
      carId: body.carId || null, promoCode: body.promoCode,
      endDate: new Date(body.endDate), isActive: body.isActive !== false,
    },
  });
  return NextResponse.json({ deal }, { status: 201 });
}
