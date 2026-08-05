"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/helpers";
import { SiteContent, StatItem, HowItWorksStep, ICON_OPTIONS_STAT, ICON_OPTIONS_HOW } from "@/lib/site-content-types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2, Loader2, LayoutDashboard, Sparkles, ListOrdered, Quote, Megaphone, Phone, Palette, Search as SearchIcon, RotateCcw } from "lucide-react";

const EMPTY_CONTENT: SiteContent = {
  hero: { badge: "", title: "", highlightedWord: "", italicWord: "", subtitle: "", primaryBtn: "", secondaryBtn: "", imageUrl: "", scrollHint: "", showBadges: true, signInLabel: "", adminLabel: "" },
  stats: [], howItWorks: [], testimonials: [],
  finalCta: { title: "", subtitle: "", primaryBtn: "", secondaryBtn: "", adminLabel: "" },
  footer: { tagline: "", phone: "", email: "", address: "", copyright: "" },
  branding: { siteName: "", logoEmoji: "🚗", logoUrl: "", accentColor: "#d97706" },
  seo: { title: "", description: "", keywords: "", ogImageUrl: "", twitterHandle: "" },
  updatedAt: "",
};

export function ContentView() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api<SiteContent>("/api/site-content").then(setContent).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const updated = await api<SiteContent>("/api/site-content", { method: "PUT", body: JSON.stringify(content) });
      setContent(updated);
      toast.success("Content saved", { description: "The customer site will reflect your changes immediately." });
    } catch (e) { toast.error("Save failed", { description: e instanceof Error ? e.message : "" }); }
    finally { setSaving(false); }
  };

  if (loading || !content) return <div className="p-6 space-y-4"><Skeleton className="h-10 w-64 rounded-md" /><Skeleton className="h-96 rounded-xl" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold tracking-tight">Site Content</h1><p className="text-sm text-muted-foreground">Edit every section of the marketing site — changes go live instantly.</p></div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { if (confirm("Reset all content to defaults?")) { api<SiteContent>("/api/site-content", { method: "PUT", body: JSON.stringify(EMPTY_CONTENT) }).then(setContent).then(() => toast.info("Reset to empty — save to confirm")).catch(() => toast.error("Reset failed")); } }}><RotateCcw className="h-4 w-4 mr-1" />Reset</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-1" />Save changes</>}</Button>
        </div>
      </div>
      <Tabs defaultValue="hero">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="gap-1.5"><LayoutDashboard className="h-3.5 w-3.5" />Hero</TabsTrigger>
          <TabsTrigger value="stats" className="gap-1.5"><Sparkles className="h-3.5 w-3.5" />Stats</TabsTrigger>
          <TabsTrigger value="how" className="gap-1.5"><ListOrdered className="h-3.5 w-3.5" />How it works</TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-1.5"><Quote className="h-3.5 w-3.5" />Testimonials</TabsTrigger>
          <TabsTrigger value="cta" className="gap-1.5"><Megaphone className="h-3.5 w-3.5" />Final CTA</TabsTrigger>
          <TabsTrigger value="footer" className="gap-1.5"><Phone className="h-3.5 w-3.5" />Footer</TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5"><Palette className="h-3.5 w-3.5" />Branding</TabsTrigger>
          <TabsTrigger value="seo" className="gap-1.5"><SearchIcon className="h-3.5 w-3.5" />SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="hero">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Hero section</h2><p className="text-xs text-muted-foreground">The full-screen intro at the top of the home page.</p>
            <div className="grid md:grid-cols-2 gap-3">
              <Field label="Badge text"><Input value={content.hero.badge} onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })} /></Field>
              <Field label="Scroll hint"><Input value={content.hero.scrollHint} onChange={(e) => setContent({ ...content, hero: { ...content.hero, scrollHint: e.target.value } })} /></Field>
              <Field label="Title (line 1)"><Input value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} /></Field>
              <Field label="Highlighted word (in primary color)"><Input value={content.hero.highlightedWord} onChange={(e) => setContent({ ...content, hero: { ...content.hero, highlightedWord: e.target.value } })} /></Field>
              <Field label="Italic serif word (line 2)"><Input value={content.hero.italicWord} onChange={(e) => setContent({ ...content, hero: { ...content.hero, italicWord: e.target.value } })} /></Field>
              <Field label="Primary button label"><Input value={content.hero.primaryBtn} onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryBtn: e.target.value } })} /></Field>
              <Field label="Secondary button label"><Input value={content.hero.secondaryBtn} onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryBtn: e.target.value } })} /></Field>
              <Field label="Sign-in label"><Input value={content.hero.signInLabel} onChange={(e) => setContent({ ...content, hero: { ...content.hero, signInLabel: e.target.value } })} /></Field>
              <Field label="Background image URL"><Input value={content.hero.imageUrl} onChange={(e) => setContent({ ...content, hero: { ...content.hero, imageUrl: e.target.value } })} /></Field>
            </div>
            <Field label="Subtitle"><Textarea rows={3} value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} /></Field>
            <div className="flex items-center gap-2 pt-2 border-t border-border"><Switch checked={content.hero.showBadges} onCheckedChange={(v) => setContent({ ...content, hero: { ...content.hero, showBadges: v } })} /><Label className="text-sm">Show trust badges (Free insurance / Free cancellation / 24/7 support)</Label></div>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="font-semibold">Stats bar</h2><p className="text-xs text-muted-foreground">The 4-metric band that appears below the hero.</p></div>
              <Button size="sm" variant="outline" onClick={() => setContent({ ...content, stats: [...content.stats, { icon: "car", value: "", label: "" }] })}><Plus className="h-4 w-4 mr-1" />Add stat</Button>
            </div>
            {content.stats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No stats yet. Add one to display the stats bar.</p>}
            {content.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px_40px] gap-2 items-end p-3 rounded-lg border border-border">
                <Field label="Value"><Input value={s.value} onChange={(e) => { const next = [...content.stats]; next[i] = { ...s, value: e.target.value }; setContent({ ...content, stats: next }); }} /></Field>
                <Field label="Label"><Input value={s.label} onChange={(e) => { const next = [...content.stats]; next[i] = { ...s, label: e.target.value }; setContent({ ...content, stats: next }); }} /></Field>
                <Field label="Icon"><Select value={s.icon} onValueChange={(v) => { const next = [...content.stats]; next[i] = { ...s, icon: v as StatItem["icon"] }; setContent({ ...content, stats: next }); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ICON_OPTIONS_STAT.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></Field>
                <Button size="icon" variant="ghost" onClick={() => setContent({ ...content, stats: content.stats.filter((_, x) => x !== i) })}><Trash2 className="h-4 w-4 text-red-600" /></Button>
              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="how">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="font-semibold">How it works</h2><p className="text-xs text-muted-foreground">The 4-step guide shown mid-page.</p></div>
              <Button size="sm" variant="outline" onClick={() => setContent({ ...content, howItWorks: [...content.howItWorks, { step: String(content.howItWorks.length + 1).padStart(2, "0"), title: "", desc: "", icon: "search" }] })}><Plus className="h-4 w-4 mr-1" />Add step</Button>
            </div>
            {content.howItWorks.map((s, i) => (
              <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Input className="w-20" value={s.step} onChange={(e) => { const next = [...content.howItWorks]; next[i] = { ...s, step: e.target.value }; setContent({ ...content, howItWorks: next }); }} />
                  <Input className="flex-1 font-medium" placeholder="Step title" value={s.title} onChange={(e) => { const next = [...content.howItWorks]; next[i] = { ...s, title: e.target.value }; setContent({ ...content, howItWorks: next }); }} />
                  <Select value={s.icon} onValueChange={(v) => { const next = [...content.howItWorks]; next[i] = { ...s, icon: v as HowItWorksStep["icon"] }; setContent({ ...content, howItWorks: next }); }}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent>{ICON_OPTIONS_HOW.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
                  <Button size="icon" variant="ghost" onClick={() => setContent({ ...content, howItWorks: content.howItWorks.filter((_, x) => x !== i) })}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
                <Textarea rows={2} placeholder="Step description" value={s.desc} onChange={(e) => { const next = [...content.howItWorks]; next[i] = { ...s, desc: e.target.value }; setContent({ ...content, howItWorks: next }); }} />
              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="testimonials">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="font-semibold">Testimonials</h2><p className="text-xs text-muted-foreground">Customer quotes shown in the testimonials section.</p></div>
              <Button size="sm" variant="outline" onClick={() => setContent({ ...content, testimonials: [...content.testimonials, { name: "", role: "", rating: 5, text: "", initials: "" }] })}><Plus className="h-4 w-4 mr-1" />Add testimonial</Button>
            </div>
            {content.testimonials.map((t, i) => (
              <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Input className="w-24" placeholder="XX" value={t.initials} onChange={(e) => { const next = [...content.testimonials]; next[i] = { ...t, initials: e.target.value }; setContent({ ...content, testimonials: next }); }} />
                  <Input className="flex-1" placeholder="Customer name" value={t.name} onChange={(e) => { const next = [...content.testimonials]; next[i] = { ...t, name: e.target.value }; setContent({ ...content, testimonials: next }); }} />
                  <Input className="flex-1" placeholder="Role / context" value={t.role} onChange={(e) => { const next = [...content.testimonials]; next[i] = { ...t, role: e.target.value }; setContent({ ...content, testimonials: next }); }} />
                  <Select value={String(t.rating)} onValueChange={(v) => { const next = [...content.testimonials]; next[i] = { ...t, rating: Number(v) }; setContent({ ...content, testimonials: next }); }}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger><SelectContent>{[5, 4, 3, 2, 1].map((n) => <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>)}</SelectContent></Select>
                  <Button size="icon" variant="ghost" onClick={() => setContent({ ...content, testimonials: content.testimonials.filter((_, x) => x !== i) })}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
                <Textarea rows={3} placeholder="Quote text" value={t.text} onChange={(e) => { const next = [...content.testimonials]; next[i] = { ...t, text: e.target.value }; setContent({ ...content, testimonials: next }); }} />
              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="cta">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Final call-to-action</h2><p className="text-xs text-muted-foreground">The gradient card at the bottom of the home page.</p>
            <div className="space-y-3">
              <Field label="Title"><Input value={content.finalCta.title} onChange={(e) => setContent({ ...content, finalCta: { ...content.finalCta, title: e.target.value } })} /></Field>
              <Field label="Subtitle"><Textarea rows={2} value={content.finalCta.subtitle} onChange={(e) => setContent({ ...content, finalCta: { ...content.finalCta, subtitle: e.target.value } })} /></Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Primary button"><Input value={content.finalCta.primaryBtn} onChange={(e) => setContent({ ...content, finalCta: { ...content.finalCta, primaryBtn: e.target.value } })} /></Field>
                <Field label="Secondary button"><Input value={content.finalCta.secondaryBtn} onChange={(e) => setContent({ ...content, finalCta: { ...content.finalCta, secondaryBtn: e.target.value } })} /></Field>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="footer">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Footer</h2><p className="text-xs text-muted-foreground">The footer shown on every customer page.</p>
            <div className="space-y-3">
              <Field label="Tagline"><Textarea rows={2} value={content.footer.tagline} onChange={(e) => setContent({ ...content, footer: { ...content.footer, tagline: e.target.value } })} /></Field>
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Phone"><Input value={content.footer.phone} onChange={(e) => setContent({ ...content, footer: { ...content.footer, phone: e.target.value } })} /></Field>
                <Field label="Email"><Input value={content.footer.email} onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })} /></Field>
                <Field label="Address"><Input value={content.footer.address} onChange={(e) => setContent({ ...content, footer: { ...content.footer, address: e.target.value } })} /></Field>
              </div>
              <Field label="Copyright text"><Input value={content.footer.copyright} onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })} /></Field>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="branding">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">Branding</h2><p className="text-xs text-muted-foreground">Site name, logo, and accent color used across the customer site.</p>
            <div className="space-y-3">
              <Field label="Site name (shown in header & footer)"><Input value={content.branding.siteName} onChange={(e) => setContent({ ...content, branding: { ...content.branding, siteName: e.target.value } })} /></Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Logo emoji (shown if no logo URL)"><Input value={content.branding.logoEmoji} onChange={(e) => setContent({ ...content, branding: { ...content.branding, logoEmoji: e.target.value } })} /></Field>
                <Field label="Accent color (hex)">
                  <div className="flex gap-2">
                    <Input value={content.branding.accentColor} onChange={(e) => setContent({ ...content, branding: { ...content.branding, accentColor: e.target.value } })} />
                    <input type="color" value={content.branding.accentColor} onChange={(e) => setContent({ ...content, branding: { ...content.branding, accentColor: e.target.value } })} className="w-12 h-10 rounded border border-border cursor-pointer" />
                  </div>
                </Field>
              </div>
              <Field label="Logo image URL (optional — overrides emoji)"><Input value={content.branding.logoUrl} onChange={(e) => setContent({ ...content, branding: { ...content.branding, logoUrl: e.target.value } })} /></Field>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="seo">
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold">SEO & social</h2><p className="text-xs text-muted-foreground">Controls browser tab title, search engine meta tags, and social sharing previews.</p>
            <div className="space-y-3">
              <Field label="Page title (50–60 chars recommended)"><Input value={content.seo.title} onChange={(e) => setContent({ ...content, seo: { ...content.seo, title: e.target.value } })} /></Field>
              <Field label="Meta description (150–160 chars recommended)"><Textarea rows={3} value={content.seo.description} onChange={(e) => setContent({ ...content, seo: { ...content.seo, description: e.target.value } })} /></Field>
              <Field label="Keywords (comma-separated)"><Input value={content.seo.keywords} onChange={(e) => setContent({ ...content, seo: { ...content.seo, keywords: e.target.value } })} /></Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Open Graph image URL (1200×630 recommended)"><Input value={content.seo.ogImageUrl} onChange={(e) => setContent({ ...content, seo: { ...content.seo, ogImageUrl: e.target.value } })} /></Field>
                <Field label="Twitter handle"><Input value={content.seo.twitterHandle} onChange={(e) => setContent({ ...content, seo: { ...content.seo, twitterHandle: e.target.value } })} /></Field>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="text-xs text-muted-foreground text-center pt-2">Last updated: {content.updatedAt ? new Date(content.updatedAt).toLocaleString() : "—"}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode; }) {
  return <div><Label className="text-xs">{label}</Label><div className="mt-1">{children}</div></div>;
}
