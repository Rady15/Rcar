"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Calendar, MapPin, Clock, Info, Home, Car as CarIcon } from "lucide-react";

export function ConfirmationView() {
  const { lastBookingId, setLastBookingId, setCustomerView } = useAppStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lastBookingId) { setCustomerView("home"); return; }
    api<{ booking: Booking }>(`/api/bookings/${lastBookingId}`).then((res) => setBooking(res.booking)).finally(() => setLoading(false));
  }, [lastBookingId]);

  const handleBack = () => { setLastBookingId(null); setCustomerView("home"); window.scrollTo(0, 0); };

  if (loading) return <div className="container mx-auto px-4 py-8 max-w-2xl"><Skeleton className="h-96 rounded-xl" /></div>;
  if (!booking) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4"><CheckCircle2 className="h-12 w-12 text-emerald-600" /></div>
        <h1 className="text-3xl font-bold tracking-tight">Booking confirmed!</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">Your car is reserved. A confirmation has been sent to your email.</p>
      </div>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border"><span className="text-sm text-muted-foreground">Booking code</span><span className="font-mono font-bold text-primary">{booking.bookingCode}</span></div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-14 rounded-lg overflow-hidden bg-muted shrink-0"><img src={booking.car?.imageUrl} alt={booking.car?.brand} className="w-full h-full object-cover" /></div>
          <div><h3 className="font-semibold">{booking.car?.brand} {booking.car?.model}</h3><p className="text-xs text-muted-foreground">{booking.car?.year} • {booking.car?.category}</p></div>
        </div>
        <div className="space-y-3 pt-3 border-t border-border">
          <Row icon={MapPin} label="Pickup" value={booking.pickupLocation} />
          <Row icon={MapPin} label="Return" value={booking.returnLocation} />
          <Row icon={Calendar} label="Dates" value={`${formatDate(booking.pickupDate)} → ${formatDate(booking.returnDate)}`} />
          <Row icon={Clock} label="Duration" value={`${booking.daysCount} ${booking.daysCount === 1 ? "day" : "days"}`} />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border"><span className="font-semibold">Total paid</span><span className="text-2xl font-bold text-primary">{formatCurrency(booking.total)}</span></div>
      </Card>
      <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3"><Info className="h-5 w-5 text-primary shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground">Bring a valid driving license and the credit card used for payment at pickup. Please arrive 15 minutes before your scheduled pickup time.</p></div>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button onClick={handleBack} className="flex-1"><Home className="h-4 w-4 mr-2" /> Back to home</Button>
        <Button variant="outline" className="flex-1" onClick={() => { setLastBookingId(null); setCustomerView("my-trips"); window.scrollTo(0, 0); }}><CarIcon className="h-4 w-4 mr-2" /> View my trips</Button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; }) {
  return <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-sm text-muted-foreground w-20">{label}</span><span className="text-sm font-medium text-right flex-1">{value}</span></div>;
}
