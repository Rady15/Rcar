import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const SALT_ROUNDS = 10;

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify a password against a hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Simple session token (not JWT, but unique enough for demo)
export function generateSessionToken(userId: string): string {
  return `${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

// Check if a car is available for the given date range
export async function checkCarAvailability(
  carId: string,
  pickupDate: Date,
  returnDate: Date,
  excludeBookingId?: string
): Promise<{ available: boolean; conflict?: string }> {
  const car = await db.car.findUnique({ where: { id: carId } });
  if (!car) return { available: false };
  if (!car.isAvailable) return { available: false };

  // Check for overlapping bookings
  const conflicting = await db.booking.findFirst({
    where: {
      carId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { in: ["UPCOMING", "ACTIVE", "PICKED_UP"] },
      OR: [
        // New pickup falls within existing booking
        { pickupDate: { lte: returnDate }, returnDate: { gte: pickupDate } },
      ],
    },
  });

  if (conflicting) {
    return { available: false, conflict: conflicting.bookingCode };
  }

  return { available: true };
}

// Generate a unique booking code
export async function generateBookingCode(): Promise<string> {
  let code = "";
  let attempts = 0;
  while (attempts < 10) {
    code = `RD${Math.floor(Math.random() * 900000 + 100000)}`;
    const existing = await db.booking.findFirst({ where: { bookingCode: code } });
    if (!existing) return code;
    attempts++;
  }
  return `RD${Date.now().toString().slice(-6)}`;
}

// Generate a 4-digit OTP for pickup
export function generatePickupOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
