"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Phone, Users } from "lucide-react";

export function CustomersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { api<{ users: User[] }>("/api/users?role=CUSTOMER").then((res) => setUsers(res.users)).finally(() => setLoading(false)); }, []);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Customers</h1><p className="text-sm text-muted-foreground">{users.length} registered customers</p></div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-4 space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 rounded-md" />)}</div> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Contact</TableHead><TableHead>Joined</TableHead><TableHead className="text-center">Bookings</TableHead><TableHead className="text-center">Reviews</TableHead><TableHead className="text-right">Total spent</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">{u.name.charAt(0)}</div><div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">ID: {u.id.slice(0, 8)}</p></div></div></TableCell>
                    <TableCell><div className="space-y-0.5"><p className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" />{u.email}</p>{u.phone && <p className="text-xs flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{u.phone}</p>}</div></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                    <TableCell className="text-center"><Badge variant="secondary">{u._count?.bookings || 0}</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="outline">{u._count?.reviews || 0}</Badge></TableCell>
                    <TableCell className="text-right font-semibold text-primary">{formatCurrency(u.totalSpent || 0)}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8"><Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">No customers found</p></TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
