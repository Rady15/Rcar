"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { api, formatCurrency, parseFeatures } from "@/lib/helpers";
import { Car, Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Heart, Share2, ArrowLeft, Users, Settings, Fuel, DoorOpen, Gauge, Timer, TrendingUp, CheckCircle2, Calendar, MapPin } from "lucide-react";

export function CarDetailView() {
  const { selectedCarId, setSelectedCarId, setCustomerView, favorites, toggleFavorite, user, setBookingDraft } = useAppStore();
  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCarId) { setCustomerView("browse"); return; }
    setLoading(true);
    api<{ car: Car; reviews: Review[] }>(`/api/cars/${selectedCarId}`).then((res) => { setCar(res.car); setReviews(res.reviews); }).finally(() => setLoading(false));
  }, [selectedCarId]);

  const handleBook = () => {
    if (!user) { setCustomerView("login"); return; }
    setBookingDraft({
      pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
      pickupLocation: "New York Downtown", returnLocation: "New York Downtown",
      extras: [], insurance: true,
    });
    setCustomerView("booking");
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 rounded-xl mb-6" />
        <div className="grid md:grid-cols-2 gap-6"><Skeleton className="h-64 rounded-xl" /><Skeleton className="h-64 rounded-xl" /></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold">Car not found</h2>
        <Button className="mt-4" onClick={() => setCustomerView("browse")}>Back to browse</Button>
      </div>
    );
  }

  const features = parseFeatures(car.features);
  const isFav = favorites.includes(car.id);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button variant="ghost" size="sm" onClick={() => { setSelectedCarId(null); setCustomerView("browse"); }}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to browse
      </Button>
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-muted">
        <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-black/70 text-white hover:bg-black/70"><Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />{car.rating.toFixed(1)} ({car.reviewCount} reviews)</Badge>
          {car.isFeatured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white" onClick={() => toggleFavorite(car.id)}>
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </Button>
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white"><Share2 className="h-4 w-4 text-gray-700" /></Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{car.brand} {car.model}</h1>
              <p className="text-muted-foreground mt-1">{car.year} • {car.color} • {car.category}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-primary">{formatCurrency(car.pricePerDay)}</div>
              <div className="text-sm text-muted-foreground">per day</div>
            </div>
          </div>
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SpecItem icon={Users} label="Seats" value={`${car.seats}`} />
              <SpecItem icon={Settings} label="Transmission" value={car.transmission === "automatic" ? "Auto" : "Manual"} />
              <SpecItem icon={Fuel} label="Fuel" value={car.fuelType} />
              <SpecItem icon={DoorOpen} label="Doors" value={`${car.doors}`} />
            </div>
          </Card>
          <div>
            <h2 className="text-xl font-bold mb-3">Performance</h2>
            <div className="grid grid-cols-3 gap-3">
              <PerfCard icon={Gauge} label="Horsepower" value={`${car.horsePower}`} unit="HP" color="text-red-600" />
              <PerfCard icon={TrendingUp} label="Top speed" value={`${Math.round(car.topSpeed)}`} unit="mph" color="text-primary" />
              <PerfCard icon={Timer} label="0-60 mph" value={car.zeroToHundred.toFixed(1)} unit="s" color="text-emerald-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">About this car</h2>
            <p className="text-muted-foreground leading-relaxed">{car.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">Features & equipment</h2>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => <Badge key={f} variant="secondary" className="px-3 py-1.5 text-sm"><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-primary" />{f}</Badge>)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Reviews</h2>
              <Badge variant="outline"><Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />{car.rating.toFixed(1)} • {car.reviewCount} reviews</Badge>
            </div>
            {reviews.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">No reviews yet. Be the first to review after your rental!</Card>
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, 3).map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{r.user?.name?.charAt(0) || "U"}</div>
                        <div>
                          <p className="text-sm font-semibold">{r.user?.name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}{r.tripType && ` • ${r.tripType}`}</p>
                        </div>
                      </div>
                      <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20 space-y-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">{formatCurrency(car.pricePerDay)}</span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Free cancellation up to 24h before pickup</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Flexible dates</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> 6 pickup locations</div>
              <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Insurance available</div>
            </div>
            <Button size="lg" className="w-full" onClick={handleBook} disabled={!car.isAvailable}>{car.isAvailable ? "Book now" : "Not available"}</Button>
            {!user && <p className="text-xs text-center text-muted-foreground">You&apos;ll need to sign in to complete booking</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; }) {
  return (
    <div className="flex flex-col items-center text-center p-2">
      <Icon className="h-5 w-5 text-primary mb-1" />
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function PerfCard({ icon: Icon, label, value, unit, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; unit: string; color: string; }) {
  return (
    <Card className="p-3 text-center">
      <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{unit}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </Card>
  );
}
