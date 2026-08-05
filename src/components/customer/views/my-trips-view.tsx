"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Calendar, MapPin, Clock, Car as CarIcon, RefreshCw, XCircle,
  KeyRound, CreditCard, AlertCircle,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-500/15 text-amber-600",
  UPCOMING: "bg-primary/15 text-primary",
  ACTIVE: "bg-emerald-500/15 text-emerald-600",
  PICKED_UP: "bg-blue-500/15 text-blue-600",
  RETURNED: "bg-cyan-500/15 text-cyan-600",
  INSPECTED: "bg-purple-500/15 text-purple-600",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-500/15 text-red-600",
};

export function MyTripsView() {
  const { user, setCustomerView, setSelectedCarId, setLastBookingId, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!user) { setLoading(false); return; }
    api<{ bookings: Booking[] }>(`/api/bookings?userId=${user.id}`).then((res) => setBookings(res.bookings)).finally(() => setLoading(false));
  };
  useEffect(load, [user]);

  if (!user) {
    return <div className="container mx-auto px-4 py-16 text-center" dir={isRtl ? "rtl" : "ltr"}><h2 className="text-xl font-semibold mb-2">{tr("trips_signin_required", lang)}</h2><p className="text-muted-foreground mb-4">{tr("trips_signin_desc", lang)}</p><Button onClick={() => setCustomerView("login")}>{tr("trips_signin", lang)}</Button></div>;
  }

  const cancel = async (id: string) => {
    if (!confirm(tr("trips_cancel_msg", lang))) return;
    try {
      await api(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ id, status: "CANCELLED", refundStatus: "PENDING" }) });
      toast.success(tr("trips_cancelled_toast", lang)); load();
    } catch (e) { toast.error(isRtl ? "فشل الإلغاء" : "Failed to cancel"); }
  };

  const payNow = (booking: Booking) => {
    setLastBookingId(booking.id);
    setCustomerView("payment");
    window.scrollTo(0, 0);
  };

  const rebook = (carId: string) => { setSelectedCarId(carId); setCustomerView("car-detail"); window.scrollTo(0, 0); };

  // Active = PENDING_PAYMENT + UPCOMING + ACTIVE + PICKED_UP + RETURNED + INSPECTED
  const activeBookings = bookings.filter((b) => !["COMPLETED", "CANCELLED"].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  if (loading) return <div className="container mx-auto px-4 py-8" dir={isRtl ? "rtl" : "ltr"}><Skeleton className="h-10 rounded-lg mb-4" />{[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl mb-3" />)}</div>;

  const statusLabel = (s: string) => {
    const map: Record<string, { ar: string; en: string }> = {
      PENDING_PAYMENT: { ar: "بانتظار الدفع", en: "Pending Payment" },
      UPCOMING: { ar: "قادمة", en: "Upcoming" },
      ACTIVE: { ar: "نشطة", en: "Active" },
      PICKED_UP: { ar: "تم الاستلام", en: "Picked Up" },
      RETURNED: { ar: "تم الإرجاع", en: "Returned" },
      INSPECTED: { ar: "تم الفحص", en: "Inspected" },
      COMPLETED: { ar: "مكتملة", en: "Completed" },
      CANCELLED: { ar: "ملغاة", en: "Cancelled" },
    };
    return isRtl ? (map[s]?.ar || s) : (map[s]?.en || s);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir={isRtl ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold tracking-tight mb-1">{tr("trips_title", lang)}</h1>
      <p className="text-muted-foreground mb-6">{tr("trips_subtitle", lang)}</p>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">{isRtl ? "نشطة" : "Active"} ({activeBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">{tr("trips_completed", lang)} ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">{tr("trips_cancelled", lang)} ({cancelledBookings.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <BookingList bookings={activeBookings} onCancel={cancel} onPay={payNow} onRebook={undefined} statusLabel={statusLabel} lang={lang} />
        </TabsContent>
        <TabsContent value="completed">
          <BookingList bookings={completedBookings} onCancel={undefined} onPay={undefined} onRebook={rebook} statusLabel={statusLabel} lang={lang} />
        </TabsContent>
        <TabsContent value="cancelled">
          <BookingList bookings={cancelledBookings} onCancel={undefined} onPay={undefined} onRebook={rebook} statusLabel={statusLabel} lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingList({ bookings, onCancel, onPay, onRebook, statusLabel, lang }: {
  bookings: Booking[];
  onCancel?: (id: string) => void;
  onPay?: (booking: Booking) => void;
  onRebook?: (carId: string) => void;
  statusLabel: (s: string) => string;
  lang: "ar" | "en";
}) {
  const isRtl = lang === "ar";
  if (bookings.length === 0) return <Card className="p-12 text-center"><CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold mb-1">{tr("trips_empty", lang)}</h3><p className="text-sm text-muted-foreground">{tr("trips_empty_desc", lang)}</p></Card>;
  return (
    <div className="space-y-3">
      {bookings.map((b) => {
        const booking = b as any; // Allow access to new fields
        return (
        <Card key={b.id} className="p-4">
          <div className="flex gap-4">
            <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted shrink-0"><img src={b.car?.imageUrl} alt={b.car?.brand} className="w-full h-full object-cover" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0"><h3 className="font-semibold truncate">{b.car?.brand} {b.car?.model}</h3><p className="text-xs text-muted-foreground font-mono">{b.bookingCode}</p></div>
                <Badge className={STATUS_COLORS[b.status]} variant="secondary">{statusLabel(b.status)}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.daysCount} {b.daysCount === 1 ? tr("booking_day", lang) : tr("booking_days", lang)}</div>
                <div className="flex items-center gap-1 col-span-2"><MapPin className="h-3 w-3" />{b.pickupLocation}</div>
              </div>

              {/* OTP display for UPCOMING bookings */}
              {b.status === "UPCOMING" && booking.pickupOtp && (
                <div className="mt-3 p-2.5 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">{isRtl ? "رمز الاستلام (أعطه للموظف عند الاستلام)" : "Pickup OTP (show to staff at pickup)"}</p>
                    <p className="text-lg font-bold font-mono text-primary tracking-widest">{booking.pickupOtp}</p>
                  </div>
                </div>
              )}

              {/* Late fee display */}
              {booking.lateFee > 0 && (
                <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <p className="text-xs text-red-600 font-semibold">{isRtl ? `غرامة تأخير: ${formatCurrency(booking.lateFee)}` : `Late fee: ${formatCurrency(booking.lateFee)}`}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex flex-col">
                  <span className="font-semibold text-primary">{formatCurrency(b.total + (booking.lateFee || 0))}</span>
                  {b.paymentStatus === "PAID" && <span className="text-[10px] text-emerald-600 font-medium">✓ {isRtl ? "مدفوع" : "Paid"}</span>}
                  {b.paymentStatus === "PENDING" && <span className="text-[10px] text-amber-600 font-medium">⏳ {isRtl ? "بانتظار الدفع" : "Payment pending"}</span>}
                </div>
                <div className="flex gap-2">
                  {b.status === "PENDING_PAYMENT" && onPay && (
                    <Button size="sm" onClick={() => onPay(b)}><CreditCard className="h-3.5 w-3.5 mr-1" />{isRtl ? "ادفع الآن" : "Pay Now"}</Button>
                  )}
                  {onCancel && (b.status === "PENDING_PAYMENT" || b.status === "UPCOMING") && (
                    <Button size="sm" variant="outline" onClick={() => onCancel(b.id)}><XCircle className="h-3.5 w-3.5 mr-1" />{tr("trips_cancel", lang)}</Button>
                  )}
                  {onRebook && b.car && (
                    <Button size="sm" variant="outline" onClick={() => onRebook(b.carId)}><RefreshCw className="h-3.5 w-3.5 mr-1" />{tr("trips_rebook", lang)}</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
        );
      })}
    </div>
  );
}
