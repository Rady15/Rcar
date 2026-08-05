"use client";

import { useAppStore } from "@/lib/store";
import { CustomerHeader } from "./customer-header";
import { CustomerFooter } from "./customer-footer";
import { HomeView } from "./views/home-view";
import { BrowseView } from "./views/browse-view";
import { CarDetailView } from "./views/car-detail-view";
import { BookingView } from "./views/booking-view";
import { PaymentView } from "./views/payment-view";
import { ConfirmationView } from "./views/confirmation-view";
import { MyTripsView } from "./views/my-trips-view";
import { FavoritesView } from "./views/favorites-view";
import { DealsView } from "./views/deals-view";
import { LoginView } from "./views/login-view";
import { AccountView } from "./views/account-view";

export function CustomerApp() {
  const view = useAppStore((s) => s.customerView);
  // Home view renders its own transparent navbar (YeloNavbar) inside the hero.
  // All other views use the standard CustomerHeader.
  const showStandardHeader = view !== "home";
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showStandardHeader && <CustomerHeader />}
      <main className="flex-1">
        {view === "home" && <HomeView />}
        {view === "browse" && <BrowseView />}
        {view === "car-detail" && <CarDetailView />}
        {view === "booking" && <BookingView />}
        {view === "payment" && <PaymentView />}
        {view === "confirmation" && <ConfirmationView />}
        {view === "my-trips" && <MyTripsView />}
        {view === "favorites" && <FavoritesView />}
        {view === "deals" && <DealsView />}
        {view === "login" && <LoginView />}
        {view === "account" && <AccountView />}
      </main>
      <CustomerFooter />
    </div>
  );
}
