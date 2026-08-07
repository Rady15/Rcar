"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { Booking } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, CalendarCheck, KeyRound, CreditCard, Trash2 } from "lucide-react";

const STATUS_OPTIONS = ["PENDING_PAYMENT", "UPCOMING", "ACTIVE", "PICKED_UP", "RETURNED", "INSPECTED", "COMPLETED", "CANCELLED"];

const STATUS_BADGE: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-500/15 text-amber-600",
  UPCOMING: "bg-primary/15 text-primary",
  ACTIVE: "bg-emerald-500/15 text-emerald-600",
  PICKED_UP: "bg-blue-500/15 text-blue-600",
  RETURNED: "bg-cyan-500/15 text-cyan-600",
  INSPECTED: "bg-purple-500/15 text-purple-600",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-500/15 text-red-600",
};

const PAYMENT_BADGE: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-600",
  PENDING: "bg-amber-500/10 text-amber-600",
  FAILED: "bg-red-500/10 text-red-600",
  REFUNDED: "bg-blue-500/10 text-blue-600",
};

export function BookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = () => { setLoading(true); api<{ bookings: Booking[] }>("/api/bookings").then((res) => setBookings(res.bookings)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = bookings.filter((b) => {
    const bAny = b as any;
    const matchSearch = b.bookingCode.toLowerCase().includes(search.toLowerCase()) || b.user?.name?.toLowerCase().includes(search.toLowerCase()) || b.car?.brand?.toLowerCase().includes(search.toLowerCase()) || b.car?.model?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: string) => {
    try { await api(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ id, status }) }); toast.success(`Status updated to ${status}`); load(); }
    catch { toast.error("Update failed"); }
  };

  const remove = async (b: Booking) => {
    if (!confirm(`Delete booking ${b.bookingCode}? This cannot be undone.`)) return;
    try { await api(`/api/bookings/${b.id}`, { method: "DELETE" }); toast.success(`Booking ${b.bookingCode} deleted`); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Bookings</h1><p className="text-sm text-muted-foreground">{bookings.length} total bookings</p></div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by code, customer, car..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All statuses</SelectItem>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select>
      </div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-4 space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 rounded-md" />)}</div> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Code</TableHead><TableHead>Customer</TableHead><TableHead>Car</TableHead>
                <TableHead>Dates</TableHead><TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead>OTP</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((b) => {
                  const bAny = b as any;
                  return (
                    <TableRow key={b.id}>
                      <TableCell><code className="text-xs font-mono">{b.bookingCode}</code></TableCell>
                      <TableCell><p className="text-sm font-medium">{b.user?.name}</p><p className="text-xs text-muted-foreground">{b.user?.email}</p></TableCell>
                      <TableCell><div className="flex items-center gap-2"><img src={b.car?.imageUrl} alt="" className="w-10 h-7 rounded object-cover" /><div className="min-w-0"><p className="text-sm font-medium truncate">{b.car?.brand} {b.car?.model}</p><p className="text-xs text-muted-foreground">{b.daysCount} days</p></div></div></TableCell>
                      <TableCell><p className="text-xs">{formatDate(b.pickupDate)}</p><p className="text-xs text-muted-foreground">→ {formatDate(b.returnDate)}</p></TableCell>
                      <TableCell className="text-right"><span className="font-semibold text-primary">{formatCurrency(b.total)}</span>{bAny.lateFee > 0 && <p className="text-[10px] text-red-600">+{formatCurrency(bAny.lateFee)} late</p>}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${PAYMENT_BADGE[b.paymentStatus] || ""}`}>
                          {b.paymentStatus}{b.paymentMethod && ` • ${b.paymentMethod}`}
                        </Badge>
                      </TableCell>
                      <TableCell><Badge className={STATUS_BADGE[b.status]} variant="secondary">{b.status.replace(/_/g, " ")}</Badge></TableCell>
                      <TableCell>{bAny.pickupOtp ? <span className="flex items-center gap-1 text-xs font-mono font-bold text-primary"><KeyRound className="h-3 w-3" />{bAny.pickupOtp}</span> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                            <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50" onClick={() => remove(b)} title="Delete booking" aria-label="Delete booking"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && <TableRow><TableCell colSpan={9} className="text-center py-8"><CalendarCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No bookings found</p></TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
