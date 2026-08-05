"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { api, CAR_CATEGORIES } from "@/lib/helpers";
import { Car } from "@/lib/types";
import { SiteContent, StatItem, HowItWorksStep } from "@/lib/site-content-types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CarCard } from "@/components/shared/car-card";
import { YeloHero } from "@/components/customer/yelo-hero";
import { tr } from "@/lib/i18n";
import {
  Reveal, Stagger, StaggerItem, MagneticWrap, useScrollToSection, ScrollProgress,
} from "@/components/shared/motion-primitives";
import {
  Star, Search, ArrowRight, ArrowDown, Shield, Calendar, Zap, Award,
  Car as CarIcon, Users, TrendingUp, Sparkles, Quote,
} from "lucide-react";

interface Deal {
  id: string; title: string; description: string;
  discountLabel: string; promoCode: string; endDate: string;
  car: { brand: string; model: string; imageUrl: string } | null;
}

const STAT_ICONS: Record<StatItem["icon"], React.ComponentType<{ className?: string }>> = {
  car: CarIcon, calendar: Calendar, star: Star, shield: Shield, users: Users, zap: Zap, award: Award,
};

const HOW_ICONS: Record<HowItWorksStep["icon"], React.ComponentType<{ className?: string }>> = {
  search: Search, calendar: Calendar, shield: Shield, zap: Zap, car: CarIcon, users: Users,
};

// Real car images for each category — used in the scrolling marquee
const CATEGORY_IMAGES: Record<string, string> = {
  sedan: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80",
  suv: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80",
  sports: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
  luxury: "https://images.unsplash.com/photo-1617788138017-80ad40656699?auto=format&fit=crop&w=600&q=80",
  electric: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80",
  convertible: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
  van: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80",
};

