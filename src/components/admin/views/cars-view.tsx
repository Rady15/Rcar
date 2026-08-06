"use client";

import { useEffect, useState } from "react";
import { api, formatCurrency, CAR_CATEGORIES, parseFeatures } from "@/lib/helpers";
import { Car } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Star } from "lucide-react";

const EMPTY_CAR = { brand: "", model: "", year: 2024, pricePerDay: 100, category: "sedan", transmission: "automatic", fuelType: "petrol", seats: 5, doors: 4, features: [] as string[], rating: 4.5, color: "", description: "", imageUrl: "", isFeatured: false, isAvailable: true, horsePower: 200, topSpeed: 130, zeroToHundred: 7 };

const FEATURES_LIST = ["Autopilot", "Premium Sound", "Glass Roof", "Heated Seats", "Sentry Mode", "Sport Chrono", "BOSE Sound", "Sport Exhaust", "Lane Keep Assist", "Burmester Sound", "Massage Seats", "Air Suspension", "Nappa Leather", "Quattro AWD", "Carbon Ceramic", "Apple CarPlay", "Wireless CarPlay", "Sunroof", "Panoramic Roof", "JBL Audio", "Recaro Seats"];

export function CarsView() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Car | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_CAR);

  const load = () => { setLoading(true); api<{ cars: Car[] }>("/api/cars").then((res) => setCars(res.cars)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = cars.filter((c) => c.brand.toLowerCase().includes(search.toLowerCase()) || c.model.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditing(null); setForm(EMPTY_CAR); setShowForm(true); };
  const openEdit = (car: Car) => { setEditing(car); setForm({ ...car, features: parseFeatures(car.features), year: Number(car.year), pricePerDay: Number(car.pricePerDay), seats: Number(car.seats), doors: Number(car.doors), horsePower: Number(car.horsePower), topSpeed: Number(car.topSpeed), zeroToHundred: Number(car.zeroToHundred), rating: Number(car.rating) }); setShowForm(true); };

  const handleSave = async () => {
    try {
      if (editing) { await api(`/api/cars/${editing.id}`, { method: "PATCH", body: JSON.stringify({ id: editing.id, ...form }) }); toast.success("Car updated"); }
      else { await api("/api/cars", { method: "POST", body: JSON.stringify(form) }); toast.success("Car created"); }
      setShowForm(false); load();
    } catch (e) { toast.error("Save failed", { description: e instanceof Error ? e.message : "" }); }
  };

  const handleDelete = async (car: Car) => {
    if (!confirm(`Delete ${car.brand} ${car.model}?`)) return;
    try { await api(`/api/cars/${car.id}`, { method: "DELETE" }); toast.success("Car deleted"); load(); }
    catch (e) { toast.error("Delete failed"); }
  };

  const toggleFeature = (f: string) => { const cur = form.features; setForm({ ...form, features: cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f] }); };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold tracking-tight">Cars</h1><p className="text-sm text-muted-foreground">{cars.length} cars in inventory</p></div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add car</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by brand, model, category..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <Card className="p-0 overflow-hidden">
        {loading ? <div className="p-4 space-y-2">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 rounded-md" />)}</div> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Car</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Price/day</TableHead><TableHead>Rating</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell><div className="flex items-center gap-3"><img src={car.imageUrl} alt={car.brand} className="w-12 h-9 rounded object-cover" /><div className="min-w-0"><p className="font-medium truncate">{car.brand} {car.model}</p><p className="text-xs text-muted-foreground">{car.year} • {car.color}</p></div></div></TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{car.category}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(car.pricePerDay)}</TableCell>
                    <TableCell><div className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span className="text-sm">{car.rating.toFixed(1)}</span><span className="text-xs text-muted-foreground">({car.reviewCount})</span></div></TableCell>
                    <TableCell><div className="flex flex-col gap-1">{car.isFeatured && <Badge className="text-[10px] w-fit">Featured</Badge>}<Badge variant={car.isAvailable ? "secondary" : "destructive"} className="text-[10px] w-fit">{car.isAvailable ? "Available" : "Unavailable"}</Badge></div></TableCell>
                    <TableCell className="text-right"><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" onClick={() => openEdit(car)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => handleDelete(car)}><Trash2 className="h-4 w-4 text-red-600" /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit car" : "Add new car"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div><Label className="text-xs">Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Tesla" /></div>
            <div><Label className="text-xs">Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Model S" /></div>
            <div><Label className="text-xs">Year</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Price per day ($)</Label><Input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Category</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CAR_CATEGORIES.filter((c) => c.value !== "all").map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Transmission</Label><Select value={form.transmission} onValueChange={(v) => setForm({ ...form, transmission: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="automatic">Automatic</SelectItem><SelectItem value="manual">Manual</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Fuel type</Label><Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="petrol">Petrol</SelectItem><SelectItem value="diesel">Diesel</SelectItem><SelectItem value="electric">Electric</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Color</Label><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Pearl White" /></div>
            <div><Label className="text-xs">Seats</Label><Input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Doors</Label><Input type="number" value={form.doors} onChange={(e) => setForm({ ...form, doors: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Horsepower</Label><Input type="number" value={form.horsePower} onChange={(e) => setForm({ ...form, horsePower: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Top speed (mph)</Label><Input type="number" value={form.topSpeed} onChange={(e) => setForm({ ...form, topSpeed: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">0-60 mph (sec)</Label><Input type="number" step="0.1" value={form.zeroToHundred} onChange={(e) => setForm({ ...form, zeroToHundred: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Rating (1-5)</Label><Input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
            <div className="col-span-2"><Label className="text-xs">Image URL</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="col-span-2"><Label className="text-xs">Description</Label><textarea className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed car description..." /></div>
            <div className="col-span-2"><Label className="text-xs mb-2 block">Features</Label><div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 border border-border rounded-md">{FEATURES_LIST.map((f) => { const selected = form.features.includes(f); return <button key={f} type="button" onClick={() => toggleFeature(f)} className={`px-2 py-1 rounded text-xs font-medium transition-colors ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>{f}</button>; })}</div><p className="text-xs text-muted-foreground mt-1">{form.features.length} selected</p></div>
            <div className="col-span-2 flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} /><Label className="text-sm">Featured</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.isAvailable} onCheckedChange={(v) => setForm({ ...form, isAvailable: v })} /><Label className="text-sm">Available for booking</Label></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave}>{editing ? "Save changes" : "Create car"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
