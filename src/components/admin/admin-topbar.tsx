"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, Car, CalendarCheck, Users, Star, Tag, Settings, Menu, LogOut, ArrowLeft, FileText, FolderTree, MapPin } from "lucide-react";

const NAV = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "cars", label: "Cars", icon: Car },
  { view: "categories", label: "Categories", icon: FolderTree },
  { view: "locations", label: "Locations", icon: MapPin },
  { view: "bookings", label: "Bookings", icon: CalendarCheck },
  { view: "customers", label: "Customers", icon: Users },
  { view: "reviews", label: "Reviews", icon: Star },
  { view: "deals", label: "Deals", icon: Tag },
  { view: "content", label: "Site Content", icon: FileText },
  { view: "settings", label: "Settings", icon: Settings },
] as const;

export function AdminTopbar() {
  const { user, setAdminView, logout, setPlatform } = useAppStore();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild><Button variant="outline" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button></SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b border-border"><p className="font-bold">RentDrive Admin</p></div>
            <nav className="p-3 space-y-1">
              {NAV.map((item) => { const Icon = item.icon; return <button key={item.view} onClick={() => setAdminView(item.view as any)} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"><Icon className="h-4 w-4" />{item.label}</button>; })}
              <div className="border-t border-border my-2" />
              <button onClick={() => setPlatform("customer")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to site</button>
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-500/10"><LogOut className="h-4 w-4" />Sign out</button>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold capitalize">{useAppStore.getState().adminView}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setPlatform("customer")} className="hidden md:flex"><ArrowLeft className="h-4 w-4 mr-1" />View site</Button>
        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{user?.name?.charAt(0) || "A"}</AvatarFallback></Avatar>
      </div>
    </header>
  );
}
