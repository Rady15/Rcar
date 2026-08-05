"use client";

import { useEffect, useState, useRef } from "react";
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
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon, GripVertical } from "lucide-react";

interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  imageUrl: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY_FORM = {
  name: "", nameAr: "", slug: "", imageUrl: "", description: "", sortOrder: 0, isActive: true,
};

export function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    api<{ categories: Category[] }>("/api/categories").then((res) => setCategories(res.categories)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm({ ...form, imageUrl: data.url });
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally { setUploading(false); }
  };

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, nameAr: cat.nameAr, slug: cat.slug, imageUrl: cat.imageUrl, description: cat.description || "", sortOrder: cat.sortOrder, isActive: cat.isActive });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.imageUrl) { toast.error("Name and image are required"); return; }
    try {
      if (editing) {
        await api(`/api/categories/${editing.id}`, { method: "PATCH", body: JSON.stringify({ id: editing.id, ...form }) });
        toast.success("Category updated");
      } else {
        await api("/api/categories", { method: "POST", body: JSON.stringify(form) });
        toast.success("Category created");
      }
      setShowForm(false); load();
    } catch (e) { toast.error("Save failed"); }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    try { await api(`/api/categories/${cat.id}`, { method: "DELETE" }); toast.success("Category deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><h1 className="text-2xl font-bold tracking-tight">Categories</h1><p className="text-sm text-muted-foreground">{categories.length} categories</p></div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add category</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="overflow-hidden p-0 gap-0">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90" onClick={() => openEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90" onClick={() => handleDelete(cat)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <Badge variant={cat.isActive ? "secondary" : "destructive"} className="text-[10px]">{cat.isActive ? "Active" : "Hidden"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{cat.nameAr} • /{cat.slug}</p>
                {cat.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit category" : "Add new category"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Name (English)</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sedan" /></div>
              <div><Label className="text-xs">Name (Arabic)</Label><Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="سيدان" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="sedan" /></div>
              <div><Label className="text-xs">Sort order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
            </div>
            <div><Label className="text-xs">Description (optional)</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Comfortable sedans for city driving" /></div>

            {/* Image upload */}
            <div>
              <Label className="text-xs">Category image</Label>
              <div className="mt-1 flex items-center gap-3">
                {form.imageUrl && (
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                    <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    <Upload className="h-3.5 w-3.5 mr-1" /> {uploading ? "Uploading..." : "Upload image"}
                  </Button>
                  <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Or paste URL" className="text-xs" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label className="text-sm">Active (visible on site)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save changes" : "Create category"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
