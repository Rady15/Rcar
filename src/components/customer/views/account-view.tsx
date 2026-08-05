"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api, formatCurrency, formatDate } from "@/lib/helpers";
import { Booking, Review, Car } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CarCard } from "@/components/shared/car-card";
import { toast } from "sonner";
import {
  User, Phone, Award, CalendarCheck, Heart, Star, Settings, LogOut, Save,
  Shield, CreditCard, Sparkles, TrendingUp, Clock, Car as CarIcon,
} from "lucide-react";

export function AccountView() {
  const { user, setUser, setCustomerView, setSelectedCarId, favorites, logout, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [licenseNumber, setLicenseNumber] = useState(user?.licenseNumber || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) { setCustomerView("login"); return; }
    Promise.all([
      api<{ bookings: Booking[] }>(`/api/bookings?userId=${user.id}`),
      api<{ reviews: Review[] }>("/api/reviews"),
      api<{ cars: Car[] }>("/api/cars"),
    ]).then(([b, r, cars]) => {
      setBookings(b.bookings);
      setReviews(r.reviews.filter((rev) => rev.userId === user.id));
      setFavoriteCars(cars.cars.filter((c) => favorites.includes(c.id)));
    }).finally(() => setLoading(false));
  }, [user, favorites]);

  if (!user) {
    return <div className="container mx-auto px-4 py-16 text-center" dir={isRtl ? "rtl" : "ltr"}><h2 className="text-xl font-semibold mb-2">{tr("account_signin_required", lang)}</h2><p className="text-muted-foreground mb-4">{tr("account_signin_to_view", lang)}</p><Button onClick={() => setCustomerView("login")}>{tr("trips_signin", lang)}</Button></div>;
  }

  const upcoming = bookings.filter((b) => b.status === "UPCOMING");
  const totalSpent = bookings.filter((b) => b.paymentStatus === "PAID").reduce((s, b) => s + b.total, 0);
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await api<{ user: any }>(`/api/users/${user.id}`, { method: "PATCH", body: JSON.stringify({ id: user.id, name, phone, licenseNumber }) });
      setUser({ ...user, ...res.user });
      toast.success(tr("account_profile_updated", lang));
    } catch (e) { toast.error(tr("account_update_failed", lang), { description: e instanceof Error ? e.message : "" }); }
    finally { setSavingProfile(false); }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast.error(tr("account_password_short", lang), { description: tr("account_use_6", lang) }); return; }
    setSavingPassword(true);
    try { await api(`/api/users/${user.id}`, { method: "PATCH", body: JSON.stringify({ id: user.id, newPassword }) }); setNewPassword(""); toast.success(tr("account_password_changed", lang)); }
    catch { toast.error(tr("account_password_failed", lang)); }
    finally { setSavingPassword(false); }
  };

  const handleLogout = () => { logout(); setCustomerView("home"); window.scrollTo(0, 0); };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir={isRtl ? "rtl" : "ltr"}>
      <Card className="p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-background shadow-lg"><AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{initials}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
              {user.tier && <Badge className="bg-accent text-accent-foreground"><Award className="h-3 w-3 mr-1" />{user.tier} {tr("account_member", lang)}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            {user.phone && <p className="text-xs text-muted-foreground mt-1"><Phone className="h-3 w-3 inline mr-1" />{user.phone}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4 text-accent" /><span className="font-bold text-lg">{user.loyaltyPoints || 0}</span><span className="text-muted-foreground">{tr("account_points", lang)}</span></div>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="h-3.5 w-3.5 mr-1" />{tr("account_signout", lang)}</Button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard icon={CalendarCheck} label={tr("account_upcoming", lang)} value={upcoming.length.toString()} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={CarIcon} label={tr("account_total_trips", lang)} value={bookings.length.toString()} color="text-emerald-600" bg="bg-emerald-500/10" />
        <StatCard icon={Heart} label={tr("nav_favorites", lang)} value={favorites.length.toString()} color="text-red-600" bg="bg-red-500/10" />
        <StatCard icon={TrendingUp} label={tr("account_total_spent", lang)} value={formatCurrency(totalSpent)} color="text-amber-600" bg="bg-amber-500/10" />
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="gap-1.5"><User className="h-3.5 w-3.5" />{tr("account_overview", lang)}</TabsTrigger>
          <TabsTrigger value="trips" className="gap-1.5"><CalendarCheck className="h-3.5 w-3.5" />{tr("account_my_trips", lang)}</TabsTrigger>
          <TabsTrigger value="favorites" className="gap-1.5"><Heart className="h-3.5 w-3.5" />{tr("nav_favorites", lang)}</TabsTrigger>
          <TabsTrigger value="reviews" className="gap-1.5"><Star className="h-3.5 w-3.5" />{tr("account_reviews", lang)}</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5"><Settings className="h-3.5 w-3.5" />{tr("account_settings", lang)}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {loading ? <Skeleton className="h-64 rounded-xl" /> : (
            <>
              {upcoming.length > 0 && (
                <Card className="p-5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
                  <div className="flex items-center gap-2 mb-2"><Clock className="h-4 w-4" /><span className="text-sm font-medium opacity-90">{tr("account_next_trip", lang)}</span></div>
                  <div className="flex items-center gap-4">
                    <img src={upcoming[0].car?.imageUrl} alt="" className="w-20 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0"><h3 className="text-lg font-bold">{upcoming[0].car?.brand} {upcoming[0].car?.model}</h3><p className="text-sm opacity-90">{formatDate(upcoming[0].pickupDate)} → {formatDate(upcoming[0].returnDate)}</p><p className="text-xs opacity-80 mt-1">{tr("confirm_pickup", lang)}: {upcoming[0].pickupLocation}</p></div>
                    <Button size="sm" variant="secondary" onClick={() => setCustomerView("my-trips")}>{tr("account_view_details", lang)}</Button>
                  </div>
                </Card>
              )}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Award className="h-5 w-5 text-accent" /><h3 className="font-semibold">{tr("account_loyalty", lang)}</h3></div><Badge className="bg-accent text-accent-foreground">{user.tier} {tr("account_tier", lang)}</Badge></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{user.loyaltyPoints || 0} {tr("account_points", lang)}</span><span className="text-muted-foreground">{tr("account_next_platinum", lang)}</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-accent to-amber-500 rounded-full transition-all" style={{ width: `${Math.min(100, ((user.loyaltyPoints || 0) / 2000) * 100)}%` }} /></div>
                  <p className="text-xs text-muted-foreground">{tr("account_earn_pts", lang)}</p>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">{tr("account_recent_trips", lang)}</h3><Button variant="ghost" size="sm" onClick={() => setCustomerView("my-trips")}>{tr("account_view_all", lang)}</Button></div>
                {bookings.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">{tr("account_no_trips", lang)}</p> : (
                  <div className="space-y-2">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30">
                        <img src={b.car?.imageUrl} alt="" className="w-12 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{b.car?.brand} {b.car?.model}</p><p className="text-xs text-muted-foreground">{formatDate(b.pickupDate)}</p></div>
                        <Badge variant="outline" className="text-[10px]">{b.status}</Badge>
                        <span className="text-sm font-semibold text-primary">{formatCurrency(b.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-3" onClick={() => setCustomerView("browse")}><CarIcon className="h-4 w-4 mr-1" />{tr("account_book_new", lang)}</Button>
              </Card>
            </>
          )}
        </TabsContent>
        <TabsContent value="trips">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">{tr("account_all_trips", lang)}</h3><Button variant="outline" size="sm" onClick={() => setCustomerView("browse")}><CarIcon className="h-3.5 w-3.5 mr-1" />{tr("account_book_new", lang)}</Button></div>
            {loading ? <Skeleton className="h-40 rounded-lg" /> : bookings.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">{tr("account_no_trips_yet", lang)} <button onClick={() => setCustomerView("browse")} className="text-primary underline hover:no-underline">{tr("fav_browse", lang)}</button></p> : (
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/30">
                    <img src={b.car?.imageUrl} alt="" className="w-14 h-11 rounded object-cover" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate">{b.car?.brand} {b.car?.model}</p><p className="text-xs text-muted-foreground">{formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</p><p className="text-xs text-muted-foreground">{isRtl ? "كود" : "Code"}: <code className="font-mono">{b.bookingCode}</code></p></div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className={`text-[10px] ${b.status === "UPCOMING" ? "bg-primary/10 text-primary" : b.status === "COMPLETED" ? "bg-muted text-muted-foreground" : "bg-red-500/10 text-red-600"}`}>{b.status}</Badge>
                      <span className="text-sm font-semibold text-primary">{formatCurrency(b.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="favorites">
          <Card className="p-5">
            <h3 className="font-semibold mb-3">{tr("account_fav_cars", lang)}</h3>
            {favoriteCars.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">{tr("account_no_favs", lang)} <button onClick={() => setCustomerView("browse")} className="text-primary underline hover:no-underline">{tr("fav_browse", lang)}</button></p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {favoriteCars.map((car) => <CarCard key={car.id} car={car} onClick={() => { setSelectedCarId(car.id); setCustomerView("car-detail"); window.scrollTo(0, 0); }} />)}
              </div>
            )}
            {favoriteCars.length > 0 && <Button variant="outline" className="w-full mt-4" onClick={() => setCustomerView("favorites")}>{tr("account_view_all_favs", lang)}</Button>}
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card className="p-5">
            <h3 className="font-semibold mb-3">{tr("account_reviews_written", lang)}</h3>
            {reviews.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">{tr("account_no_reviews", lang)}</p> : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">{r.car && <Badge variant="outline">{r.car.brand} {r.car.model}</Badge>}</div>
                      <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(r.createdAt)}{r.tripType && ` • ${r.tripType}`}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 mb-2"><User className="h-4 w-4 text-primary" /><h3 className="font-semibold">{tr("account_profile_info", lang)}</h3></div>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label className="text-xs">{tr("account_full_name", lang)}</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label className="text-xs">{tr("account_email_locked", lang)}</Label><Input value={user.email} disabled className="bg-muted" /></div>
              <div><Label className="text-xs">{tr("account_phone", lang)}</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div><Label className="text-xs">{tr("account_license", lang)}</Label><Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} /></div>
            </div>
            <Button onClick={handleSaveProfile} disabled={savingProfile} className="w-full md:w-auto">{savingProfile ? tr("account_saving", lang) : <><Save className="h-4 w-4 mr-1" />{tr("account_save", lang)}</>}</Button>
          </Card>
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 mb-2"><Shield className="h-4 w-4 text-primary" /><h3 className="font-semibold">{tr("account_change_password", lang)}</h3></div>
            <div><Label className="text-xs">{tr("account_new_password", lang)}</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" /></div>
            <Button variant="outline" onClick={handleChangePassword} disabled={savingPassword}>{savingPassword ? tr("account_updating", lang) : <><Shield className="h-4 w-4 mr-1" />{tr("account_update_password", lang)}</>}</Button>
          </Card>
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 mb-2"><CreditCard className="h-4 w-4 text-primary" /><h3 className="font-semibold">{tr("account_payment_methods", lang)}</h3></div>
            <p className="text-sm text-muted-foreground">{tr("account_no_payment", lang)}</p>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold mb-2">{tr("account_session", lang)}</h3>
            <p className="text-sm text-muted-foreground mb-3">{tr("account_signed_in_as", lang)} <strong>{user.email}</strong></p>
            <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" />{tr("account_signout", lang)}</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string; bg: string; }) {
  return <Card className="p-4"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} mb-3`}><Icon className={`h-5 w-5 ${color}`} /></div><p className="text-xl md:text-2xl font-bold leading-none">{value}</p><p className="text-xs text-muted-foreground mt-1">{label}</p></Card>;
}
