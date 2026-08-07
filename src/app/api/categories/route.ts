import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getJsonBody } from "@/lib/request";

export async function GET() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  // If no categories in DB, return defaults
  if (categories.length === 0) {
    const defaults = [
      { id: "sedan", name: "Sedan", nameAr: "سيدان", slug: "sedan", imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80", sortOrder: 1 },
      { id: "suv", name: "SUV", nameAr: "دفع رباعي", slug: "suv", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80", sortOrder: 2 },
      { id: "sports", name: "Sports", nameAr: "رياضية", slug: "sports", imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80", sortOrder: 3 },
      { id: "luxury", name: "Luxury", nameAr: "فاخرة", slug: "luxury", imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40656699?auto=format&fit=crop&w=600&q=80", sortOrder: 4 },
      { id: "electric", name: "Electric", nameAr: "كهربائية", slug: "electric", imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80", sortOrder: 5 },
      { id: "convertible", name: "Convertible", nameAr: "كشف", slug: "convertible", imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80", sortOrder: 6 },
      { id: "van", name: "Van", nameAr: "فان", slug: "van", imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80", sortOrder: 7 },
    ];
    return NextResponse.json({ categories: defaults });
  }
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const body = await getJsonBody(req);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const category = await db.category.create({
    data: {
      name: body.name,
      nameAr: body.nameAr || body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      imageUrl: body.imageUrl,
      description: body.description || null,
      sortOrder: body.sortOrder || 0,
    },
  });
  return NextResponse.json({ category }, { status: 201 });
}
