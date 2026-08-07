import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "recommended";

  let cars = await db.car.findMany({
    where: {
      ...(category && category !== "all" ? { category } : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
    },
    orderBy:
      sort === "price_low" ? { pricePerDay: "asc" }
      : sort === "price_high" ? { pricePerDay: "desc" }
      : sort === "rating" ? { rating: "desc" }
      : { reviewCount: "desc" },
  });

  if (search && search.trim()) {
    const q = search.toLowerCase();
    cars = cars.filter((c) =>
      c.brand.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.color.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ cars });
}

export async function POST(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const car = await db.car.create({
    data: {
      brand: body.brand, model: body.model, year: Number(body.year),
      pricePerDay: Number(body.pricePerDay), category: body.category,
      transmission: body.transmission, fuelType: body.fuelType,
      seats: Number(body.seats), doors: Number(body.doors),
      features: JSON.stringify(body.features || []),
      rating: body.rating ? Number(body.rating) : 4.5,
      reviewCount: 0, color: body.color, description: body.description,
      imageUrl: body.imageUrl, isFeatured: !!body.isFeatured,
      isAvailable: body.isAvailable !== false,
      horsePower: Number(body.horsePower), topSpeed: Number(body.topSpeed),
      zeroToHundred: Number(body.zeroToHundred),
    },
  });
  return NextResponse.json({ car }, { status: 201 });
}
