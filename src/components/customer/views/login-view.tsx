"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { api } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Car, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";

const DEMO_ACCOUNTS = [{ email: "michael@example.com", password: "demo123", role: "Customer" }];

export function LoginView() {
  const { setUser, setCustomerView, setPlatform, setAdminView } = useAppStore();
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
      // Smart redirect: admin → admin panel, customer → home
      if (res.user.role === "ADMIN") {
        setUser(res.user); setAdminView("dashboard"); setPlatform("admin");
        toast.success(`Welcome back, ${res.user.name}`, { description: "Opening admin dashboard..." });
      } else {
        setUser(res.user); setCustomerView("home");
        toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
      }
      window.scrollTo(0, 0);
    } catch (e) {
      toast.error("Sign in failed", { description: e instanceof Error ? e.message : "Please check your credentials" });
    } finally { setLoading(false); }
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => { setEmail(acc.email); setPassword(acc.password); setMode("login"); };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-3"><Car className="h-7 w-7" /></div>
        <h1 className="text-2xl font-bold tracking-tight">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground mt-1">{mode === "login" ? "Sign in to manage your bookings" : "Join RentDrive and start your next adventure"}</p>
      </div>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Full name</Label>
              <div className="relative mt-1"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" required /></div>
            </div>
          )}
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required /></div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required minLength={6} /></div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : mode === "login" ? "Sign in" : "Create account"}</Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <p className="text-muted-foreground">Don&apos;t have an account? <button onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">Sign up</button></p>
          ) : (
            <p className="text-muted-foreground">Already have an account? <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">Sign in</button></p>
          )}
        </div>
      </Card>
      <div className="mt-6">
        <p className="text-xs text-center text-muted-foreground mb-2 flex items-center justify-center gap-1"><Sparkles className="h-3 w-3" />Try a demo customer account:</p>
        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((acc) => <Button key={acc.email} variant="outline" size="sm" onClick={() => fillDemo(acc)}>{acc.role} — {acc.email}</Button>)}
        </div>
      </div>
    </div>
  );
}
