"use client";

import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Heart, Menu, Search, User, X, LogIn, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollToSection, useIsScrolled } from "@/components/shared/motion-primitives";
import { api } from "@/lib/helpers";
import { Branding } from "@/lib/site-content-types";
import { cn } from "@/lib/utils";

export function CustomerHeader() {
  const { user, setCustomerView, favorites, setHomeScrollTarget, setBrowseCategory, lang, setLang } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [branding, setBranding] = useState<Branding | null>(null);
  const scrollTo = useScrollToSection();
  const scrolled = useIsScrolled(20);
  const isRtl = lang === "ar";

  useEffect(() => {
    api<Branding>("/api/site-content").then((c: any) => setBranding(c.branding)).catch(() => {});
  }, []);

  const goHomeThenScroll = (sectionId: string) => {
    const onHome = useAppStore.getState().customerView === "home";
    if (onHome) scrollTo(sectionId);
    else { setHomeScrollTarget(sectionId); setCustomerView("home"); }
    setMobileOpen(false);
  };

  const navItems: { label: string; action: () => void }[] = [
    { label: tr("nav_home", lang), action: () => { setCustomerView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); } },
    { label: tr("nav_browse", lang), action: () => { setBrowseCategory("all"); setCustomerView("browse"); window.scrollTo(0, 0); setMobileOpen(false); } },
    { label: tr("nav_categories", lang), action: () => goHomeThenScroll("categories-section") },
    { label: tr("section_featured_title", lang), action: () => goHomeThenScroll("featured-section") },
    { label: tr("nav_deals", lang), action: () => goHomeThenScroll("deals-section") },
  ];

  const siteName = branding?.siteName || "RentDrive";
  const logoUrl = branding?.logoUrl;
  const logoEmoji = branding?.logoEmoji || "🚗";

  return (
    <header
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border transition-all duration-300",
        scrolled ? "bg-background/85 backdrop-blur-md shadow-sm" : "bg-background/95 backdrop-blur"
      )}
      style={{ fontFamily: "var(--font-arabic), 'Tajawal', 'Cairo', system-ui, sans-serif" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <button onClick={() => { setCustomerView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-9 w-9 rounded-lg object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg group-hover:scale-105 transition-transform">
                {logoEmoji.startsWith("http") ? <Car className="h-5 w-5" /> : logoEmoji}
              </div>
            )}
            <span className="text-lg font-bold tracking-tight">{siteName}</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item.label} onClick={item.action} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors">{item.label}</button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-accent/40 transition-colors" aria-label="Toggle language">
            <Globe className="h-4 w-4" />
            <span>{lang === "ar" ? "EN" : "عرب"}</span>
          </button>
          <Button variant="ghost" size="icon" className="hidden md:flex relative" onClick={() => { setCustomerView("favorites"); window.scrollTo(0, 0); }} aria-label={tr("nav_favorites", lang)}>
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs flex items-center justify-center bg-accent text-accent-foreground">{favorites.length}</Badge>}
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => { setBrowseCategory("all"); setCustomerView("browse"); window.scrollTo(0, 0); }} aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          {user ? (
            <Button size="sm" onClick={() => { setCustomerView("account"); window.scrollTo(0, 0); }} className="hidden md:flex bg-primary hover:bg-primary/90">
              <User className="h-4 w-4 mr-1" /> {user.name.split(" ")[0]}
            </Button>
          ) : (
            <Button size="sm" onClick={() => { setCustomerView("login"); window.scrollTo(0, 0); }} className="hidden md:flex bg-primary hover:bg-primary/90">
              <LogIn className="h-4 w-4 mr-1" /> {tr("nav_signin", lang)}
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label={tr("nav_menu", lang)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <button key={item.label} onClick={item.action} className={cn("px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md", isRtl ? "text-right" : "text-left")}>{item.label}</button>
            ))}
            <div className="border-t border-border my-1" />
            <button onClick={() => { setCustomerView("favorites"); window.scrollTo(0, 0); setMobileOpen(false); }} className={cn("px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md flex items-center justify-between", isRtl ? "text-right" : "text-left")}>
              {tr("nav_favorites", lang)}
              {favorites.length > 0 && <Badge className="bg-accent text-accent-foreground">{favorites.length}</Badge>}
            </button>
            {user ? (
              <button onClick={() => { setCustomerView("account"); window.scrollTo(0, 0); setMobileOpen(false); }} className={cn("px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md", isRtl ? "text-right" : "text-left")}>{tr("nav_hi", lang)} {user.name.split(" ")[0]}</button>
            ) : (
              <button onClick={() => { setCustomerView("login"); window.scrollTo(0, 0); setMobileOpen(false); }} className={cn("px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/50 rounded-md", isRtl ? "text-right" : "text-left")}>{tr("nav_signin", lang)}</button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
