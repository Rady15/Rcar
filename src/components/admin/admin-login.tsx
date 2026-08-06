"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { api } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, Mail, Lock, ArrowLeft } from "lucide-react";

export function AdminLogin() {
  const { setUser, setPlatform, setAdminView } = useAppStore();
  const [email, setEmail] = useState("admin@rentdrive.app");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api<{ user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (res.user.role !== "ADMIN") { toast.error("Access denied", { description: "This account does not have admin privileges." }); return; }
      setUser(res.user); setAdminView("dashboard");
      toast.success(`Welcome, ${res.user.name}`);
    } catch (e) { toast.error("Login failed", { description: e instanceof Error ? e.message : "" }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <button onClick={() => setPlatform("customer")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to customer site</button>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4"><ShieldCheck className="h-8 w-8" /></div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage RentDrive</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="email">Admin email</Label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="admin@rentdrive.app" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required /></div></div>
            <div><Label htmlFor="password">Password</Label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required /></div></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in to admin"}</Button>
          </form>
          <div className="mt-4 p-3 rounded-md bg-muted text-xs space-y-1"><p className="font-semibold">Demo credentials:</p><p>Email: admin@rentdrive.app</p><p>Password: admin123</p></div>
        </Card>
      </div>
    </div>
  );
}
