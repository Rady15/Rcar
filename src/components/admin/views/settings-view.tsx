"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { User, Globe, Moon, Shield, Save } from "lucide-react";

export function SettingsView() {
  const { user, setPlatform } = useAppStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 md:p-6 max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Settings</h1><p className="text-sm text-muted-foreground">Manage your account and preferences</p></div>
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2"><User className="h-5 w-5 text-primary" /><h2 className="font-semibold">Profile</h2></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Name</Label><Input defaultValue={user?.name} disabled /></div>
          <div><Label className="text-xs">Email</Label><Input defaultValue={user?.email} disabled /></div>
        </div>
        <p className="text-xs text-muted-foreground">Profile editing is disabled in this demo.</p>
      </Card>
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2"><Globe className="h-5 w-5 text-primary" /><h2 className="font-semibold">Preferences</h2></div>
        <div className="flex items-center justify-between">
          <div><Label className="text-sm font-medium">Dark mode</Label><p className="text-xs text-muted-foreground">Switch between light and dark themes</p></div>
          <div className="flex items-center gap-2"><Moon className="h-4 w-4 text-muted-foreground" /><Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} /></div>
        </div>
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div><Label className="text-sm font-medium">Email notifications</Label><p className="text-xs text-muted-foreground">Receive booking and marketing emails</p></div>
          <Switch defaultChecked />
        </div>
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div><Label className="text-sm font-medium">Push notifications</Label><p className="text-xs text-muted-foreground">Get real-time alerts in your browser</p></div>
          <Switch defaultChecked />
        </div>
      </Card>
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2"><Shield className="h-5 w-5 text-primary" /><h2 className="font-semibold">Security</h2></div>
        <div><Label className="text-xs">Current password</Label><Input type="password" placeholder="••••••••" /></div>
        <div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">New password</Label><Input type="password" placeholder="••••••••" /></div><div><Label className="text-xs">Confirm new password</Label><Input type="password" placeholder="••••••••" /></div></div>
        <Button variant="outline" onClick={() => toast.info("Password change is disabled in demo")}><Save className="h-4 w-4 mr-1" />Update password</Button>
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold mb-2">Customer site preview</h2>
        <p className="text-sm text-muted-foreground mb-3">View the customer-facing rental platform</p>
        <Button onClick={() => setPlatform("customer")}>Open customer site →</Button>
      </Card>
    </div>
  );
}
