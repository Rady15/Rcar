export type Language = 'ar' | 'en';

export type UserRole = 'admin' | 'staff' | 'user';

export type PageId =
  | 'login'
  | 'home'
  | 'fleet'
  | 'branches'
  | 'offers'
  | 'corporate'
  | 'subscription'
  | 'used-cars'
  | 'loyalty'
  | 'manage-booking'
  | 'about'
  | 'faq'
  | 'contact'
  | 'blog'
  | 'dashboard';

export type CarCategory =
  | 'all'
  | 'economy'
  | 'compact'
  | 'sedan'
  | 'suv'
  | 'luxury'
  | 'family'
  | 'commercial'
  | 'electric'
  | string;

export interface Category {
  id: string;
  slug: string;
  name: { ar: string; en: string };
  description?: { ar: string; en: string };
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
  carsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CarStatus = 'available' | 'rented' | 'maintenance' | 'reserved';

export interface Car {
  id: string;
  name: { ar: string; en: string };
  brand: string;
  modelYear: number;
  category: CarCategory;
  image: string;
  dailyPrice: number; // SAR
  weeklyPrice: number;
  monthlyPrice: number;
  seats: number;
  luggage: number;
  doors: number;
  transmission: 'auto' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  engineCapacity: string;
  features: { ar: string[]; en: string[] };
  isPopular?: boolean;
  isSpecialOffer?: boolean;
  discountPercentage?: number;
  availableQuantity: number;
  minDriverAge: number;
  depositRequired: number; // SAR
  includedMileagePerDay: number; // km
  plateNumber?: string;
  status?: CarStatus;
  currentBranchId?: string;
  currentOdometer?: number;
}

export interface Branch {
  id: string;
  city: { ar: string; en: string };
  name: { ar: string; en: string };
  type: 'airport' | 'downtown' | 'express';
  terminal?: string;
  address: { ar: string; en: string };
  phone: string;
  workingHours: { ar: string; en: string };
  is24Hours: boolean;
  hasSelfServiceKiosk?: boolean;
  hasVipLounge: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  googleMapUrl: string;
}

export interface Offer {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  discount: string;
  code: string;
  badge: { ar: string; en: string };
  validUntil: string;
  category: 'daily' | 'monthly' | 'weekend' | 'airport' | 'partner';
  image: string;
  applicableCategories?: CarCategory[];
  usageCount?: number;
  isActive?: boolean;
}

export interface ProtectionPlan {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  pricePerDay: number; // SAR
  deductible: number; // SAR (0 for full super)
  features: { ar: string[]; en: string[] };
  recommended?: boolean;
}

export interface AddonOption {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  pricePerDay: number; // SAR
  icon: string;
  maxQuantity?: number;
}

export interface SearchCriteria {
  pickupCity: string;
  pickupBranchId: string;
  returnToDifferentLocation: boolean;
  returnCity: string;
  returnBranchId: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  promoCode: string;
  selectedCategory: CarCategory;
}

export interface BookingDetails {
  bookingId: string;
  createdAt: string;
  userId?: string;
  car: Car;
  searchCriteria: SearchCriteria;
  pickupBranch: Branch;
  returnBranch: Branch;
  numberOfDays: number;
  protectionPlan: ProtectionPlan;
  selectedAddons: { [addonId: string]: number };
  customer: {
    fullName: string;
    idType: 'national_id' | 'iqama' | 'gcc_id' | 'passport';
    idNumber: string;
    birthDate: string;
    phone: string;
    email: string;
    driverLicenseNumber: string;
    nationality: string;
  };
  payment: {
    method: 'mada' | 'visa_mastercard' | 'pay_on_arrival';
    baseAmount: number;
    protectionAmount: number;
    addonsAmount: number;
    intercityFee: number;
    vatAmount: number; // 15%
    discountAmount: number;
    totalAmount: number;
    isPaid: boolean;
    providerReference?: string;
  };
  status: 'pending_payment' | 'payment_unknown' | 'confirmed' | 'active' | 'return_pending' | 'completed' | 'no_show' | 'cancelled';
  tammAuthorized?: boolean;
  tammAuthorizationNumber?: string;
  pickupInspected?: boolean;
  returnInspected?: boolean;
}

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  idNumber: string;
  idType: 'national_id' | 'iqama' | 'gcc_id' | 'passport';
  nationality: string;
  licenseNumber: string;
  birthDate?: string;
  loyaltyTier: 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  avatar?: string;
  isActive: boolean;
  branchId?: string;
  createdAt: string;
  totalRentalsCount: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  content: { ar: string; en: string };
  category: 'guides' | 'tourism' | 'fleet_tech' | 'vision2030' | 'maintenance';
  coverImage: string;
  author: {
    name: { ar: string; en: string };
    role: { ar: string; en: string };
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  likes: number;
  views: number;
  isFeatured?: boolean;
  isPublished: boolean;
  tags: string[];
}

export interface RoadsideTicket {
  id: string;
  ticketNumber: string;
  callerName: string;
  callerPhone: string;
  carModel: string;
  plateNumber: string;
  issueType: 'flat_tyre' | 'battery' | 'towing' | 'fuel' | 'accident' | 'lockout';
  city: string;
  locationDescription: string;
  coordinates?: { lat: number; lng: number };
  status: 'pending' | 'dispatched' | 'in_progress' | 'resolved' | 'cancelled';
  priority: 'normal' | 'high' | 'critical';
  assignedUnit?: string;
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface InspectionReport {
  id: string;
  bookingId: string;
  carId: string;
  carName: string;
  plateNumber: string;
  type: 'pickup' | 'return';
  inspectorName: string;
  date: string;
  odometer: number;
  fuelLevel: '1/4' | '2/4' | '3/4' | '4/4' | 'full';
  cleanliness: 'clean' | 'fair' | 'dirty';
  tiresCondition: 'good' | 'fair' | 'damaged';
  acWorking: boolean;
  spareTirePresent: boolean;
  scratchesOrDents: string[];
  signatureUrl?: string;
  notes: string;
}

export interface CorporateInquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  fleetSize: string;
  rentalDuration: string;
  city: string;
  notes: string;
  status: 'new' | 'in_review' | 'proposal_sent' | 'contract_signed' | 'rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'auth' | 'fleet' | 'booking' | 'finance' | 'staff' | 'blog' | 'settings';
  details: string;
}

export interface UsedCar {
  id: string;
  name: { ar: string; en: string };
  brand: string;
  year: number;
  modelYear: number;
  mileage: number; // km
  price: number; // SAR
  city: { ar: string; en: string };
  monthlyInstallment: number;
  inspectionPassed: boolean;
  warrantyMonths: number;
  warranty: { ar: string; en: string };
  image: string;
  specs: { ar: string[]; en: string[] };
  category: string;
}

export interface LoyaltyTier {
  id: 'silver' | 'gold' | 'platinum';
  name: { ar: string; en: string };
  minRentals: number;
  qualifyingRentals: { ar: string; en: string };
  discountPercentage: number;
  color: string;
  benefits: { ar: string[]; en: string[] };
  perks: { ar: string[]; en: string[] };
  multiplier: number;
}

export interface SubscriptionPackage {
  id: string;
  tier: { ar: string; en: string };
  monthlyPrice: number; // SAR
  sampleCars: { ar: string[]; en: string[] };
  includedKmPerMonth: number;
  image: string;
  features: { ar: string[]; en: string[] };
}

export interface FAQItem {
  id: string;
  category: 'booking' | 'insurance' | 'payments' | 'requirements' | 'traffic' | 'general';
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}
