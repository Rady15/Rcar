"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api, CAR_CATEGORIES } from "@/lib/helpers";
import { Car } from "@/lib/types";
import { CarCard } from "@/components/shared/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, X, MapPin, Calendar, Clock } from "lucide-react";

type SortOption = "recommended" | "price_low" | "price_high" | "rating";

export function BrowseView() {
  const {
    setSelectedCarId, setCustomerView, browseCategory, setBrowseCategory,
    lang, searchDraft, setSearchDraft,
  } = useAppStore();
  const isRtl = lang === "ar";

  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(browseCategory);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [showFilters, setShowFilters] = useState(browseCategory !== "all" || !!searchDraft);

  // Categories translated
  const CATS = CAR_CATEGORIES.map((c) => ({
    value: c.value,
    label: c.value === "all" ? tr("cat_all", lang)
      : c.value === "sedan" ? tr("cat_sedan", lang)
      : c.value === "suv" ? tr("cat_suv", lang)
      : c.value === "sports" ? tr("cat_sports", lang)
      : c.value === "luxury" ? tr("cat_luxury", lang)
      : c.value === "electric" ? tr("cat_electric", lang)
      : c.value === "convertible" ? tr("cat_convertible", lang)
      : tr("cat_van", lang),
  }));

  useEffect(() => {
    api<{ cars: Car[] }>("/api/cars").then((res) => setAllCars(res.cars)).finally(() => setLoading(false));
  }, []);

  // If a search draft sets a carType, pre-filter by category and open filters
  useEffect(() => {
    if (searchDraft?.carType) {
      setCategory(searchDraft.carType);
      setShowFilters(true);
    }
  }, [searchDraft]);

  // Sync from browseCategory (set when clicking category tiles on home)
  useEffect(() => {
    // Don't override if a search draft carType is active
    if (!searchDraft?.carType) {
      setCategory(browseCategory);
      setShowFilters(browseCategory !== "all");
    }
  }, [browseCategory, searchDraft]);

  const resetFilters = () => {
    setSearch(""); setCategory("all"); setBrowseCategory("all"); setMaxPrice(1000); setSort("recommended"); setSearchDraft(null);
  };

  const filtered = useMemo(() => {
    let list = allCars.filter((c) => c.pricePerDay <= maxPrice);
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q) || c.color.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price_low": list = [...list].sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case "price_high": list = [...list].sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      default: list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [allCars, search, category, maxPrice, sort]);

  const goToDetail = (id: string) => { setSelectedCarId(id); setCustomerView("car-detail"); window.scrollTo(0, 0); };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{tr("browse_title", lang)}</h1>
        <p className="text-muted-foreground">{filtered.length} {tr("browse_count", lang)}</p>
      </div>

      {/* Applied search draft summary (from hero form) */}
      {searchDraft && (searchDraft.location || searchDraft.pickupDate || searchDraft.carType) && (
        <Card className="p-4 mb-4 bg-primary/5 border-primary/20">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-primary">{isRtl ? "بحثك:" : "Your search:"}</span>
            {searchDraft.location && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" /> {searchDraft.location}
              </Badge>
            )}
            {searchDraft.pickupDate && (
              <Badge variant="secondary" className="gap-1">
                {searchDraft.carType ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                {searchDraft.carType
                  ? (isRtl ? `اشتراك ${searchDraft.pickupDate} شهر` : `${searchDraft.pickupDate} months`)
                  : new Date(searchDraft.pickupDate).toLocaleDateString(isRtl ? "ar" : "en")}
              </Badge>
            )}
            {searchDraft.returnDate && !searchDraft.carType && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                {isRtl ? "حتى" : "until"} {new Date(searchDraft.returnDate).toLocaleDateString(isRtl ? "ar" : "en")}
              </Badge>
            )}
            {searchDraft.carType && (
              <Badge variant="secondary" className="gap-1 capitalize">
                <Search className="h-3 w-3" /> {searchDraft.carType}
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSearchDraft(null)} className="ml-auto">
              <X className="h-3.5 w-3.5" /> {isRtl ? "مسح" : "Clear"}
            </Button>
          </div>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
          <Input placeholder={tr("browse_search_placeholder", lang)} value={search} onChange={(e) => setSearch(e.target.value)} className={isRtl ? "pr-9" : "pl-9"} />
          {search && <button onClick={() => setSearch("")} className={isRtl ? "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" : "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"}><X className="h-4 w-4" /></button>}
        </div>
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal className="h-4 w-4 mr-2" />{tr("browse_filters", lang)}</Button>
      </div>
      {showFilters && (
        <div className="mb-6 p-4 rounded-lg border border-border bg-card space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">{tr("browse_category", lang)}</h3>
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <Button key={c.value} size="sm" variant={category === c.value ? "default" : "outline"} onClick={() => setCategory(c.value)}>{c.label}</Button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">{tr("browse_max_price", lang)}</h3>
              <span className="text-sm font-medium text-primary">${maxPrice}</span>
            </div>
            <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={40} max={1000} step={10} />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">{tr("browse_sort", lang)}</h3>
            <div className="flex flex-wrap gap-2">
              {([
                ["recommended", tr("browse_sort_recommended", lang)],
                ["price_low", tr("browse_sort_price_low", lang)],
                ["price_high", tr("browse_sort_price_high", lang)],
                ["rating", tr("browse_sort_rating", lang)],
              ] as [SortOption, string][]).map(([v, l]) => (
                <Button key={v} size="sm" variant={sort === v ? "default" : "outline"} onClick={() => setSort(v)}>{l}</Button>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>{tr("browse_reset", lang)}</Button>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4"><Search className="h-8 w-8 text-muted-foreground" /></div>
          <h3 className="text-lg font-semibold mb-1">{tr("browse_no_results", lang)}</h3>
          <p className="text-sm text-muted-foreground mb-4">{tr("browse_no_results_desc", lang)}</p>
          <Button onClick={resetFilters}>{tr("browse_reset", lang)}</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((car) => <CarCard key={car.id} car={car} onClick={() => goToDetail(car.id)} />)}
        </div>
      )}
    </div>
  );
}
