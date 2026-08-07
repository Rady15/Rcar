"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  nameAr: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY_FORM = { name: "", nameAr: "", sortOrder: 0, isActive: true };

export function LocationsView() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = () => {
    setLoading(true);
    api<{ locations: Location[] }>("/api/locations").then((res) => setLocations(res.locations)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, sortOrder: locations.length + 1 });
    setShowForm(true);
  };
  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({ name: loc.name, nameAr: loc.nameAr, sortOrder: loc.sortOrder, isActive: loc.isActive });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Location name is required"); return; }
    try {
      if (editing) {
        await api(`/api/locations/${editing.id}`, { method: "PATCH", body: JSON.stringify(form) });
        toast.success("Location updated");
      } else {
        await api("/api/locations", { method: "POST", body: JSON.stringify(form) });
        toast.success("Location created");
      }
      setShowForm(false); load();
    } catch (e) { toast.error("Save failed"); }
  };

  const handleDelete = async (loc: Location) => {
    if (!confirm(`Delete "${loc.name}"?`)) return;
    try { await api(`/api/locations/${loc.id}`, { method: "DELETE" }); toast.success("Location deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold tracking-tight">Locations</h1><p className="text-sm text-muted-foreground">{locations.length} cities — Saudi Arabia</p></div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add location</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <Card key={loc.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0"><MapPin className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{loc.name}</h3>
                      <Badge variant={loc.isActive ? "secondary" : "destructive"} className="text-[10px]">{loc.isActive ? "Active" : "Hidden"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{loc.nameAr}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(loc)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(loc)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Sort order: {loc.sortOrder}</p>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit location" : "Add new location"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">City (English)</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Riyadh" /></div>
              <div><Label className="text-xs">City (Arabic)</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="الرياض" /></div>
            </div>
            <div><Label className="text-xs">Sort order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
            <div className="flex items-center gap-2 pt-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label className="text-sm">Active (visible on site)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Create location"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
