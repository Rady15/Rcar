import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function GET() {
  const locations = await db.location.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  // If no locations in DB, return defaults
  if (locations.length === 0) {
    const defaults = [
      { id: "riyadh", name: "Riyadh", nameAr: "الرياض", sortOrder: 1, isActive: true },
      { id: "jeddah", name: "Jeddah", nameAr: "جدة", sortOrder: 2, isActive: true },
      { id: "dammam", name: "Dammam", nameAr: "الدمام", sortOrder: 3, isActive: true },
      { id: "khobar", name: "Al Khobar", nameAr: "الخبر", sortOrder: 4, isActive: true },
      { id: "makkah", name: "Makkah", nameAr: "مكة المكرمة", sortOrder: 5, isActive: true },
      { id: "madinah", name: "Madinah", nameAr: "المدينة المنورة", sortOrder: 6, isActive: true },
      { id: "tabuk", name: "Tabuk", nameAr: "تبوك", sortOrder: 7, isActive: true },
      { id: "abha", name: "Abha", nameAr: "أبها", sortOrder: 8, isActive: true },
    ];
    return NextResponse.json({ locations: defaults });
  }
  return NextResponse.json({ locations });
}

export async function POST(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const location = await db.location.create({
    data: {
      name: body.name,
      nameAr: body.nameAr || body.name,
      sortOrder: Number(body.sortOrder) || 0,
      isActive: body.isActive !== false,
    },
  });
  return NextResponse.json({ location }, { status: 201 });
}
