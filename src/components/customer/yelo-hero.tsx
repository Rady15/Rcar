"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YeloNavbar } from "@/components/customer/yelo-navbar";
import {
  Car as CarIcon, Search, MapPin, Calendar, Clock, ArrowLeft, ArrowRight,
  MessageCircle, ChevronDown, Phone, Headphones, Wallet, Truck,
} from "lucide-react";
import { CAR_LOCATIONS } from "@/lib/helpers";

interface YeloHeroProps {
  onSearch: () => void;
  onSignIn: () => void;
}

type TabId = "search" | "consultations" | "rental" | "longterm" | "paycollect";

export function YeloHero({ onSearch, onSignIn }: YeloHeroProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, reduce ? 1 : 0]);

  const {
    lang, setCustomerView, setBrowseCategory, setSearchDraft,
  } = useAppStore();
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<TabId>("search");
  const [location, setLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carType, setCarType] = useState("");
  const [rentalMonths, setRentalMonths] = useState("1");
  const [phone, setPhone] = useState("");
  const [bookingCode, setBookingCode] = useState("");

  const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "search", label: tr("tab_search", lang), icon: Search },
    { id: "consultations", label: tr("tab_consultations", lang), icon: Headphones },
    { id: "rental", label: tr("tab_rental", lang), icon: Calendar },
    { id: "longterm", label: tr("tab_longterm", lang), icon: Clock },
    { id: "paycollect", label: tr("tab_paycollect", lang), icon: Wallet },
  ];

  // Wire the search form to the Browse view by storing the search draft
  const goToBrowse = (draft: { location: string; pickupDate: string; returnDate: string; carType: string }) => {
    setSearchDraft(draft);
    setBrowseCategory("all");
    setCustomerView("browse");
    window.scrollTo(0, 0);
  };

  const handleSearch = () => goToBrowse({ location, pickupDate, returnDate, carType: "" });
  const handleConsultation = () => { setBrowseCategory("all"); setCustomerView("browse"); window.scrollTo(0, 0); };
  const handleRental = () => goToBrowse({ location, pickupDate, returnDate, carType: "" });
  const handleLongTerm = () => goToBrowse({ location, pickupDate: rentalMonths, returnDate: "", carType });
  const handlePayCollect = () => { setCustomerView("my-trips"); window.scrollTo(0, 0); };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={ref}
      dir={isRtl ? "rtl" : "ltr"}
      className="relative min-h-screen flex flex-col overflow-hidden bg-background"
      style={{ fontFamily: "var(--font-arabic), 'Tajawal', 'Cairo', system-ui, sans-serif" }}
    >
      {/* Background image */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imageY }}>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
          alt="Premium car at sunset"
          className="w-full h-[110%] object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </motion.div>

      <YeloNavbar />

      {/* Headline */}
      <motion.div
        style={{ opacity: textOpacity }}
        className={isRtl
          ? "relative z-10 flex-1 flex items-start justify-end px-6 md:px-16 pt-28 md:pt-36"
          : "relative z-10 flex-1 flex items-start justify-start px-6 md:px-16 pt-28 md:pt-36"}
      >
        <div className={isRtl ? "max-w-2xl text-right" : "max-w-2xl text-left"}>
          <motion.img
            src="/logo.png"
            alt="RentDrive"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-14 w-14 md:h-16 md:w-16 rounded-2xl object-cover shadow-2xl mb-5"
          />
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
          >
            {tr("hero_title", lang)}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={isRtl
              ? "text-base md:text-lg text-white/90 mt-4 max-w-md mr-auto"
              : "text-base md:text-lg text-white/90 mt-4 max-w-md ml-auto"}
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}
          >
            {tr("hero_subtitle", lang)}
          </motion.p>
        </div>
      </motion.div>

      {/* Tabbed search widget */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 px-4 md:px-6 pb-10 md:pb-16"
      >
        <div className="max-w-5xl mx-auto">
          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 bg-primary rounded-t-2xl p-2 shadow-lg overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive ? "bg-white text-primary shadow-sm" : "text-white/90 hover:bg-white/10"
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
            {/* SEARCH NOW */}
            {activeTab === "search" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-4 items-end">
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_location", lang)}</Label>
                    <div className="relative">
                      <MapPin className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={isRtl ? "w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" : "w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"}
                      >
                        <option value="">{tr("field_location_placeholder", lang)}</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <ChevronDown className={isRtl ? "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" : "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"} />
                    </div>
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_pickup_date", lang)}</Label>
                    <div className="relative">
                      <Calendar className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <Input type="datetime-local" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={isRtl ? "pr-10 py-2.5 text-sm" : "pl-10 py-2.5 text-sm"} />
                    </div>
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_return_date", lang)}</Label>
                    <div className="relative">
                      <Calendar className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <Input type="datetime-local" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={isRtl ? "pr-10 py-2.5 text-sm" : "pl-10 py-2.5 text-sm"} />
                    </div>
                  </div>
                  <Button onClick={handleSearch} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <ArrowIcon className="h-4 w-4 mr-1" /> {tr("btn_search", lang)}
                  </Button>
                </div>
                <div className={isRtl ? "flex items-center gap-2 mt-4 justify-end" : "flex items-center gap-2 mt-4 justify-start"}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-muted-foreground">{tr("cb_same_location", lang)}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-muted-foreground/40 accent-accent cursor-pointer" />
                  </label>
                </div>
              </>
            )}

            {/* CONSULTATIONS */}
            {activeTab === "consultations" && (
              <>
                <div className={isRtl ? "mb-4 text-right" : "mb-4 text-left"}>
                  <h3 className="text-lg font-bold text-foreground">{tr("cons_title", lang)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tr("cons_desc", lang)}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_name", lang)}</Label>
                    <Input placeholder={tr("field_name_placeholder", lang)} className="py-2.5 text-sm" />
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_phone", lang)}</Label>
                    <div className="relative">
                      <Phone className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <Input type="tel" placeholder={tr("field_phone_placeholder", lang)} value={phone} onChange={(e) => setPhone(e.target.value)} className={isRtl ? "pr-10 py-2.5 text-sm" : "pl-10 py-2.5 text-sm"} />
                    </div>
                  </div>
                  <Button onClick={handleConsultation} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <Headphones className="h-4 w-4 mr-1" /> {tr("btn_request_consultation", lang)}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { icon: Headphones, label: tr("cons_phone", lang), desc: tr("cons_phone_desc", lang) },
                    { icon: CarIcon, label: tr("cons_inspect", lang), desc: tr("cons_inspect_desc", lang) },
                    { icon: Search, label: tr("cons_report", lang), desc: tr("cons_report_desc", lang) },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="text-center p-3 rounded-lg border border-border">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-2">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* RENTAL BOOKING */}
            {activeTab === "rental" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-end">
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_pickup_location", lang)}</Label>
                    <div className="relative">
                      <MapPin className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <select value={location} onChange={(e) => setLocation(e.target.value)} className={isRtl ? "w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer" : "w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"}>
                        <option value="">{tr("field_location_placeholder", lang)}</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_dropoff_location", lang)}</Label>
                    <div className="relative">
                      <MapPin className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <select value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} className={isRtl ? "w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer" : "w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"}>
                        <option value="">{tr("field_location_placeholder", lang)}</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_pickup_date_short", lang)}</Label>
                    <div className="relative">
                      <Calendar className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={isRtl ? "pr-10 py-2.5 text-sm" : "pl-10 py-2.5 text-sm"} />
                    </div>
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_dropoff_date_short", lang)}</Label>
                    <div className="relative">
                      <Calendar className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={isRtl ? "pr-10 py-2.5 text-sm" : "pl-10 py-2.5 text-sm"} />
                    </div>
                  </div>
                  <Button onClick={handleRental} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <ArrowIcon className="h-4 w-4 mr-1" /> {tr("btn_book", lang)}
                  </Button>
                </div>
                <div className={isRtl ? "flex items-center gap-2 mt-4 justify-end" : "flex items-center gap-2 mt-4 justify-start"}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-muted-foreground">{tr("cb_same_pickup", lang)}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-muted-foreground/40 accent-accent cursor-pointer" />
                  </label>
                </div>
              </>
            )}

            {/* LONG-TERM */}
            {activeTab === "longterm" && (
              <>
                <div className={isRtl ? "mb-4 text-right" : "mb-4 text-left"}>
                  <h3 className="text-lg font-bold text-foreground">{tr("lt_title", lang)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tr("lt_desc", lang)}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_car_type", lang)}</Label>
                    <div className="relative">
                      <CarIcon className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <select value={carType} onChange={(e) => setCarType(e.target.value)} className={isRtl ? "w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer" : "w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"}>
                        <option value="">{tr("field_location_placeholder", lang)}</option>
                        <option value="sedan">{tr("lt_type_sedan", lang)}</option>
                        <option value="suv">{tr("lt_type_suv", lang)}</option>
                        <option value="luxury">{tr("lt_type_luxury", lang)}</option>
                        <option value="electric">{tr("lt_type_electric", lang)}</option>
                      </select>
                    </div>
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_duration", lang)}</Label>
                    <div className="relative">
                      <Clock className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <select value={rentalMonths} onChange={(e) => setRentalMonths(e.target.value)} className={isRtl ? "w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer" : "w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"}>
                        <option value="1">{tr("lt_month_1", lang)}</option>
                        <option value="3">{tr("lt_month_3", lang)}</option>
                        <option value="6">{tr("lt_month_6", lang)}</option>
                        <option value="12">{tr("lt_month_12", lang)}</option>
                      </select>
                    </div>
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_city", lang)}</Label>
                    <div className="relative">
                      <MapPin className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <select value={location} onChange={(e) => setLocation(e.target.value)} className={isRtl ? "w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer" : "w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"}>
                        <option value="">{tr("field_location_placeholder", lang)}</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleLongTerm} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <ArrowIcon className="h-4 w-4 mr-1" /> {tr("btn_subscribe", lang)}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: tr("lt_maintenance", lang), desc: tr("lt_maintenance_desc", lang) },
                    { label: tr("lt_insurance", lang), desc: tr("lt_insurance_desc", lang) },
                    { label: tr("lt_replace", lang), desc: tr("lt_replace_desc", lang) },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 rounded-lg border border-border bg-accent/10">
                      <p className="text-xs font-bold text-primary">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* PAY & COLLECT */}
            {activeTab === "paycollect" && (
              <>
                <div className={isRtl ? "mb-4 text-right" : "mb-4 text-left"}>
                  <h3 className="text-lg font-bold text-foreground">{tr("pc_title", lang)}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tr("pc_desc", lang)}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_booking_code", lang)}</Label>
                    <Input placeholder="RD123456" value={bookingCode} onChange={(e) => setBookingCode(e.target.value)} className="py-2.5 text-sm font-mono" />
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">{tr("field_showroom", lang)}</Label>
                    <div className="relative">
                      <Truck className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} />
                      <select className={isRtl ? "w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer" : "w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"}>
                        <option value="">{tr("field_location_placeholder", lang)}</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <Button onClick={handlePayCollect} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <Wallet className="h-4 w-4 mr-1" /> {tr("btn_pay_collect", lang)}
                  </Button>
                </div>
                <div className={isRtl ? "flex items-center gap-2 mt-4 justify-end" : "flex items-center gap-2 mt-4 justify-start"}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-muted-foreground">{tr("cb_same_dropoff", lang)}</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-muted-foreground/40 accent-accent cursor-pointer" />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Floating chat FAB */}
      <motion.button
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {}}
        className={isRtl ? "fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-primary shadow-xl flex items-center justify-center group" : "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-xl flex items-center justify-center group"}
        aria-label="Chat with us"
      >
        <MessageCircle className="h-6 w-6 text-accent" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-primary" />
      </motion.button>
    </section>
  );
}
