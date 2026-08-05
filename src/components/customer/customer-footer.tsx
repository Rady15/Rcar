"use client";

import { useAppStore } from "@/lib/store";
import { useScrollToSection } from "@/components/shared/motion-primitives";
import { api } from "@/lib/helpers";
import { FooterContent } from "@/lib/site-content-types";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_FOOTER: FooterContent = {
  tagline: "Premium car rentals, on demand. From economy hybrids to supercars, find your perfect ride.",
  phone: "+1 (555) 010-2024", email: "support@rentdrive.app",
  address: "350 5th Ave, New York", copyright: "© 2024 RentDrive Inc. All rights reserved.",
};

export function CustomerFooter() {
  const { setCustomerView, setHomeScrollTarget, customerView } = useAppStore();
  const scrollTo = useScrollToSection();
  const [footer, setFooter] = useState<FooterContent>(DEFAULT_FOOTER);

  useEffect(() => {
    api<any>("/api/site-content").then((c) => { if (c.footer) setFooter(c.footer); }).catch(() => {});
  }, []);

  const goHomeThenScroll = (sectionId: string) => {
    const onHome = customerView === "home";
    if (onHome) scrollTo(sectionId);
    else { setHomeScrollTarget(sectionId); setCustomerView("home"); }
  };

  const go = (view: any) => { setCustomerView(view); window.scrollTo(0, 0); };

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-base">🚗</div>
              <span className="text-base font-bold">RentDrive</span>
            </div>
            <p className="text-sm text-muted-foreground">{footer.tagline}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => goHomeThenScroll("categories-section")} className="hover:text-foreground transition-colors">Categories</button></li>
              <li><button onClick={() => goHomeThenScroll("featured-section")} className="hover:text-foreground transition-colors">Featured cars</button></li>
              <li><button onClick={() => goHomeThenScroll("deals-section")} className="hover:text-foreground transition-colors">Deals</button></li>
              <li><button onClick={() => go("browse")} className="hover:text-foreground transition-colors">All cars</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => go("my-trips")} className="hover:text-foreground transition-colors">My Trips</button></li>
              <li><button onClick={() => go("favorites")} className="hover:text-foreground transition-colors">Favorites</button></li>
              <li><button onClick={() => go("login")} className="hover:text-foreground transition-colors">Sign In</button></li>
              <li><button onClick={() => go("account")} className="hover:text-foreground transition-colors">My Account</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {footer.phone}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {footer.email}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {footer.address}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>{footer.copyright}</p>
          <p className="flex items-center gap-1">Built with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> using Next.js, Prisma & Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
