"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tr } from "@/lib/i18n";
import {
  Menu, X, ChevronDown, Heart, Search, User, LogIn, Globe, Car,
} from "lucide-react";
import { useScrollToSection, useIsScrolled } from "@/components/shared/motion-primitives";
import { cn } from "@/lib/utils";

export function YeloNavbar() {
  const { user, setCustomerView, favorites, setHomeScrollTarget, setBrowseCategory, lang, setLang } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollTo = useScrollToSection();
  const scrolled = useIsScrolled(40);

  const goHomeThenScroll = (sectionId: string) => {
    const onHome = useAppStore.getState().customerView === "home";
    if (onHome) scrollTo(sectionId);
    else { setHomeScrollTarget(sectionId); setCustomerView("home"); }
    setMobileOpen(false);
  };

  const navItems: { label: string; action: () => void }[] = [
    { label: tr("nav_home", lang), action: () => { setCustomerView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); } },
    { label: tr("nav_browse", lang), action: () => { setBrowseCategory("all"); setCustomerView("browse"); window.scrollTo(0, 0); setMobileOpen(false); } },
    { label: tr("nav_deals", lang), action: () => goHomeThenScroll("deals-section") },
    { label: tr("nav_categories", lang), action: () => goHomeThenScroll("categories-section") },
  ];

  return (
    <header
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-3"
      )}
      style={{ fontFamily: "var(--font-arabic), 'Tajawal', 'Cairo', system-ui, sans-serif" }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo side (right in RTL, left in LTR) */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => { setCustomerView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-2 group"
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
              scrolled ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            )}>
              <Car className="h-5 w-5" />
            </div>
            <span className={cn(
              "text-xl font-extrabold tracking-tight transition-colors",
              scrolled ? "text-foreground" : "text-white"
            )}>
              {lang === "ar" ? "يلو" : "Yelo"}
            </span>
            <span className={cn(
              "text-sm font-medium hidden sm:inline transition-colors",
              scrolled ? "text-muted-foreground" : "text-white/80"
            )}>
              {lang === "ar" ? "Yelo" : "يلو"}
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "px-3 py-2 text-sm font-semibold rounded-lg transition-colors",
                  scrolled
                    ? "text-foreground hover:bg-accent/40 hover:text-primary"
                    : "text-white hover:bg-white/10"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Actions side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-semibold transition-colors",
              scrolled ? "text-foreground hover:bg-accent/40" : "text-white hover:bg-white/10"
            )}
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            <span>{lang === "ar" ? "EN" : "عرب"}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => { setCustomerView("favorites"); window.scrollTo(0, 0); }}
            className={cn(
              "relative p-2 rounded-lg transition-colors hidden md:flex",
              scrolled ? "text-foreground hover:bg-accent/40" : "text-white hover:bg-white/10"
            )}
            aria-label={tr("nav_favorites", lang)}
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <Badge className="absolute -top-1 -left-1 h-5 min-w-5 px-1 text-xs flex items-center justify-center bg-accent text-accent-foreground">
                {favorites.length}
              </Badge>
            )}
          </button>

          {/* Login / Account */}
          {user ? (
            <Button
              size="sm"
              onClick={() => { setCustomerView("account"); window.scrollTo(0, 0); }}
              variant={scrolled ? "default" : "secondary"}
              className={cn("gap-1.5", !scrolled && "bg-white/15 backdrop-blur text-white hover:bg-white/25")}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => { setCustomerView("login"); window.scrollTo(0, 0); }}
              variant={scrolled ? "default" : "secondary"}
              className={cn("gap-1.5", !scrolled && "bg-white/15 backdrop-blur text-white hover:bg-white/25")}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">{tr("nav_signin", lang)}</span>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              scrolled ? "text-foreground hover:bg-accent/40" : "text-white hover:bg-white/10"
            )}
            aria-label={tr("nav_menu", lang)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1" dir={lang === "ar" ? "rtl" : "ltr"}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/40 rounded-lg",
                  lang === "ar" ? "text-right" : "text-left"
                )}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-border my-1" />
            <button
              onClick={() => { setCustomerView("favorites"); window.scrollTo(0, 0); setMobileOpen(false); }}
              className={cn(
                "px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/40 rounded-lg flex items-center justify-between",
                lang === "ar" ? "text-right" : "text-left"
              )}
            >
              {tr("nav_favorites", lang)}
              {favorites.length > 0 && <Badge className="bg-accent text-accent-foreground">{favorites.length}</Badge>}
            </button>
            {user ? (
              <button
                onClick={() => { setCustomerView("account"); window.scrollTo(0, 0); setMobileOpen(false); }}
                className={cn(
                  "px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/40 rounded-lg",
                  lang === "ar" ? "text-right" : "text-left"
                )}
              >
                {tr("nav_hi", lang)} {user.name.split(" ")[0]}
              </button>
            ) : (
              <button
                onClick={() => { setCustomerView("login"); window.scrollTo(0, 0); setMobileOpen(false); }}
                className={cn(
                  "px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/40 rounded-lg",
                  lang === "ar" ? "text-right" : "text-left"
                )}
              >
                {tr("nav_signin_full", lang)}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
