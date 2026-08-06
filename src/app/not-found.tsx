"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
          <Car className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => window.location.href = "/"}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
