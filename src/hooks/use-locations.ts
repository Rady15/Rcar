"use client";

import { useEffect, useState } from "react";
import { api, CAR_LOCATIONS } from "@/lib/helpers";
import { Location } from "@/lib/types";

export function useLocations(): Location[] {
  const [locations, setLocations] = useState<Location[]>(
    CAR_LOCATIONS.map((name, i) => ({ id: name, name, nameAr: name, sortOrder: i + 1, isActive: true }))
  );

  useEffect(() => {
    api<{ locations: Location[] }>("/api/locations")
      .then((res) => setLocations(res.locations))
      .catch(() => {});
  }, []);

  return locations;
}
