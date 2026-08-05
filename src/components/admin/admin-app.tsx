"use client";

import { useAppStore } from "@/lib/store";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { DashboardView } from "./views/dashboard-view";
import { CarsView } from "./views/cars-view";
import { BookingsView } from "./views/bookings-view";
import { CustomersView } from "./views/customers-view";
import { ReviewsView } from "./views/reviews-view";
import { DealsAdminView } from "./views/deals-view";
import { SettingsView } from "./views/settings-view";
import { ContentView } from "./views/content-view";
import { CategoriesView } from "./views/categories-view";
import { AdminLogin } from "./admin-login";

export function AdminApp() {
  const { user, adminView } = useAppStore();
  if (!user || user.role !== "ADMIN") return <AdminLogin />;
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto">
          {adminView === "dashboard" && <DashboardView />}
          {adminView === "cars" && <CarsView />}
          {adminView === "bookings" && <BookingsView />}
          {adminView === "customers" && <CustomersView />}
          {adminView === "reviews" && <ReviewsView />}
          {adminView === "deals" && <DealsAdminView />}
          {adminView === "content" && <ContentView />}
          {adminView === "categories" && <CategoriesView />}
          {adminView === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