export function HomeView() {
  const { setCustomerView, setSelectedCarId, setBrowseCategory, setHomeScrollTarget, homeScrollTarget, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [featured, setFeatured] = useState<Car[]>([]);
  const [popular, setPopular] = useState<Car[]>([]);
  const [cheap, setCheap] = useState<Car[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (homeScrollTarget) {
      const el = document.getElementById(homeScrollTarget);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      setHomeScrollTarget(null);
    }
  }, [homeScrollTarget, setHomeScrollTarget]);

  useEffect(() => {
    Promise.all([
      api<{ cars: Car[] }>("/api/cars?featured=true"),
      api<{ cars: Car[] }>("/api/cars?sort=recommended"),
      api<{ cars: Car[] }>("/api/cars?sort=price_low"),
      api<{ deals: Deal[] }>("/api/deals"),
      api<SiteContent>("/api/site-content"),
    ]).then(([f, p, c, d, sc]) => {
      setFeatured(f.cars.slice(0, 6));
      setPopular(p.cars.slice(0, 4));
      setCheap(c.cars.slice(0, 4));
      setDeals(d.deals.slice(0, 3));
      setContent(sc);
    }).finally(() => setLoading(false));
  }, []);

  const goToDetail = (id: string) => { setSelectedCarId(id); setCustomerView("car-detail"); window.scrollTo(0, 0); };
  const goToBrowseWithCategory = (cat: string) => { setBrowseCategory(cat); setCustomerView("browse"); window.scrollTo(0, 0); };
  const scrollTo = useScrollToSection();

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-96 rounded-2xl mb-6" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="relative" dir={isRtl ? "rtl" : "ltr"}>
      <ScrollProgress />
      <YeloHero
        onSearch={() => scrollTo("categories-section")}
        onSignIn={() => setCustomerView("login")}
      />

      {content.stats.length > 0 && (
        <section className="border-y border-border bg-card">
          <Stagger className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {content.stats.map((s, i) => {
              const Icon = STAT_ICONS[s.icon] || CarIcon;
              const labelMap: Record<string, string> = {
                "Premium cars": tr("stat_premium_cars", lang),
                "Trips completed": tr("stat_trips", lang),
                "Average rating": tr("stat_rating", lang),
                "Roadside help": tr("stat_support", lang),
              };
              return (
                <StaggerItem key={i} className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold leading-none">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{labelMap[s.label] || s.label}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      )}

      {/* CATEGORIES — Real car images + horizontal scrolling marquee */}
      <section id="categories-section" className="py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <Reveal className="max-w-2xl mb-10">
            <Badge variant="secondary" className="mb-3"><Sparkles className="h-3 w-3 mr-1" /> {tr("section_find_fit", lang)}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              {tr("section_categories_title", lang).split(" ").slice(0, -1).join(" ")} <span className="text-primary italic font-serif">{tr("section_categories_title", lang).split(" ").slice(-1)}</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">{tr("section_categories_desc", lang)}</p>
          </Reveal>
        </div>

        {/* Marquee container — full width, overflows hidden */}
        <div className="relative" dir={isRtl ? "rtl" : "ltr"}>
          {/* Edge fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <motion.div
            className="flex gap-4 md:gap-6 w-max"
            animate={{ x: isRtl ? ["-50%", "0%"] : ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
          >
            {/* Render categories twice for seamless loop */}
            {[...CAR_CATEGORIES.filter((c) => c.value !== "all"), ...CAR_CATEGORIES.filter((c) => c.value !== "all")].map((cat, i) => {
              const img = CATEGORY_IMAGES[cat.value] || CATEGORY_IMAGES["sedan"];
              return (
                <button
                  key={`${cat.value}-${i}`}
                  onClick={() => goToBrowseWithCategory(cat.value)}
                  className="group relative shrink-0 w-72 md:w-80 h-48 md:h-56 rounded-2xl overflow-hidden border border-border hover:border-primary hover:shadow-2xl transition-all duration-300"
                >
                  {/* Real car image */}
                  <img
                    src={img}
                    alt={tr(`cat_${cat.value}`, lang)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Category label — bottom */}
                  <div className={`absolute bottom-0 ${isRtl ? "right-0" : "left-0"} p-5 ${isRtl ? "text-right" : "text-left"}`}>
                    <p className="text-2xl font-extrabold text-white drop-shadow-lg">{tr(`cat_${cat.value}`, lang)}</p>
                    <p className="text-sm text-white/80 mt-0.5">{tr(`browse_browse_${cat.value}`, lang)}</p>
                    <div className="flex items-center gap-1 mt-2 text-primary-foreground">
                      <span className="text-xs font-semibold bg-primary/80 backdrop-blur px-2 py-1 rounded-full">
                        {isRtl ? "تصفّح الآن" : "Browse now"}
                      </span>
                      <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""} group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </div>

                  {/* Hover shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-500" />
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id="featured-section" className="border-y border-border bg-gradient-to-b from-accent/10 via-background to-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10 gap-4">
            <Reveal>
              <Badge variant="secondary" className="mb-3"><Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" /> {tr("section_featured_badge", lang)}</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{tr("section_featured_title", lang)}</h2>
              <p className="text-muted-foreground mt-2">{tr("section_featured_desc", lang)}</p>
            </Reveal>
            <Button variant="ghost" className="hidden md:flex shrink-0" onClick={() => goToBrowseWithCategory("all")}>{isRtl ? "عرض الكل" : "See all"} <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((car) => <StaggerItem key={car.id}><CarCard car={car} onClick={() => goToDetail(car.id)} /></StaggerItem>)}
            </Stagger>
          )}
          <div className="md:hidden mt-6 text-center">
            <Button variant="outline" onClick={() => goToBrowseWithCategory("all")}>{isRtl ? "عرض كل السيارات" : "See all cars"} <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </div>
        </div>
      </section>

      {deals.length > 0 && (
        <section id="deals-section" className="container mx-auto px-4 py-20 md:py-28">
          <Reveal className="max-w-2xl mb-10">
            <Badge className="mb-3 bg-primary text-primary-foreground"><Zap className="h-3 w-3 mr-1" /> {tr("section_deals_badge", lang)}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{tr("section_deals_title", lang)}</h2>
            <p className="text-muted-foreground mt-3 text-lg">{tr("section_deals_desc", lang)}</p>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deals.map((deal) => (
              <StaggerItem key={deal.id}>
                <button onClick={() => setCustomerView("deals")} className={`group block w-full ${isRtl ? "text-right" : "text-left"} rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-primary-foreground text-primary">{deal.discountLabel}</Badge>
                      <span className="text-xs opacity-80">{isRtl ? "ينتهي" : "Ends"} {new Date(deal.endDate).toLocaleDateString(isRtl ? "ar" : "en")}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight">{deal.title}</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{deal.description}</p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{deal.promoCode}</code>
                      <span className="text-xs text-primary font-medium flex items-center group-hover:translate-x-1 transition-transform">{tr("deals_claim", lang)} <ArrowRight className="h-3 w-3 ml-1" /></span>
                    </div>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {content.howItWorks.length > 0 && (
        <section id="how-section" className="border-y border-border bg-card py-20 md:py-28">
          <div className="container mx-auto px-4">
            <Reveal className="max-w-2xl mb-12">
              <Badge variant="secondary" className="mb-3"><Calendar className="h-3 w-3 mr-1" /> {isRtl ? "4 خطوات بسيطة" : "4 simple steps"}</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{tr("section_how_title_1", lang)} <span className="text-primary">{tr("section_how_title_2", lang)}</span></h2>
              <p className="text-muted-foreground mt-3 text-lg">{tr("section_how_desc", lang)}</p>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.howItWorks.map((step, i) => {
                const Icon = HOW_ICONS[step.icon] || Search;
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="relative p-6 rounded-2xl border border-border bg-background h-full">
                      <span className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} text-5xl font-bold text-muted/40 select-none`}>{step.step}</span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4"><Icon className="h-6 w-6" /></div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section id="popular-section" className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex items-end justify-between mb-10 gap-4">
          <Reveal>
            <Badge variant="secondary" className="mb-3"><TrendingUp className="h-3 w-3 mr-1" /> {tr("section_popular_badge", lang)}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{tr("section_popular_title", lang)}</h2>
            <p className="text-muted-foreground mt-2">{tr("section_popular_desc", lang)}</p>
          </Reveal>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((car) => <StaggerItem key={car.id}><CarCard car={car} onClick={() => goToDetail(car.id)} /></StaggerItem>)}
          </Stagger>
        )}
      </section>

      {content.testimonials.length > 0 && (
        <section id="testimonials-section" className="border-y border-border bg-gradient-to-b from-background via-accent/5 to-background py-20 md:py-28">
          <div className="container mx-auto px-4">
            <Reveal className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-3"><Quote className="h-3 w-3 mr-1" /> {isRtl ? "مستأجرون حقيقيون، تقييمات حقيقية" : "Real renters, real reviews"}</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{tr("section_testimonials_title_1", lang)} <span className="text-primary italic font-serif">{tr("section_testimonials_title_2", lang)}</span></h2>
              <p className="text-muted-foreground mt-3 text-lg">{tr("section_testimonials_desc", lang)}</p>
            </Reveal>
            <Stagger className="grid md:grid-cols-3 gap-4">
              {content.testimonials.map((t, i) => (
                <StaggerItem key={i}>
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />)}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed flex-1 mb-4">&quot;{t.text}&quot;</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{t.initials}</div>
                      <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section id="budget-section" className="container mx-auto px-4 py-20 md:py-28">
        <Reveal className="max-w-2xl mb-10">
          <Badge variant="secondary" className="mb-3"><Award className="h-3 w-3 mr-1" /> {tr("section_budget_badge", lang)}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{tr("section_budget_title", lang).split("$")[0]}<span className="text-primary">$100/{isRtl ? "يوم" : "day"}</span></h2>
          <p className="text-muted-foreground mt-3 text-lg">{tr("section_budget_desc", lang)}</p>
        </Reveal>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cheap.map((car) => <StaggerItem key={car.id}><CarCard car={car} onClick={() => goToDetail(car.id)} /></StaggerItem>)}
          </Stagger>
        )}
      </section>

      <FinalCTA cta={content.finalCta} onGetStarted={() => setCustomerView("login")} onBrowse={() => goToBrowseWithCategory("all")} lang={lang} />
    </div>
  );
}

const HeroSection = (function HeroSection({
  hero, onBrowse, onDeals, onSignIn,
}: {
  hero: SiteContent["hero"];
  onBrowse: () => void; onDeals: () => void; onSignIn: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <img src={hero.imageUrl} alt="Featured luxury car" className="w-full h-[120%] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </motion.div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
      </div>
      <motion.div style={{ y: textY, opacity: textOpacity }} className="container mx-auto px-4 relative z-10 pt-20 pb-16">
        <div className="max-w-2xl">
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <Badge variant="secondary" className="mb-5 px-3 py-1.5"><Zap className="h-3 w-3 mr-1" /> {hero.badge}</Badge>
          </motion.div>
          <motion.h1 initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
            {hero.title} <span className="text-primary">{hero.highlightedWord}</span>
            <br />
            <motion.span initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="italic font-serif text-4xl md:text-6xl text-muted-foreground">{hero.italicWord}</motion.span>
          </motion.h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg md:text-xl text-muted-foreground max-w-xl mt-6 leading-relaxed">{hero.subtitle}</motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 mt-8">
            <MagneticWrap>
              <Button size="lg" onClick={onBrowse} className="text-base h-12 px-7"><Search className="h-4 w-4 mr-2" /> {hero.primaryBtn}</Button>
            </MagneticWrap>
            <Button size="lg" variant="outline" onClick={onDeals} className="text-base h-12 px-7 bg-background/80 backdrop-blur">{hero.secondaryBtn} <ArrowRight className="h-4 w-4 ml-2" /></Button>
          </motion.div>
          {hero.showBadges && (
            <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mt-8">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Free insurance</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Free cancellation</span>
              <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-primary" /> 24/7 support</span>
            </motion.div>
          )}
          <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="text-xs text-muted-foreground mt-10">
            {hero.signInLabel} <button onClick={onSignIn} className="text-primary underline hover:no-underline">Sign in</button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs">{hero.scrollHint}</span>
        <motion.div animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}><ArrowDown className="h-4 w-4" /></motion.div>
      </motion.div>
    </section>
  );
}) as React.ForwardRefExoticComponent<
  {
    hero: SiteContent["hero"];
    onBrowse: () => void; onDeals: () => void; onSignIn: () => void;
  } & React.RefAttributes<HTMLDivElement>
>;

function FinalCTA({ cta, onGetStarted, onBrowse, lang }: { cta: SiteContent["finalCta"]; onGetStarted: () => void; onBrowse: () => void; lang: "ar" | "en"; }) {
  const isRtl = lang === "ar";
  const title = isRtl ? tr("section_cta_title", lang) : cta.title;
  const subtitle = isRtl ? tr("section_cta_desc", lang) : cta.subtitle;
  const primaryBtn = isRtl ? tr("section_cta_primary", lang) : cta.primaryBtn;
  const secondaryBtn = isRtl ? tr("section_cta_secondary", lang) : cta.secondaryBtn;
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <Reveal>
        <Card className="relative overflow-hidden p-8 md:p-16 bg-gradient-to-br from-primary to-primary/80 border-0 text-primary-foreground">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative text-center max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{title}</h2>
            <p className="text-primary-foreground/80 text-lg">{subtitle}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <MagneticWrap>
                <Button size="lg" variant="secondary" onClick={onGetStarted} className="text-base h-12 px-7">{primaryBtn}</Button>
              </MagneticWrap>
              <Button size="lg" variant="outline" onClick={onBrowse} className="text-base h-12 px-7 bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">{secondaryBtn}</Button>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
