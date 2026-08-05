"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Car as CarIcon,
  Search,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { CAR_LOCATIONS } from "@/lib/helpers";

interface YeloHeroProps {
  onSearch: () => void;
  onSignIn: () => void;
}

const TABS = [
  { id: "search", label: "ابحث الآن", icon: Search, active: true },
  { id: "consultations", label: "الاستشارات السيارة", icon: MessageCircle, active: false },
  { id: "rental", label: "إيجار الحجز", icon: Calendar, active: false },
  { id: "longterm", label: "تأجير طويل الأجل", icon: Clock, active: false },
  { id: "paycollect", label: "باي واستلم", icon: CarIcon, active: false },
];

export function YeloHero({ onSearch, onSignIn }: YeloHeroProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, reduce ? 1 : 0]);

  const [activeTab, setActiveTab] = useState("search");
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const { setCustomerView, setBrowseCategory } = useAppStore();

  const handleSearch = () => {
    setBrowseCategory("all");
    setCustomerView("browse");
    window.scrollTo(0, 0);
  };

  return (
    <section
      ref={ref}
      dir="rtl"
      className="relative min-h-screen flex flex-col overflow-hidden bg-background"
      style={{ fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', 'Cairo', system-ui, sans-serif" }}
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          alt="Premium car at sunset"
          className="w-full h-[110%] object-cover"
        />
        {/* Top gradient for nav readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        {/* Bottom gradient to ground the search widget */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </motion.div>

      {/* Floating headline (top-right, RTL) */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 flex-1 flex items-start justify-end px-6 md:px-16 pt-28 md:pt-32"
      >
        <div className="max-w-2xl text-right">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
          >
            تجربة قيادة تُؤهِّلك
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-white/90 mt-4 max-w-md mr-auto"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}
          >
            استأجر سيارة فاخرة في دقائق — مع التوصيل لباب منزلك
          </motion.p>
        </div>
      </motion.div>

      {/* Tabbed search widget (centered, bottom) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 px-4 md:px-6 pb-10 md:pb-16"
      >
        <div className="max-w-5xl mx-auto">
          {/* Tab bar (purple, attached to top of white card) */}
          <div className="flex flex-wrap gap-1 bg-primary rounded-t-2xl p-2 shadow-lg">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-white text-primary shadow-sm"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* White search card */}
          <div className="bg-white rounded-b-2xl rounded-tr-none shadow-2xl p-5 md:p-6" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-4 items-end">
              {/* Location field */}
              <div className="text-right">
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                  موقع الاستلام و التسليم
                </Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">حدد المدينة</option>
                    {CAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Pickup date */}
              <div className="text-right">
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                  تاريخ و وقت الاستلام
                </Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="pr-10 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Return date */}
              <div className="text-right">
                <Label className="text-xs font-semibold text-foreground mb-1.5 block">
                  تاريخ و وقت التسليم
                </Label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="pr-10 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* Search button */}
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md"
              >
                <ArrowLeft className="h-4 w-4 ml-1" />
                ابحث
              </Button>
            </div>

            {/* Same location checkbox */}
            <div className="flex items-center gap-2 mt-4 justify-end" dir="rtl">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-muted-foreground">العودة لنفس الموقع</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-muted-foreground/40 accent-accent cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating chat FAB (bottom-left in RTL = visually bottom-right) */}
      <motion.button
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {}}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-primary shadow-xl flex items-center justify-center group"
        aria-label="Chat with us"
      >
        <MessageCircle className="h-6 w-6 text-accent" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-primary" />
      </motion.button>
    </section>
  );
}
