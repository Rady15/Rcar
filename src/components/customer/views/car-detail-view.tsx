"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api, formatCurrency, parseFeatures } from "@/lib/helpers";
import { Car, Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Star, Heart, Share2, ArrowLeft, ArrowRight, Users, Settings, Fuel,
  DoorOpen, Gauge, Timer, TrendingUp, CheckCircle2, Calendar, MapPin,
  Shield, Clock, PenLine,
} from "lucide-react";

export function CarDetailView() {
  const { selectedCarId, setSelectedCarId, setCustomerView, favorites, toggleFavorite, user, setBookingDraft, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewTripType, setReviewTripType] = useState("Business");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!selectedCarId) { setCustomerView("browse"); return; }
    setLoading(true);
    api<{ car: Car; reviews: Review[] }>(`/api/cars/${selectedCarId}`).then((res) => { setCar(res.car); setReviews(res.reviews); }).finally(() => setLoading(false));
  }, [selectedCarId]);

  const handleBook = () => {
    if (!user) { setCustomerView("login"); return; }
    setBookingDraft({
      pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
      pickupLocation: "Riyadh", returnLocation: "Riyadh",
      extras: [], insurance: true,
    });
    setCustomerView("booking");
    window.scrollTo(0, 0);
  };

  const handleSubmitReview = async () => {
    if (!user || !car) return;
    if (!reviewComment.trim()) { toast.error(isRtl ? "اكتب تعليقًا" : "Please write a comment"); return; }
    setSubmittingReview(true);
    try {
      const res = await api<{ review: Review }>("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          carId: car.id,
          rating: Number(reviewRating),
          comment: reviewComment,
          tripType: reviewTripType,
        }),
      });
      setReviews([res.review, ...reviews]);
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating("5");
      toast.success(isRtl ? "تم إضافة تقييمك" : "Review added");
    } catch (e) {
      toast.error(isRtl ? "فشل إضافة التقييم" : "Failed to add review");
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><Skeleton className="h-96 rounded-xl mb-6" /><div className="grid md:grid-cols-2 gap-6"><Skeleton className="h-64 rounded-xl" /><Skeleton className="h-64 rounded-xl" /></div></div>;
  if (!car) return <div className="container mx-auto px-4 py-16 text-center"><h2 className="text-xl font-semibold">{isRtl ? "السيارة غير موجودة" : "Car not found"}</h2><Button className="mt-4" onClick={() => setCustomerView("browse")}>{tr("detail_back", lang)}</Button></div>;

  const features = parseFeatures(car.features);
  const isFav = favorites.includes(car.id);
  const BackIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" dir={isRtl ? "rtl" : "ltr"}>
      <Button variant="ghost" size="sm" onClick={() => { setSelectedCarId(null); setCustomerView("browse"); }}>
        <BackIcon className="h-4 w-4 mr-1" /> {tr("detail_back", lang)}
      </Button>
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-muted">
        <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-black/70 text-white hover:bg-black/70"><Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />{car.rating.toFixed(1)} ({car.reviewCount} {tr("detail_reviews", lang)})</Badge>
          {car.isFeatured && <Badge className="bg-primary text-primary-foreground">{isRtl ? "مميزة" : "Featured"}</Badge>}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white" onClick={() => toggleFavorite(car.id)}>
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
          </Button>
          <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white"><Share2 className="h-4 w-4 text-gray-700" /></Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{car.brand} {car.model}</h1>
              <p className="text-muted-foreground mt-1">{car.year} • {car.color} • {tr(`cat_${car.category}`, lang)}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-primary">{formatCurrency(car.pricePerDay)}</div>
              <div className="text-sm text-muted-foreground">{tr("detail_per_day", lang)}</div>
            </div>
          </div>
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SpecItem icon={Users} label={tr("detail_seats", lang)} value={`${car.seats}`} />
              <SpecItem icon={Settings} label={tr("detail_transmission", lang)} value={car.transmission === "automatic" ? tr("detail_auto", lang) : tr("detail_manual", lang)} />
              <SpecItem icon={Fuel} label={tr("detail_fuel", lang)} value={car.fuelType} />
              <SpecItem icon={DoorOpen} label={tr("detail_doors", lang)} value={`${car.doors}`} />
            </div>
          </Card>
          <div>
            <h2 className="text-xl font-bold mb-3">{tr("detail_performance", lang)}</h2>
            <div className="grid grid-cols-3 gap-3">
              <PerfCard icon={Gauge} label={tr("detail_horsepower", lang)} value={`${car.horsePower}`} unit="HP" color="text-red-600" />
              <PerfCard icon={TrendingUp} label={tr("detail_top_speed", lang)} value={`${Math.round(car.topSpeed)}`} unit="mph" color="text-primary" />
              <PerfCard icon={Timer} label={tr("detail_0_60", lang)} value={car.zeroToHundred.toFixed(1)} unit="s" color="text-emerald-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">{tr("detail_about", lang)}</h2>
            <p className="text-muted-foreground leading-relaxed">{car.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">{tr("detail_features", lang)}</h2>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => <Badge key={f} variant="secondary" className="px-3 py-1.5 text-sm"><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-primary" />{f}</Badge>)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">{tr("detail_reviews_title", lang)}</h2>
              <Badge variant="outline"><Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />{car.rating.toFixed(1)} • {car.reviewCount} {tr("detail_reviews", lang)}</Badge>
            </div>
            {reviews.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">{tr("detail_no_reviews", lang)}</Card>
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, 3).map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{r.user?.name?.charAt(0) || "U"}</div>
                        <div>
                          <p className="text-sm font-semibold">{r.user?.name || (isRtl ? "مجهول" : "Anonymous")}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString(isRtl ? "ar" : "en")}{r.tripType && ` • ${r.tripType}`}</p>
                        </div>
                      </div>
                      <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </Card>
                ))}
                <div className="flex gap-2">
                  {user && (
                    <Button variant="default" className="flex-1" onClick={() => setShowReviewForm(true)}>
                      <PenLine className="h-4 w-4 mr-1" /> {isRtl ? "اكتب تقييمًا" : "Write a Review"}
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1" onClick={() => {}}>
                    {tr("detail_view_all_reviews", lang)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20 space-y-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">{formatCurrency(car.pricePerDay)}</span>
                <span className="text-sm text-muted-foreground">/{tr("booking_day", lang)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{tr("detail_free_cancel", lang)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> {tr("detail_flexible_dates", lang)}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {tr("detail_locations", lang)}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {tr("detail_insurance", lang)}</div>
            </div>
            <Button size="lg" className="w-full" onClick={handleBook} disabled={!car.isAvailable}>
              {car.isAvailable ? tr("detail_book_now", lang) : tr("detail_not_available", lang)}
            </Button>
            {!user && <p className="text-xs text-center text-muted-foreground">{tr("detail_need_signin", lang)}</p>}
          </Card>
        </div>
      </div>

      {/* Review Writing Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isRtl ? "اكتب تقييمًا" : "Write a Review"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs">{isRtl ? "التقييم" : "Rating"}</Label>
              <Select value={reviewRating} onValueChange={setReviewRating}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{isRtl ? "نوع الرحلة" : "Trip Type"}</Label>
              <Select value={reviewTripType} onValueChange={setReviewTripType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">{isRtl ? "عمل" : "Business"}</SelectItem>
                  <SelectItem value="Family">{isRtl ? "عائلي" : "Family"}</SelectItem>
                  <SelectItem value="Road trip">{isRtl ? "رحلة برية" : "Road trip"}</SelectItem>
                  <SelectItem value="Weekend">{isRtl ? "عطلة نهاية الأسبوع" : "Weekend"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">{isRtl ? "تعليقك" : "Your comment"}</Label>
              <Textarea
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={isRtl ? "شارك تجربتك..." : "Share your experience..."}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewForm(false)}>{isRtl ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleSubmitReview} disabled={submittingReview}>
              {submittingReview ? (isRtl ? "جارٍ الإرسال..." : "Submitting...") : (isRtl ? "إرسال" : "Submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; }) {
  return <div className="flex flex-col items-center text-center p-2"><Icon className="h-5 w-5 text-primary mb-1" /><span className="text-sm font-semibold">{value}</span><span className="text-xs text-muted-foreground">{label}</span></div>;
}

function PerfCard({ icon: Icon, label, value, unit, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; unit: string; color: string; }) {
  return <Card className="p-3 text-center"><Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} /><div className={`text-lg font-bold ${color}`}>{value}</div><div className="text-xs text-muted-foreground">{unit}</div><div className="text-[10px] text-muted-foreground mt-0.5">{label}</div></Card>;
}
