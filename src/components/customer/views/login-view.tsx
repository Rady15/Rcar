"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { tr } from "@/lib/i18n";
import { api } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Car, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";

const DEMO_ACCOUNTS = [{ email: "michael@example.com", password: "demo123", role: "Customer" }];

export function LoginView() {
  const { setUser, setCustomerView, setPlatform, setAdminView, lang } = useAppStore();
  const isRtl = lang === "ar";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api<{ user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (res.user.role === "ADMIN") {
        setUser(res.user); setAdminView("dashboard"); setPlatform("admin");
        toast.success(`${tr("login_welcome_back", lang)}, ${res.user.name}`, { description: tr("login_opening_admin", lang) });
      } else {
        setUser(res.user); setCustomerView("home");
        toast.success(`${tr("login_welcome_back", lang)}, ${res.user.name.split(" ")[0]}!`);
      }
      window.scrollTo(0, 0);
    } catch (e) {
      toast.error(tr("login_failed", lang), { description: e instanceof Error ? e.message : tr("login_check", lang) });
    } finally { setLoading(false); }
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => { setEmail(acc.email); setPassword(acc.password); setMode("login"); };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md" dir={isRtl ? "rtl" : "ltr"}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-3"><Car className="h-7 w-7" /></div>
        <h1 className="text-2xl font-bold tracking-tight">{mode === "login" ? tr("login_welcome", lang) : tr("login_create", lang)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{mode === "login" ? tr("login_signin_desc", lang) : tr("login_signup_desc", lang)}</p>
      </div>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">{tr("login_full_name", lang)}</Label>
              <div className="relative mt-1"><UserIcon className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} /><Input id="name" placeholder={isRtl ? "محمد أحمد" : "John Doe"} value={name} onChange={(e) => setName(e.target.value)} className={isRtl ? "pr-9" : "pl-9"} required /></div>
            </div>
          )}
          <div>
            <Label htmlFor="email">{tr("login_email", lang)}</Label>
            <div className="relative mt-1"><Mail className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} /><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={isRtl ? "pr-9" : "pl-9"} required /></div>
          </div>
          <div>
            <Label htmlFor="password">{tr("login_password", lang)}</Label>
            <div className="relative mt-1"><Lock className={isRtl ? "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" : "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"} /><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={isRtl ? "pr-9" : "pl-9"} required minLength={6} /></div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? tr("login_signing_in", lang) : mode === "login" ? tr("login_btn_signin", lang) : tr("login_btn_signup", lang)}</Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <p className="text-muted-foreground">{tr("login_no_account", lang)} <button onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">{tr("login_signup_link", lang)}</button></p>
          ) : (
            <p className="text-muted-foreground">{tr("login_have_account", lang)} <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">{tr("login_signin_link", lang)}</button></p>
          )}
        </div>
      </Card>
      <div className="mt-6">
        <p className="text-xs text-center text-muted-foreground mb-2 flex items-center justify-center gap-1"><Sparkles className="h-3 w-3" />{tr("login_demo", lang)}</p>
        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((acc) => <Button key={acc.email} variant="outline" size="sm" onClick={() => fillDemo(acc)}>{acc.role} — {acc.email}</Button>)}
        </div>
      </div>
    </div>
  );
}
