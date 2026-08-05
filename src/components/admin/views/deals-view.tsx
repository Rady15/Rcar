"use client";

import { useEffect, useState } from "react";
import { api, timeRemaining } from "@/lib/helpers";
import { Deal, Car } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Tag, Trash2, Timer } from "lucide-react";

export function DealsAdminView() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", discountLabel: "20% OFF", discountPercent: 20, carId: "", promoCode: "", endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0] });

  const load = () => { setLoading(true); Promise.all([api<{ deals: Deal[] }>("/api/deals"), api<{ cars: Car[] }>("/api/cars")]).then(([d, c]) => { setDeals(d.deals); setCars(c.cars); }).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleSave = async () => {
    if (!form.title || !form.promoCode) { toast.error("Title and promo code are required"); return; }
    try {
      await api("/api/deals", { method: "POST", body: JSON.stringify({ ...form, endDate: new Date(form.endDate).toISOString(), carId: form.carId || null }) });
      toast.success("Deal created"); setShowForm(false);
      setForm({ title: "", description: "", discountLabel: "20% OFF", discountPercent: 20, carId: "", promoCode: "", endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0] });
      load();
    } catch { toast.error("Failed to create deal"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold tracking-tight">Deals</h1><p className="text-sm text-muted-foreground">{deals.length} active promotions</p></div>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" />Create deal</Button>
      </div>
      {loading ? <div className="grid md:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div> : deals.length === 0 ? (
        <Card className="p-12 text-center"><Tag className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><h3 className="font-semibold mb-1">No deals yet</h3><p className="text-sm text-muted-foreground">Create your first promotion to attract more bookings.</p></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden p-0 gap-0">
              <div className="bg-gradient-to-r from-primary to-primary/70 p-3 flex items-center justify-between">
                <Badge className="bg-primary-foreground text-primary">{deal.discountLabel}</Badge>
                <div className="flex items-center gap-1.5 text-primary-foreground text-xs"><Timer className="h-3.5 w-3.5" />{timeRemaining(deal.endDate)}</div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold">{deal.title}</h3>
                <p className="text-sm text-muted-foreground">{deal.description}</p>
                {deal.car && <div className="flex items-center gap-2 pt-2"><img src={deal.car.imageUrl} alt="" className="w-12 h-9 rounded object-cover" /><span className="text-sm">{deal.car.brand} {deal.car.model}</span></div>}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div><p className="text-xs text-muted-foreground">Promo code</p><code className="font-mono font-bold text-primary">{deal.promoCode}</code></div>
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this deal?")) { api(`/api/deals?id=${deal.id}`, { method: "DELETE" }).then(() => { toast.success("Deal deleted"); load(); }).catch(() => toast.error("Delete failed")); } }}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create new deal</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Weekend Flash Sale" /></div>
            <div><Label className="text-xs">Description</Label><textarea className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm min-h-[60px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Get 25% off all weekend rentals..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Discount label</Label><Input value={form.discountLabel} onChange={(e) => setForm({ ...form, discountLabel: e.target.value })} placeholder="25% OFF" /></div>
              <div><Label className="text-xs">Discount %</Label><Input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Promo code</Label><Input value={form.promoCode} onChange={(e) => setForm({ ...form, promoCode: e.target.value.toUpperCase() })} placeholder="WEEKEND25" /></div>
              <div><Label className="text-xs">End date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
            <div><Label className="text-xs">Linked car (optional)</Label><Select value={form.carId} onValueChange={(v) => setForm({ ...form, carId: v })}><SelectTrigger><SelectValue placeholder="No specific car" /></SelectTrigger><SelectContent><SelectItem value="">No specific car</SelectItem>{cars.map((c) => <SelectItem key={c.id} value={c.id}>{c.brand} {c.model}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave}>Create deal</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
