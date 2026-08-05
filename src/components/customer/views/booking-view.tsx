"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { api, formatCurrency, CAR_LOCATIONS, BOOKING_EXTRAS } from "@/lib/helpers";
import { Car } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Shield, CheckCircle2, Clock } from "lucide-react";

export function BookingView() {
  const { selectedCarId, setSelectedCarId, setCustomerView, user, bookingDraft, setBookingDraft, setLastBookingId } = useAppStore();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const draft = bookingDraft || {
    pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    returnDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    pickupLocation: "New York Downtown", returnLocation: "New York Downtown",
    extras: [] as string[], insurance: true,
  };

  useEffect(() => {
    if (!selectedCarId) { setCustomerView("browse"); return; }
    api<{ car: Car }>(`/api/cars/${selectedCarId}`).then((res) => setCar(res.car)).finally(() => setLoading(false));
  }, [selectedCarId]);

  const days = Math.max(1, Math.ceil((new Date(draft.returnDate).getTime() - new Date(draft.pickupDate).getTime()) / 86400000));
  const extrasTotal = draft.extras.reduce((s, id) => s + (BOOKING_EXTRAS.find((x) => x.id === id)?.price || 0), 0) * days;
  const subtotal = (car?.pricePerDay || 0) * days + extrasTotal;
  const insuranceFee = draft.insurance ? 12 * days : 0;
  const serviceFee = subtotal * 0.08;
  const total = subtotal + insuranceFee + serviceFee;

  const toggleExtra = (id: string) => {
    const cur = draft.extras;
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    setBookingDraft({ ...draft, extras: next });
  };

  const handleSubmit = async () => {
    if (!user || !car) return;
    setSubmitting(true);
    try {
      const res = await api<{ booking: { id: string } }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ userId: user.id, carId: car.id, pickupDate: draft.pickupDate, returnDate: draft.returnDate, pickupLocation: draft.pickupLocation, returnLocation: draft.returnLocation, extras: draft.extras, insurance: draft.insurance }),
      });
      setLastBookingId(res.booking.id);
      setCustomerView("payment");
      window.scrollTo(0, 0);
    } catch (e) {
      toast.error("Booking failed", { description: e instanceof Error ? e.message : "Unknown error" });
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><Skeleton className="h-16 rounded-xl mb-4" /><Skeleton className="h-96 rounded-xl" /></div>;
  if (!car) return <div className="container mx-auto px-4 py-16 text-center"><h2 className="text-xl font-semibold">Car not found</h2><Button className="mt-4" onClick={() => setCustomerView("browse")}>Back to browse</Button></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" size="sm" onClick={() => { setSelectedCarId(null); setCustomerView("car-detail"); window.scrollTo(0, 0); }} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Back to car</Button>
      <h1 className="text-2xl font-bold mb-1">Book your car</h1>
      <p className="text-muted-foreground mb-6">Review your trip details and continue to payment</p>
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="w-24 h-20 rounded-lg overflow-hidden bg-muted shrink-0"><img src={car.imageUrl} alt={car.brand} className="w-full h-full object-cover" /></div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{car.brand} {car.model}</h3>
            <p className="text-xs text-muted-foreground">{car.year} • {car.category} • {car.transmission}</p>
            <p className="text-sm font-semibold text-primary mt-1">{formatCurrency(car.pricePerDay)}/day</p>
          </div>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /><h2 className="font-semibold">Pickup & return dates</h2></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="pickup" className="text-xs">Pickup date</Label><Input id="pickup" type="date" value={draft.pickupDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingDraft({ ...draft, pickupDate: e.target.value })} /></div>
              <div><Label htmlFor="return" className="text-xs">Return date</Label><Input id="return" type="date" value={draft.returnDate} min={draft.pickupDate} onChange={(e) => setBookingDraft({ ...draft, returnDate: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />Duration: {days} {days === 1 ? "day" : "days"}</div>
          </Card>
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><h2 className="font-semibold">Pickup & return locations</h2></div>
            <div className="space-y-3">
              <div><Label className="text-xs">Pickup location</Label><select value={draft.pickupLocation} onChange={(e) => setBookingDraft({ ...draft, pickupLocation: e.target.value })} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">{CAR_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
              <div><Label className="text-xs">Return location</Label><select value={draft.returnLocation} onChange={(e) => setBookingDraft({ ...draft, returnLocation: e.target.value })} className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">{CAR_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
            </div>
          </Card>
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-emerald-600" /><h2 className="font-semibold">Comprehensive insurance</h2></div>
            <p className="text-sm text-muted-foreground">Covers collision, theft, and third-party damage. Highly recommended.</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Switch checked={draft.insurance} onCheckedChange={(v) => setBookingDraft({ ...draft, insurance: v })} /><Label className="text-sm">Add insurance</Label></div>
              <span className="text-sm font-semibold text-emerald-600">+{formatCurrency(12)}/day</span>
            </div>
          </Card>
          <Card className="p-5 space-y-3">
            <h2 className="font-semibold">Add extras</h2>
            {BOOKING_EXTRAS.map((e) => {
              const selected = draft.extras.includes(e.id);
              return (
                <button key={e.id} onClick={() => toggleExtra(e.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>{selected && <CheckCircle2 className="h-3 w-3" />}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium">{e.label}</p><p className="text-xs text-muted-foreground">{e.desc}</p></div>
                  <span className="text-sm font-semibold text-primary shrink-0">+${e.price}/day</span>
                </button>
              );
            })}
          </Card>
        </div>
        <div>
          <Card className="p-5 sticky top-20 space-y-3">
            <h2 className="font-semibold">Price breakdown</h2>
            <Row label={`Base (${formatCurrency(car.pricePerDay)} × ${days} ${days === 1 ? "day" : "days"})`} value={car.pricePerDay * days} />
            {extrasTotal > 0 && <Row label="Extras" value={extrasTotal} />}
            {draft.insurance && <Row label={`Insurance (${formatCurrency(12)} × ${days} ${days === 1 ? "day" : "days"})`} value={insuranceFee} />}
            <Row label="Service fee (8%)" value={serviceFee} />
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
            <Button size="lg" className="w-full" onClick={handleSubmit} disabled={submitting}>{submitting ? "Processing..." : `Continue to payment • ${formatCurrency(total)}`}</Button>
            <p className="text-xs text-center text-muted-foreground">You won&apos;t be charged until pickup</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number; }) {
  return <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium">{formatCurrency(value)}</span></div>;
}
