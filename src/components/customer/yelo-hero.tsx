"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YeloNavbar } from "@/components/customer/yelo-navbar";
import {
  Car as CarIcon,
  Search,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  MessageCircle,
  ChevronDown,
  Phone,
  Headphones,
  Wallet,
  Truck,
} from "lucide-react";
import { CAR_LOCATIONS } from "@/lib/helpers";

interface YeloHeroProps {
  onSearch: () => void;
  onSignIn: () => void;
}

type TabId = "search" | "consultations" | "rental" | "longterm" | "paycollect";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "search", label: "ابحث الآن", icon: Search },
  { id: "consultations", label: "الاستشارات السيارة", icon: Headphones },
  { id: "rental", label: "إيجار الحجز", icon: Calendar },
  { id: "longterm", label: "تأجير طويل الأجل", icon: Clock },
  { id: "paycollect", label: "باي واستلم", icon: Wallet },
];

export function YeloHero({ onSearch, onSignIn }: YeloHeroProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, reduce ? 1 : 0]);

  const [activeTab, setActiveTab] = useState<TabId>("search");
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carModel, setCarModel] = useState("");
  const [rentalMonths, setRentalMonths] = useState("1");
  const [phone, setPhone] = useState("");
  const { setCustomerView, setBrowseCategory } = useAppStore();

  const handleSearch = () => {
    setBrowseCategory("all");
    setCustomerView("browse");
    window.scrollTo(0, 0);
  };

  const handleConsultation = () => {
    setCustomerView("browse");
    window.scrollTo(0, 0);
  };

  const handleRental = () => {
    setBrowseCategory("all");
    setCustomerView("browse");
    window.scrollTo(0, 0);
  };

  const handleLongTerm = () => {
    setBrowseCategory("all");
    setCustomerView("browse");
    window.scrollTo(0, 0);
  };

  const handlePayCollect = () => {
    setCustomerView("browse");
    window.scrollTo(0, 0);
  };

  return (
    <section
      ref={ref}
      dir="rtl"
      className="relative min-h-screen flex flex-col overflow-hidden bg-background"
      style={{ fontFamily: "var(--font-arabic), 'Tajawal', 'Cairo', system-ui, sans-serif" }}
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

      {/* Yelo Navbar (transparent over hero) */}
      <YeloNavbar />

      {/* Floating headline (top-right, RTL) */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 flex-1 flex items-start justify-end px-6 md:px-16 pt-28 md:pt-36"
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
          <div className="flex flex-wrap gap-1 bg-primary rounded-t-2xl p-2 shadow-lg overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
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

          {/* White search card — content changes per tab */}
          <div className="bg-white rounded-b-2xl rounded-tr-none shadow-2xl p-5 md:p-6" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            {/* SEARCH NOW TAB */}
            {activeTab === "search" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-4 items-end">
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">موقع الاستلام و التسليم</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">حدد المدينة</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">تاريخ و وقت الاستلام</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="datetime-local" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="pr-10 py-2.5 text-sm" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">تاريخ و وقت التسليم</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="datetime-local" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="pr-10 py-2.5 text-sm" />
                    </div>
                  </div>
                  <Button onClick={handleSearch} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <ArrowLeft className="h-4 w-4 ml-1" /> ابحث
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-muted-foreground">العودة لنفس الموقع</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-muted-foreground/40 accent-accent cursor-pointer" />
                  </label>
                </div>
              </>
            )}

            {/* CAR CONSULTATIONS TAB */}
            {activeTab === "consultations" && (
              <>
                <div className="mb-4 text-right">
                  <h3 className="text-lg font-bold text-foreground">استشارات سيارات مجانية</h3>
                  <p className="text-sm text-muted-foreground mt-1">فريقنا جاهز لمساعدتك في اختيار السيارة المناسبة لاحتياجاتك</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">الاسم الكامل</Label>
                    <Input placeholder="اكتب اسمك" className="py-2.5 text-sm" />
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">رقم الجوال</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="tel" placeholder="05xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} className="pr-10 py-2.5 text-sm" />
                    </div>
                  </div>
                  <Button onClick={handleConsultation} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <Headphones className="h-4 w-4 ml-1" /> اطلب استشارة
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { icon: Headphones, label: "استشارة هاتفية", desc: "خلال 30 دقيقة" },
                    { icon: CarIcon, label: "معاينة السيارة", desc: "في معرضنا" },
                    { icon: Search, label: "تقرير مفصّل", desc: "مقارنة شاملة" },
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

            {/* RENTAL BOOKING TAB */}
            {activeTab === "rental" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 items-end">
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">موقع الاستلام</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer">
                        <option value="">حدد المدينة</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">موقع التسليم</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer">
                        <option value="">حدد المدينة</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">تاريخ الاستلام</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="date" className="pr-10 py-2.5 text-sm" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">تاريخ التسليم</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="date" className="pr-10 py-2.5 text-sm" />
                    </div>
                  </div>
                  <Button onClick={handleRental} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <ArrowLeft className="h-4 w-4 ml-1" /> احجز
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-muted-foreground">استلام من نفس الموقع</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-muted-foreground/40 accent-accent cursor-pointer" />
                  </label>
                </div>
              </>
            )}

            {/* LONG-TERM RENTAL TAB */}
            {activeTab === "longterm" && (
              <>
                <div className="mb-4 text-right">
                  <h3 className="text-lg font-bold text-foreground">تأجير طويل الأجل</h3>
                  <p className="text-sm text-muted-foreground mt-1">وفّر أكثر مع اشتراك شهري — يشمل الصيانة والتأمين</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">نوع السيارة</Label>
                    <div className="relative">
                      <CarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"
                      >
                        <option value="">اختر الفئة</option>
                        <option value="sedan">سيدان</option>
                        <option value="suv">دفع رباعي</option>
                        <option value="luxury">فاخرة</option>
                        <option value="electric">كهربائية</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">مدة الاشتراك</Label>
                    <div className="relative">
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        value={rentalMonths}
                        onChange={(e) => setRentalMonths(e.target.value)}
                        className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer"
                      >
                        <option value="1">شهر واحد</option>
                        <option value="3">3 أشهر (وفّر 10%)</option>
                        <option value="6">6 أشهر (وفّر 20%)</option>
                        <option value="12">سنة كاملة (وفّر 30%)</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">المدينة</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer">
                        <option value="">حدد المدينة</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleLongTerm} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <ArrowLeft className="h-4 w-4 ml-1" /> اشترك
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: "صيانة دورية", desc: "مجانية" },
                    { label: "تأمين شامل", desc: "مشمول" },
                    { label: "استبدال", desc: "كل 6 أشهر" },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 rounded-lg border border-border bg-accent/10">
                      <p className="text-xs font-bold text-primary">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* PAY & COLLECT TAB */}
            {activeTab === "paycollect" && (
              <>
                <div className="mb-4 text-right">
                  <h3 className="text-lg font-bold text-foreground">باي واستلم</h3>
                  <p className="text-sm text-muted-foreground mt-1">ادفع أونلاين واستلم سيارتك من أقرب معرض — بدون انتظار</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">رقم الحجز</Label>
                    <Input placeholder="RD123456" className="py-2.5 text-sm font-mono" />
                  </div>
                  <div className="text-right">
                    <Label className="text-xs font-semibold text-foreground mb-1.5 block">معرض الاستلام</Label>
                    <div className="relative">
                      <Truck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select className="w-full pr-10 pl-3 py-2.5 rounded-lg border border-input bg-background text-sm appearance-none cursor-pointer">
                        <option value="">اختر المعرض</option>
                        {CAR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>
                  </div>
                  <Button onClick={handlePayCollect} size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-[42px] rounded-lg shadow-md">
                    <Wallet className="h-4 w-4 ml-1" /> ادفع واستلم
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-muted-foreground">استلام من نفس موقع التسليم</span>
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
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-primary shadow-xl flex items-center justify-center group"
        aria-label="Chat with us"
      >
        <MessageCircle className="h-6 w-6 text-accent" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-primary" />
      </motion.button>
    </section>
  );
}
