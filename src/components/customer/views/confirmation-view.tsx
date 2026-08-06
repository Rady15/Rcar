"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Calendar, MapPin, Clock, Info, Home, Car as CarIcon, KeyRound, CreditCard } from "lucide-react";

export function ConfirmationView() {
  const { lastBookingId, setLastBookingId, setCustomerView, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lastBookingId) { setCustomerView("home"); return; }
    api<{ booking: any }>(`/api/bookings/${lastBookingId}`).then((res) => setBooking(res.booking)).finally(() => setLoading(false));
  }, [lastBookingId]);

  const handleBack = () => { setLastBookingId(null); setCustomerView("home"); window.scrollTo(0, 0); };

  if (loading) return <div className="container mx-auto px-4 py-8 max-w-2xl"><Skeleton className="h-96 rounded-xl" /></div>;
  if (!booking) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl" dir={isRtl ? "rtl" : "ltr"}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4"><CheckCircle2 className="h-12 w-12 text-emerald-600" /></div>
        <h1 className="text-3xl font-bold tracking-tight">{tr("confirm_title", lang)}</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">{tr("confirm_subtitle", lang)}</p>
      </div>

      {/* OTP highlight card */}
      {booking.pickupOtp && (
        <Card className="p-5 mb-4 bg-gradient-to-br from-primary to-primary/80 border-0 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur">
              <KeyRound className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm opacity-90">{isRtl ? "رمز الاستلام — أعطه للموظف عند استلام السيارة" : "Pickup OTP — show this to staff when collecting your car"}</p>
              <p className="text-4xl font-extrabold font-mono tracking-[0.3em] mt-1">{booking.pickupOtp}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border"><span className="text-sm text-muted-foreground">{isRtl ? "كود الحجز" : "Booking code"}</span><span className="font-mono font-bold text-primary">{booking.bookingCode}</span></div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-14 rounded-lg overflow-hidden bg-muted shrink-0"><img src={booking.car?.imageUrl} alt={booking.car?.brand} className="w-full h-full object-cover" /></div>
          <div><h3 className="font-semibold">{booking.car?.brand} {booking.car?.model}</h3><p className="text-xs text-muted-foreground">{booking.car?.year} • {tr(`cat_${booking.car?.category || "sedan"}`, lang)}</p></div>
        </div>
        <div className="space-y-3 pt-3 border-t border-border">
          <Row icon={MapPin} label={tr("confirm_pickup", lang)} value={booking.pickupLocation} />
          <Row icon={MapPin} label={tr("confirm_return", lang)} value={booking.returnLocation} />
          <Row icon={Calendar} label={tr("confirm_dates", lang)} value={`${formatDate(booking.pickupDate)} → ${formatDate(booking.returnDate)}`} />
          <Row icon={Clock} label={tr("booking_duration", lang)} value={`${booking.daysCount} ${booking.daysCount === 1 ? tr("booking_day", lang) : tr("booking_days", lang)}`} />
        </div>

        {/* Price breakdown */}
        <div className="space-y-1.5 pt-3 border-t border-border text-sm">
          <div className="flex justify-between text-muted-foreground"><span>{tr("booking_base", lang)}</span><span>{formatCurrency(booking.subtotal - (booking.insuranceFee > 0 ? booking.insuranceFee : 0))}</span></div>
          {booking.insuranceFee > 0 && <div className="flex justify-between text-muted-foreground"><span>{tr("booking_insurance_label", lang)}</span><span>{formatCurrency(booking.insuranceFee)}</span></div>}
          <div className="flex justify-between text-muted-foreground"><span>{tr("booking_service_fee", lang)}</span><span>{formatCurrency(booking.serviceFee)}</span></div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="font-semibold">{tr("confirm_total_paid", lang)}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <CreditCard className="h-3 w-3 text-emerald-600" />
              <span className="text-xs text-emerald-600 font-medium">{isRtl ? "مدفوع" : "Paid"} • {booking.paymentMethod || "card"}</span>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary">{formatCurrency(booking.total)}</span>
        </div>
      </Card>

      <Card className="p-4 mt-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3"><Info className="h-5 w-5 text-primary shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground">{tr("confirm_reminder", lang)}</p></div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button onClick={handleBack} className="flex-1"><Home className="h-4 w-4 mr-2" /> {tr("confirm_back_home", lang)}</Button>
        <Button variant="outline" className="flex-1" onClick={() => { setLastBookingId(null); setCustomerView("my-trips"); window.scrollTo(0, 0); }}><CarIcon className="h-4 w-4 mr-2" /> {tr("confirm_view_trips", lang)}</Button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; }) {
  return <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-muted-foreground shrink-0" /><span className="text-sm text-muted-foreground w-20">{label}</span><span className="text-sm font-medium text-right flex-1">{value}</span></div>;
}
