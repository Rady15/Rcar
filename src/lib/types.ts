export interface Car {
  id: string; brand: string; model: string; year: number;
  pricePerDay: number; category: string; transmission: string;
  fuelType: string; seats: number; doors: number; features: string;
  rating: number; reviewCount: number; color: string; description: string;
  imageUrl: string; isFeatured: boolean; isAvailable: boolean;
  horsePower: number; topSpeed: number; zeroToHundred: number;
  createdAt: string; updatedAt: string;
}

export interface User {
  id: string; email: string; name: string; phone?: string | null;
  role: string; createdAt: string;
  _count?: { bookings: number; reviews: number };
  totalSpent?: number;
}

export interface Booking {
  id: string; userId: string; carId: string;
  pickupDate: string; returnDate: string;
  pickupLocation: string; returnLocation: string;
  daysCount: number; pricePerDay: number; subtotal: number;
  insuranceFee: number; serviceFee: number; total: number;
  status: string; bookingCode: string; extras: string;
  paymentMethod: string | null; paymentStatus: string;
  createdAt: string;
  car?: Car;
  user?: { id: string; name: string; email: string; phone?: string | null };
}

export interface Review {
  id: string; userId: string; carId: string;
  rating: number; comment: string; tripType: string | null;
  helpfulCount: number; createdAt: string;
  user?: { id: string; name: string };
  car?: { id: string; brand: string; model: string };
}

export interface Deal {
  id: string; title: string; description: string;
  discountLabel: string; discountPercent: number;
  carId: string | null; promoCode: string;
  endDate: string; isActive: boolean;
  car?: Car | null;
}
