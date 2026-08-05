"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { Booking } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, CalendarCheck } from "lucide-react";

const STATUS_OPTIONS = ["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"];
const STATUS_BADGE: Record<string, string> = { UPCOMING: "bg-primary/15 text-primary", ACTIVE: "bg-emerald-500/15 text-emerald-600", COMPLETED: "bg-muted text-muted-foreground", CANCELLED: "bg-red-500/15 text-red-600" };

export function BookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = () => { setLoading(true); api<{ bookings: Booking[] }>("/api/bookings").then((res) => setBookings(res.bookings)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = bookings.filter((b) => {
    const matchSearch = b.bookingCode.toLowerCase().includes(search.toLowerCase()) || b.user?.name?.toLowerCase().includes(search.toLowerCase()) || b.car?.brand?.toLowerCase().includes(search.toLowerCase()) || b.car?.model?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: string) => {
    try { await api(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ id, status }) }); toast.success(`Booking marked as ${status.toLowerCase()}`); load(); }
    catch { toast.error("Update failed"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Bookings</h1><p className="text-sm text-muted-foreground">{bookings.length} total bookings</p></div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by code, customer, car..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">All statuses</SelectItem>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>)}</SelectContent></Select>
      </div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-4 space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 rounded-md" />)}</div> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Customer</TableHead><TableHead>Car</TableHead><TableHead>Dates</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell><code className="text-xs font-mono">{b.bookingCode}</code></TableCell>
                    <TableCell><p className="text-sm font-medium">{b.user?.name}</p><p className="text-xs text-muted-foreground">{b.user?.email}</p></TableCell>
                    <TableCell><div className="flex items-center gap-2"><img src={b.car?.imageUrl} alt="" className="w-10 h-7 rounded object-cover" /><div className="min-w-0"><p className="text-sm font-medium truncate">{b.car?.brand} {b.car?.model}</p><p className="text-xs text-muted-foreground">{b.daysCount} days</p></div></div></TableCell>
                    <TableCell><p className="text-xs">{formatDate(b.pickupDate)}</p><p className="text-xs text-muted-foreground">→ {formatDate(b.returnDate)}</p></TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(b.total)}</TableCell>
                    <TableCell><Badge className={STATUS_BADGE[b.status]} variant="secondary">{b.status.charAt(0) + b.status.slice(1).toLowerCase()}</Badge></TableCell>
                    <TableCell><Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}><SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>)}</SelectContent></Select></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8"><CalendarCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No bookings found</p></TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
