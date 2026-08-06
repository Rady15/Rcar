import type { Metadata } from "next";
import { Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { db } from "@/lib/db";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

async function getSeo() {
  try {
    let row = await db.siteContent.findUnique({ where: { id: "singleton" } });
    if (!row) {
      row = await db.siteContent.create({
        data: {
          id: "singleton",
          hero: JSON.stringify({ badge: "", title: "", highlightedWord: "", italicWord: "", subtitle: "", primaryBtn: "", secondaryBtn: "", imageUrl: "", scrollHint: "", showBadges: true, signInLabel: "", adminLabel: "" }),
          stats: "[]", howItWorks: "[]", testimonials: "[]",
          finalCta: JSON.stringify({ title: "", subtitle: "", primaryBtn: "", secondaryBtn: "", adminLabel: "" }),
          footer: JSON.stringify({ tagline: "", phone: "", email: "", address: "", copyright: "" }),
          branding: JSON.stringify({ siteName: "RentDrive", logoEmoji: "🚗", logoUrl: "/logo.png", accentColor: "#d97706" }),
          seo: JSON.stringify({ title: "RentDrive — Premium Car Rental Platform", description: "Rent luxury, sports, electric and family cars by the day.", keywords: "car rental, luxury cars", ogImageUrl: "", twitterHandle: "" }),
        },
      });
    }
    return JSON.parse(row.seo);
  } catch {
    return { title: "RentDrive", description: "Premium car rentals", keywords: "", ogImageUrl: "", twitterHandle: "" };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.split(",").map((k: string) => k.trim()).filter(Boolean),
    icons: { icon: "/logo.png" },
    openGraph: {
      title: seo.title, description: seo.description, type: "website",
      ...(seo.ogImageUrl ? { images: [{ url: seo.ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image", title: seo.title, description: seo.description,
      ...(seo.twitterHandle ? { creator: seo.twitterHandle } : {}),
      ...(seo.ogImageUrl ? { images: [seo.ogImageUrl] } : {}),
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${arabic.variable} antialiased bg-background text-foreground min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
          <SonnerToaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
