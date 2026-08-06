import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEFAULTS = {
  hero: { badge: "18+ cars available right now", title: "Drive your", highlightedWord: "dream car,", italicWord: "today.", subtitle: "From fuel-sipping hybrids to roaring supercars. Book in under 60 seconds with free cancellation up to 24h before pickup.", primaryBtn: "Browse cars", secondaryBtn: "View deals", imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80", scrollHint: "Scroll to explore", showBadges: true, signInLabel: "Already a member?", adminLabel: "Admin panel" },
  stats: [{ icon: "car", value: "18+", label: "Premium cars" }, { icon: "calendar", value: "6,400+", label: "Trips completed" }, { icon: "star", value: "4.9★", label: "Average rating" }, { icon: "shield", value: "24/7", label: "Roadside help" }],
  howItWorks: [{ step: "01", title: "Pick your car", desc: "Browse 18+ hand-picked cars.", icon: "search" }, { step: "02", title: "Choose dates & extras", desc: "Select pickup and return dates.", icon: "calendar" }, { step: "03", title: "Pay securely", desc: "Lock in your booking.", icon: "shield" }, { step: "04", title: "Hit the road", desc: "Show your license and drive.", icon: "zap" }],
  testimonials: [{ name: "Michael Chen", role: "Verified Renter", rating: 5, text: "Amazing service.", initials: "MC" }],
  finalCta: { title: "Ready to hit the road?", subtitle: "Join thousands of happy renters.", primaryBtn: "Get started", secondaryBtn: "Browse cars", adminLabel: "Admin?" },
  footer: { tagline: "Premium car rentals, on demand.", phone: "+1 (555) 010-2024", email: "support@rentdrive.app", address: "350 5th Ave, New York", copyright: "© 2024 RentDrive Inc. All rights reserved." },
  branding: { siteName: "RentDrive", logoEmoji: "🚗", logoUrl: "/logo.png", accentColor: "#d97706" },
  seo: { title: "RentDrive — Premium Car Rental Platform", description: "Rent luxury, sports, electric and family cars by the day.", keywords: "car rental, luxury cars", ogImageUrl: "", twitterHandle: "@rentdrive" },
};

function buildDefaults() {
  return {
    id: "singleton",
    hero: JSON.stringify(DEFAULTS.hero),
    stats: JSON.stringify(DEFAULTS.stats),
    howItWorks: JSON.stringify(DEFAULTS.howItWorks),
    testimonials: JSON.stringify(DEFAULTS.testimonials),
    finalCta: JSON.stringify(DEFAULTS.finalCta),
    footer: JSON.stringify(DEFAULTS.footer),
    branding: JSON.stringify(DEFAULTS.branding),
    seo: JSON.stringify(DEFAULTS.seo),
  };
}

async function getOrCreate() {
  let row = await db.siteContent.findUnique({ where: { id: "singleton" } });
  if (!row) row = await db.siteContent.create({ data: buildDefaults() });
  return row;
}

function parse(row: NonNullable<Awaited<ReturnType<typeof getOrCreate>>>) {
  return {
    hero: JSON.parse(row.hero), stats: JSON.parse(row.stats),
    howItWorks: JSON.parse(row.howItWorks), testimonials: JSON.parse(row.testimonials),
    finalCta: JSON.parse(row.finalCta), footer: JSON.parse(row.footer),
    branding: JSON.parse(row.branding), seo: JSON.parse(row.seo),
    updatedAt: row.updatedAt,
  };
}

export async function GET() {
  const row = await getOrCreate();
  return NextResponse.json(parse(row));
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const cleaned: Record<string, string> = {};
  for (const key of ["hero", "stats", "howItWorks", "testimonials", "finalCta", "footer", "branding", "seo"]) {
    if (body[key] !== undefined) {
      try { cleaned[key] = typeof body[key] === "string" ? body[key] : JSON.stringify(body[key]); } catch {}
    }
  }
  const row = await db.siteContent.upsert({
    where: { id: "singleton" }, update: cleaned, create: { ...buildDefaults(), ...cleaned },
  });
  return NextResponse.json(parse(row));
}
