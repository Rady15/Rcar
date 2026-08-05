"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { api, timeRemaining } from "@/lib/helpers";
import { Deal } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Timer, ArrowRight } from "lucide-react";

export function DealsView() {
  const { setSelectedCarId, setCustomerView } = useAppStore();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api<{ deals: Deal[] }>("/api/deals").then((res) => setDeals(res.deals)).finally(() => setLoading(false)); }, []);

  const goToCar = (carId: string | null) => { if (!carId) return; setSelectedCarId(carId); setCustomerView("car-detail"); window.scrollTo(0, 0); };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 mb-8 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2"><Tag className="h-5 w-5" /><h1 className="text-3xl font-bold">Deals & promotions</h1></div>
        <p className="opacity-90">Save big on your next rental. Limited time offers, updated daily.</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>
      ) : deals.length === 0 ? (
        <Card className="p-12 text-center"><h3 className="font-semibold mb-1">No active deals</h3><p className="text-sm text-muted-foreground">Check back soon for new promotions.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden p-0 gap-0">
              <div className="bg-gradient-to-r from-primary to-primary/70 p-4 flex items-center justify-between">
                <Badge className="bg-primary-foreground text-primary">{deal.discountLabel}</Badge>
                <div className="flex items-center gap-1.5 text-primary-foreground text-xs"><Timer className="h-3.5 w-3.5" />Ends in {timeRemaining(deal.endDate)}</div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold">{deal.title}</h3>
                {deal.car && (
                  <div className="flex items-center gap-3">
                    <img src={deal.car.imageUrl} alt={deal.car.brand} className="w-16 h-12 rounded-md object-cover" />
                    <div><p className="text-sm font-semibold">{deal.car.brand} {deal.car.model}</p><p className="text-xs text-muted-foreground">From ${deal.car.pricePerDay}/day</p></div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{deal.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div><p className="text-xs text-muted-foreground">Promo code</p><code className="text-sm font-mono font-bold text-primary">{deal.promoCode}</code></div>
                  <Button size="sm" onClick={() => goToCar(deal.carId)} disabled={!deal.carId}>Claim <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
