"use client";

import { useAppStore } from "@/lib/store";
import { CustomerApp } from "@/components/customer/customer-app";
import { AdminApp } from "@/components/admin/admin-app";

export default function Home() {
  const platform = useAppStore((s) => s.platform);
  return platform === "admin" ? <AdminApp /> : <CustomerApp />;
}
