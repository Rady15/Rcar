"use client";

import { useAppStore, AdminView } from "@/lib/store";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Car, CalendarCheck, Users, Star, Tag, Settings, LogOut, ArrowLeft, FileText } from "lucide-react";

const NAV: { view: AdminView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "cars", label: "Cars", icon: Car },
  { view: "bookings", label: "Bookings", icon: CalendarCheck },
  { view: "customers", label: "Customers", icon: Users },
  { view: "reviews", label: "Reviews", icon: Star },
  { view: "deals", label: "Deals", icon: Tag },
  { view: "content", label: "Site Content", icon: FileText },
  { view: "settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const { adminView, setAdminView, logout, setPlatform } = useAppStore();
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Car className="h-5 w-5" /></div>
          <div><p className="font-bold">RentDrive</p><p className="text-xs text-muted-foreground">Admin Panel</p></div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon; const active = adminView === item.view;
          return <button key={item.view} onClick={() => setAdminView(item.view)} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}><Icon className="h-4 w-4" />{item.label}</button>;
        })}
      </nav>
      <div className="p-3 border-t border-border space-y-1">
        <button onClick={() => setPlatform("customer")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" />Back to site</button>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-500/10 transition-colors"><LogOut className="h-4 w-4" />Sign out</button>
      </div>
    </aside>
  );
}
