"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api } from "@/lib/helpers";
import { Car } from "@/lib/types";
import { CarCard } from "@/components/shared/car-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Search } from "lucide-react";

export function FavoritesView() {
  const { favorites, setSelectedCarId, setCustomerView, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) { setCars([]); setLoading(false); return; }
    api<{ cars: Car[] }>("/api/cars").then((res) => setCars(res.cars.filter((c) => favorites.includes(c.id)))).finally(() => setLoading(false));
  }, [favorites]);

  const goToDetail = (id: string) => { setSelectedCarId(id); setCustomerView("car-detail"); window.scrollTo(0, 0); };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir={isRtl ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold tracking-tight mb-1">{tr("fav_title", lang)}</h1>
      <p className="text-muted-foreground mb-6">{favorites.length} {favorites.length === 1 ? tr("fav_saved", lang) : tr("fav_saved_plural", lang)}</p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}</div>
      ) : cars.length === 0 ? (
        <Card className="p-12 text-center"><Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold mb-1">{tr("fav_empty", lang)}</h3><p className="text-sm text-muted-foreground mb-4">{tr("fav_empty_desc", lang)}</p><Button onClick={() => setCustomerView("browse")}><Search className="h-4 w-4 mr-2" />{tr("fav_browse", lang)}</Button></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{cars.map((car) => <CarCard key={car.id} car={car} onClick={() => goToDetail(car.id)} />)}</div>
      )}
    </div>
  );
}
