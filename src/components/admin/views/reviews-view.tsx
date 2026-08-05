"use client";

import { useEffect, useState } from "react";
import { api, formatDate } from "@/lib/helpers";
import { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Star, Trash2, MessageSquare } from "lucide-react";

export function ReviewsView() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); api<{ reviews: Review[] }>("/api/reviews").then((res) => setReviews(res.reviews)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try { await api(`/api/reviews?id=${id}`, { method: "DELETE" }); toast.success("Review deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold tracking-tight">Reviews</h1><p className="text-sm text-muted-foreground">{reviews.length} reviews • Average {avgRating.toFixed(1)} ★</p></div>
        <Card className="p-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10"><Star className="h-5 w-5 fill-amber-400 text-amber-400" /></div><div><p className="text-2xl font-bold">{avgRating.toFixed(1)}</p><p className="text-xs text-muted-foreground">Average rating</p></div></Card>
      </div>
      {loading ? <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div> : reviews.length === 0 ? (
        <Card className="p-12 text-center"><MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold mb-1">No reviews yet</h3><p className="text-sm text-muted-foreground">Customer reviews will appear here.</p></Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{r.user?.name?.charAt(0) || "U"}</div>
                    <div className="min-w-0"><p className="text-sm font-semibold">{r.user?.name || "Anonymous"}</p><p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}{r.tripType && ` • ${r.tripType}`}</p></div>
                    <div className="flex ml-2">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />)}</div>
                  </div>
                  {r.car && <Badge variant="outline" className="mb-2">{r.car.brand} {r.car.model}</Badge>}
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
