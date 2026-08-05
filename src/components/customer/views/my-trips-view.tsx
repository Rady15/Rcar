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
import { Calendar, MapPin, Clock, Car as CarIcon, RefreshCw, XCircle } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  UPCOMING: "bg-primary/15 text-primary", ACTIVE: "bg-emerald-500/15 text-emerald-600",
  COMPLETED: "bg-muted text-muted-foreground", CANCELLED: "bg-red-500/15 text-red-600",
};

export function MyTripsView() {
  const { user, setCustomerView, setSelectedCarId, lang } = useAppStore();
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
      await api(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ id, status: "CANCELLED" }) });
      toast.success(tr("trips_cancelled_toast", lang)); load();
    } catch (e) { toast.error(isRtl ? "فشل الإلغاء" : "Failed to cancel"); }
  };

  const rebook = (carId: string) => { setSelectedCarId(carId); setCustomerView("car-detail"); window.scrollTo(0, 0); };
  const filtered = (status: string) => bookings.filter((b) => b.status === status);

  if (loading) return <div className="container mx-auto px-4 py-8" dir={isRtl ? "rtl" : "ltr"}><Skeleton className="h-10 rounded-lg mb-4" />{[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl mb-3" />)}</div>;

  const statusLabel = (s: string) => {
    if (s === "UPCOMING") return tr("trips_upcoming", lang);
    if (s === "COMPLETED") return tr("trips_completed", lang);
    if (s === "CANCELLED") return tr("trips_cancelled", lang);
    return s;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir={isRtl ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold tracking-tight mb-1">{tr("trips_title", lang)}</h1>
      <p className="text-muted-foreground mb-6">{tr("trips_subtitle", lang)}</p>
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">{tr("trips_upcoming", lang)} ({filtered("UPCOMING").length})</TabsTrigger>
          <TabsTrigger value="completed">{tr("trips_completed", lang)} ({filtered("COMPLETED").length})</TabsTrigger>
          <TabsTrigger value="cancelled">{tr("trips_cancelled", lang)} ({filtered("CANCELLED").length})</TabsTrigger>
        </TabsList>
        {(["UPCOMING", "COMPLETED", "CANCELLED"] as const).map((status) => (
          <TabsContent key={status} value={status.toLowerCase()}>
            <BookingList bookings={filtered(status)} onCancel={status === "UPCOMING" ? cancel : undefined} onRebook={status !== "UPCOMING" ? rebook : undefined} statusLabel={statusLabel} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function BookingList({ bookings, onCancel, onRebook, statusLabel }: { bookings: Booking[]; onCancel?: (id: string) => void; onRebook?: (carId: string) => void; statusLabel: (s: string) => string; }) {
  const { lang } = useAppStore();
  if (bookings.length === 0) return <Card className="p-12 text-center"><CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold mb-1">{tr("trips_empty", lang)}</h3><p className="text-sm text-muted-foreground">{tr("trips_empty_desc", lang)}</p></Card>;
  return (
    <div className="space-y-3">
      {bookings.map((b) => (
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
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="font-semibold text-primary">{formatCurrency(b.total)}</span>
                <div className="flex gap-2">
                  {onCancel && <Button size="sm" variant="outline" onClick={() => onCancel(b.id)}><XCircle className="h-3.5 w-3.5 mr-1" />{tr("trips_cancel", lang)}</Button>}
                  {onRebook && b.car && <Button size="sm" variant="outline" onClick={() => onRebook(b.carId)}><RefreshCw className="h-3.5 w-3.5 mr-1" />{tr("trips_rebook", lang)}</Button>}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
