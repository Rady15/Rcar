import { NextRequest } from "next/server";

export async function getJsonBody(req: NextRequest): Promise<any> {
  try {
    const text = await req.text();
    if (!text) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
