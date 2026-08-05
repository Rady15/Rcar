"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "CUSTOMER" | "ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  licenseNumber?: string | null;
  loyaltyPoints?: number;
  tier?: string;
}

export type CustomerView =
  | "home" | "browse" | "car-detail" | "booking" | "payment"
  | "confirmation" | "my-trips" | "favorites" | "deals" | "login" | "account";

export type AdminView =
  | "dashboard" | "cars" | "bookings" | "customers" | "reviews"
  | "deals" | "content" | "settings";

interface AppState {
  platform: "customer" | "admin";
  setPlatform: (p: "customer" | "admin") => void;
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
  logout: () => void;
  customerView: CustomerView;
  setCustomerView: (v: CustomerView) => void;
  adminView: AdminView;
  setAdminView: (v: AdminView) => void;
  selectedCarId: string | null;
  setSelectedCarId: (id: string | null) => void;
  lastBookingId: string | null;
  setLastBookingId: (id: string | null) => void;
  favorites: string[];
  toggleFavorite: (carId: string) => void;
  bookingDraft: {
    pickupDate: string; returnDate: string;
    pickupLocation: string; returnLocation: string;
    extras: string[]; insurance: boolean;
  } | null;
  setBookingDraft: (d: AppState["bookingDraft"]) => void;
  browseCategory: string;
  setBrowseCategory: (c: string) => void;
  homeScrollTarget: string | null;
  setHomeScrollTarget: (s: string | null) => void;
  // Language: "ar" (default) | "en"
  lang: "ar" | "en";
  setLang: (l: "ar" | "en") => void;
  // Search draft carried from hero to browse view
  searchDraft: {
    location: string;
    pickupDate: string;
    returnDate: string;
    carType: string;
  } | null;
  setSearchDraft: (d: AppState["searchDraft"]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      platform: "customer",
      setPlatform: (p) => set({ platform: p }),
      user: null,
      setUser: (u) => set({ user: u }),
      logout: () => set({
        user: null, customerView: "home", adminView: "dashboard",
        selectedCarId: null, lastBookingId: null, bookingDraft: null,
      }),
      customerView: "home",
      setCustomerView: (v) => set({ customerView: v }),
      adminView: "dashboard",
      setAdminView: (v) => set({ adminView: v }),
      selectedCarId: null,
      setSelectedCarId: (id) => set({ selectedCarId: id }),
      lastBookingId: null,
      setLastBookingId: (id) => set({ lastBookingId: id }),
      favorites: [],
      toggleFavorite: (carId) => {
        const cur = get().favorites;
        if (cur.includes(carId)) set({ favorites: cur.filter((c) => c !== carId) });
        else set({ favorites: [...cur, carId] });
      },
      bookingDraft: null,
      setBookingDraft: (d) => set({ bookingDraft: d }),
      browseCategory: "all",
      setBrowseCategory: (c) => set({ browseCategory: c }),
      homeScrollTarget: null,
      setHomeScrollTarget: (s) => set({ homeScrollTarget: s }),
      lang: "ar",
      setLang: (l) => set({ lang: l }),
      searchDraft: null,
      setSearchDraft: (d) => set({ searchDraft: d }),
    }),
    {
      name: "rentdrive-store",
      partialize: (s) => ({ platform: s.platform, user: s.user, favorites: s.favorites }),
    }
  )
);
