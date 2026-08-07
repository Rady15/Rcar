export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function timeRemaining(endDate: Date | string): string {
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export const CAR_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "sports", label: "Sports" },
  { value: "luxury", label: "Luxury" },
  { value: "electric", label: "Electric" },
  { value: "convertible", label: "Convertible" },
  { value: "van", label: "Van" },
] as const;

export const CAR_LOCATIONS = [
  "Riyadh", "Jeddah", "Dammam", "Al Khobar", "Makkah", "Madinah", "Tabuk", "Abha",
];

export const BOOKING_EXTRAS = [
  { id: "child_seat", label: "Child Seat", desc: "Suitable for ages 1-7", price: 8 },
  { id: "gps", label: "GPS Navigation", desc: "Premium 3D maps", price: 5 },
  { id: "additional_driver", label: "Additional Driver", desc: "Add up to 2 drivers", price: 12 },
  { id: "unlimited_miles", label: "Unlimited Miles", desc: "No distance cap", price: 15 },
];

export function parseFeatures(features: string | string[] | null | undefined): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  try { return JSON.parse(features); } catch { return []; }
}
