"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { api, CAR_CATEGORIES } from "@/lib/helpers";
import { Car } from "@/lib/types";
import { CarCard } from "@/components/shared/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";

type SortOption = "recommended" | "price_low" | "price_high" | "rating";

export function BrowseView() {
  const { setSelectedCarId, setCustomerView, browseCategory, setBrowseCategory } = useAppStore();
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(browseCategory);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [showFilters, setShowFilters] = useState(browseCategory !== "all");

  useEffect(() => {
    api<{ cars: Car[] }>("/api/cars").then((res) => setAllCars(res.cars)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategory(browseCategory);
    setShowFilters(browseCategory !== "all");
  }, [browseCategory]);

  const resetFilters = () => {
    setSearch(""); setCategory("all"); setBrowseCategory("all"); setMaxPrice(1000); setSort("recommended");
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Browse cars</h1>
        <p className="text-muted-foreground">{filtered.length} {filtered.length === 1 ? "car" : "cars"} available</p>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by brand, model, color..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
        </div>
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal className="h-4 w-4 mr-2" />Filters</Button>
      </div>
      {showFilters && (
        <div className="mb-6 p-4 rounded-lg border border-border bg-card space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {CAR_CATEGORIES.map((c) => (
                <Button key={c.value} size="sm" variant={category === c.value ? "default" : "outline"} onClick={() => setCategory(c.value)}>{c.label}</Button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Max price per day</h3>
              <span className="text-sm font-medium text-primary">${maxPrice}</span>
            </div>
            <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={40} max={1000} step={10} />
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Sort by</h3>
            <div className="flex flex-wrap gap-2">
              {([["recommended", "Recommended"], ["price_low", "Price: Low to High"], ["price_high", "Price: High to Low"], ["rating", "Top Rated"]] as [SortOption, string][]).map(([v, l]) => (
                <Button key={v} size="sm" variant={sort === v ? "default" : "outline"} onClick={() => setSort(v)}>{l}</Button>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>Reset filters</Button>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4"><Search className="h-8 w-8 text-muted-foreground" /></div>
          <h3 className="text-lg font-semibold mb-1">No cars found</h3>
          <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
          <Button onClick={resetFilters}>Reset filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((car) => <CarCard key={car.id} car={car} onClick={() => goToDetail(car.id)} />)}
        </div>
      )}
    </div>
  );
}
