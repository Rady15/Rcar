"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Mail, Phone, Users, Trash2, Ban, CircleCheck } from "lucide-react";

export function CustomersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => { setLoading(true); api<{ users: User[] }>("/api/users?role=CUSTOMER").then((res) => setUsers(res.users)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleSuspend = async (u: User) => {
    const suspending = !u.isSuspended;
    try {
      await api(`/api/users/${u.id}`, { method: "PATCH", body: JSON.stringify({ id: u.id, isSuspended: suspending }) });
      toast.success(suspending ? `${u.name} suspended` : `${u.name} re-activated`);
      load();
    } catch { toast.error("Action failed"); }
  };

  const remove = async (u: User) => {
    if (!confirm(`Delete customer ${u.name}? Their bookings and reviews will be deleted too.`)) return;
    try { await api(`/api/users/${u.id}`, { method: "DELETE" }); toast.success(`${u.name} deleted`); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Customers</h1><p className="text-sm text-muted-foreground">{users.length} registered customers</p></div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-4 space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 rounded-md" />)}</div> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Contact</TableHead><TableHead>Joined</TableHead><TableHead className="text-center">Bookings</TableHead><TableHead className="text-center">Reviews</TableHead><TableHead className="text-right">Total spent</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">{u.name.charAt(0)}</div><div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">ID: {u.id.slice(0, 8)}</p></div></div></TableCell>
                    <TableCell><div className="space-y-0.5"><p className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" />{u.email}</p>{u.phone && <p className="text-xs flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{u.phone}</p>}</div></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                    <TableCell className="text-center"><Badge variant="secondary">{u._count?.bookings || 0}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="outline">{u._count?.reviews || 0}</Badge></TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(u.totalSpent || 0)}</TableCell>
                    <TableCell className="text-center">{u.isSuspended ? <Badge className="bg-red-500/15 text-red-600">Suspended</Badge> : <Badge className="bg-emerald-500/15 text-emerald-600">Active</Badge>}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {u.isSuspended ? (
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => toggleSuspend(u)} title="Re-activate" aria-label="Re-activate"><CircleCheck className="h-4 w-4 text-emerald-600" /></Button>
                        ) : (
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => toggleSuspend(u)} title="Suspend" aria-label="Suspend"><Ban className="h-4 w-4 text-amber-600" /></Button>
                        )}
                        <Button size="icon" variant="outline" className="h-8 w-8 hover:bg-red-50" onClick={() => remove(u)} title="Delete" aria-label="Delete"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8"><Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No customers found</p></TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
