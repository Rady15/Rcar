"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api, formatCurrency } from "@/lib/helpers";
import { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CreditCard, Apple, Wallet, Lock, CheckCircle2, Loader2 } from "lucide-react";

export function PaymentView() {
  const { lastBookingId, setCustomerView, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });

  useEffect(() => {
    if (!lastBookingId) { setCustomerView("home"); return; }
    api<{ booking: Booking }>(`/api/bookings/${lastBookingId}`).then((res) => setBooking(res.booking)).finally(() => setLoading(false));
  }, [lastBookingId]);

  const handlePay = async () => {
    if (!booking) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    try {
      await api(`/api/bookings/${booking.id}`, { method: "PATCH", body: JSON.stringify({ id: booking.id, paymentMethod: method, paymentStatus: "PAID", status: "UPCOMING" }) });
      toast.success(tr("payment_success", lang), { description: `${tr("payment_confirmed", lang)} ${booking.bookingCode}` });
      setCustomerView("confirmation");
      window.scrollTo(0, 0);
    } catch (e) { toast.error(isRtl ? "فشل الدفع" : "Payment failed", { description: e instanceof Error ? e.message : "" }); }
    finally { setProcessing(false); }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 max-w-3xl"><Skeleton className="h-32 rounded-xl mb-4" /><Skeleton className="h-96 rounded-xl" /></div>;
  if (!booking) return <div className="container mx-auto px-4 py-16 text-center"><h2 className="text-xl font-semibold">{tr("payment_no_booking", lang)}</h2><Button className="mt-4" onClick={() => setCustomerView("home")}>{tr("payment_back_home", lang)}</Button></div>;

  const BackIcon = isRtl ? ArrowLeft : ArrowRight;
  const METHODS = [
    { id: "card", label: tr("payment_card", lang), desc: tr("payment_card_desc", lang), icon: CreditCard },
    { id: "apple", label: tr("payment_apple", lang), desc: tr("payment_apple_desc", lang), icon: Apple },
    { id: "paypal", label: tr("payment_paypal", lang), desc: tr("payment_paypal_desc", lang), icon: Wallet },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl" dir={isRtl ? "rtl" : "ltr"}>
      <Button variant="ghost" size="sm" onClick={() => setCustomerView("booking")} className="mb-4"><BackIcon className="h-4 w-4 mr-1" /> {tr("payment_back", lang)}</Button>
      <h1 className="text-2xl font-bold mb-1">{tr("payment_title", lang)}</h1>
      <p className="text-muted-foreground mb-6">{tr("payment_booking_code", lang)}: <span className="font-mono font-semibold">{booking.bookingCode}</span></p>
      <Card className="p-5 mb-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <p className="text-sm opacity-90">{tr("payment_total_pay", lang)}</p>
        <p className="text-4xl font-bold tracking-tight">{formatCurrency(booking.total)}</p>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary-foreground/20">
          <img src={booking.car?.imageUrl} alt={booking.car?.brand} className="w-12 h-10 rounded object-cover" />
          <div className="text-sm"><p className="font-semibold">{booking.car?.brand} {booking.car?.model}</p><p className="opacity-80">{booking.daysCount} {booking.daysCount === 1 ? tr("booking_day", lang) : tr("booking_days", lang)} • {booking.pickupLocation}</p></div>
        </div>
      </Card>
      <Card className="p-5 space-y-3 mb-6">
        <h2 className="font-semibold">{tr("payment_method", lang)}</h2>
        {METHODS.map((m) => {
          const Icon = m.icon; const selected = method === m.id;
          return (
            <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
              <Icon className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{m.label}</p><p className="text-xs text-muted-foreground">{m.desc}</p></div>
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>{selected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}</div>
            </button>
          );
        })}
      </Card>
      {method === "card" && (
        <Card className="p-5 space-y-4 mb-6">
          <h2 className="font-semibold">{tr("payment_card_details", lang)}</h2>
          <div><Label className="text-xs">{tr("payment_card_number", lang)}</Label><Input placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} maxLength={19} /></div>
          <div><Label className="text-xs">{tr("payment_cardholder", lang)}</Label><Input placeholder={isRtl ? "محمد أحمد" : "John Doe"} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">{tr("payment_expiry", lang)}</Label><Input placeholder="12/27" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} maxLength={5} /></div>
            <div><Label className="text-xs">{tr("payment_cvc", lang)}</Label><Input placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} maxLength={4} type="password" /></div>
          </div>
        </Card>
      )}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6"><Lock className="h-3.5 w-3.5" />{tr("payment_secure", lang)}</div>
      <Button size="lg" className="w-full" onClick={handlePay} disabled={processing}>
        {processing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{tr("payment_processing", lang)}</> : <><CheckCircle2 className="h-4 w-4 mr-2" />{tr("payment_pay", lang)} {formatCurrency(booking.total)}</>}
      </Button>
    </div>
  );
}
