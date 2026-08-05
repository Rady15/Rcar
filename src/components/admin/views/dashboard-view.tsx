"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, Car as CarIcon, CalendarCheck, Users, TrendingUp } from "lucide-react";

interface Stats {
  counts: { cars: number; bookings: number; users: number; reviews: number; deals: number };
  revenue: number;
  statusBreakdown: { upcoming: number; completed: number; cancelled: number };
  carsByCategory: { category: string; _count: { _all: number } }[];
  recentBookings: any[];
  topCars: any[];
  revenueByDay: { date: string; revenue: number; bookings: number }[];
}

export function DashboardView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api<Stats>("/api/admin/stats").then(setStats).finally(() => setLoading(false)); }, []);

  if (loading || !stats) {
    return <div className="p-6 space-y-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div><Skeleton className="h-72 rounded-xl" /></div>;
  }

  const revenueData = stats.revenueByDay.map((d) => ({ date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), revenue: d.revenue, bookings: d.bookings }));
  const categoryData = stats.carsByCategory.map((c) => ({ name: c.category, value: c._count._all }));
  const statusData = [
    { name: "Upcoming", value: stats.statusBreakdown.upcoming, fill: "#d97706" },
    { name: "Completed", value: stats.statusBreakdown.completed, fill: "#059669" },
    { name: "Cancelled", value: stats.statusBreakdown.cancelled, fill: "#dc2626" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Dashboard</h1><p className="text-sm text-muted-foreground">Overview of your rental business performance</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <KpiCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.revenue)} color="text-emerald-600" bg="bg-emerald-500/10" />
        <KpiCard icon={CalendarCheck} label="Bookings" value={stats.counts.bookings.toString()} color="text-primary" bg="bg-primary/10" />
        <KpiCard icon={CarIcon} label="Cars" value={stats.counts.cars.toString()} color="text-purple-600" bg="bg-purple-500/10" />
        <KpiCard icon={Users} label="Customers" value={stats.counts.users.toString()} color="text-red-600" bg="bg-red-500/10" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4"><div><h2 className="font-semibold">Revenue (last 7 days)</h2><p className="text-xs text-muted-foreground">Daily booking revenue</p></div><TrendingUp className="h-4 w-4 text-muted-foreground" /></div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d97706" stopOpacity={0.3} /><stop offset="95%" stopColor="#d97706" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4 md:p-5">
          <h2 className="font-semibold mb-1">Booking status</h2><p className="text-xs text-muted-foreground mb-4">Distribution by status</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>{statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}</Pie><Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} /></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-4 md:p-5">
          <h2 className="font-semibold mb-1">Cars by category</h2><p className="text-xs text-muted-foreground mb-4">Inventory distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" /><YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} /><Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} /><Bar dataKey="value" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2 p-4 md:p-5">
          <h2 className="font-semibold mb-1">Top booked cars</h2><p className="text-xs text-muted-foreground mb-4">Most popular vehicles</p>
          <div className="space-y-3">
            {stats.topCars.map((t, i) => (
              <div key={t.carId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/40">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</div>
                {t.car?.imageUrl && <img src={t.car.imageUrl} alt={t.car.brand} className="w-10 h-8 rounded object-cover" />}
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{t.car?.brand} {t.car?.model}</p><p className="text-xs text-muted-foreground">{formatCurrency(t.car?.pricePerDay || 0)}/day</p></div>
                <Badge variant="secondary">{t._count._all} bookings</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-4 md:p-5">
        <h2 className="font-semibold mb-1">Recent bookings</h2><p className="text-xs text-muted-foreground mb-4">Latest 5 bookings</p>
        <div className="space-y-2">
          {stats.recentBookings.map((b) => (
            <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/40">
              <img src={b.car?.imageUrl} alt="" className="w-10 h-8 rounded object-cover" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{b.car?.brand} {b.car?.model}</p><p className="text-xs text-muted-foreground">{b.user?.name} • {formatDate(b.createdAt)}</p></div>
              <div className="text-right"><p className="text-sm font-semibold text-primary">{formatCurrency(b.total)}</p><Badge variant="outline" className="text-[10px]">{b.status}</Badge></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, bg }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string; bg: string; }) {
  return <Card className="p-4"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}><Icon className={`h-5 w-5 ${color}`} /></div><p className="text-2xl font-bold mt-3">{value}</p><p className="text-xs text-muted-foreground">{label}</p></Card>;
}
