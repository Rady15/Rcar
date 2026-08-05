"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Car } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, Users, Settings, Fuel } from "lucide-react";
import { formatCurrency, parseFeatures } from "@/lib/helpers";

interface CarCardProps {
  car: Car;
  onClick?: () => void;
  compact?: boolean;
}

export function CarCard({ car, onClick }: CarCardProps) {
  const { favorites, toggleFavorite, lang } = useAppStore();
  const isRtl = lang === "ar";
  const isFav = favorites.includes(car.id);
  const features = parseFeatures(car.features);
  const reduce = useReducedMotion();

  const categoryLabel = tr(`cat_${car.category}`, lang);
  const transmissionLabel = car.transmission === "automatic" ? tr("detail_auto", lang) : tr("detail_manual", lang);

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className="group overflow-hidden hover:shadow-xl transition-shadow cursor-pointer p-0 gap-0"
        onClick={onClick}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge className="bg-black/70 text-white hover:bg-black/70">
              <Star className="h-3 w-3 mr-0.5 fill-amber-400 text-amber-400" />
              {car.rating.toFixed(1)}
            </Badge>
            {car.isFeatured && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                {isRtl ? "مميزة" : "Featured"}
              </Badge>
            )}
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
            onClick={(e) => { e.stopPropagation(); toggleFavorite(car.id); }}
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </Button>
        </div>
        <div className="p-4 space-y-3" dir={isRtl ? "rtl" : "ltr"}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{car.brand} {car.model}</h3>
              <p className="text-xs text-muted-foreground">{car.year} • {car.color} • {categoryLabel}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-primary">{formatCurrency(car.pricePerDay)}</div>
              <div className="text-xs text-muted-foreground">{isRtl ? "/يوم" : "/day"}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {car.seats} {isRtl ? "مقاعد" : "seats"}</span>
            <span className="flex items-center gap-1"><Settings className="h-3.5 w-3.5" /> {transmissionLabel}</span>
            <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" /> {tr(`fuel_${car.fuelType}`, lang)}</span>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 2).map((f) => (
                <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
              ))}
              {features.length > 2 && <Badge variant="outline" className="text-[10px]">+{features.length - 2}</Badge>}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
