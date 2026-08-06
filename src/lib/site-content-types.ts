export interface HeroContent {
  badge: string; title: string; highlightedWord: string; italicWord: string;
  subtitle: string; primaryBtn: string; secondaryBtn: string;
  imageUrl: string; scrollHint: string; showBadges: boolean;
  signInLabel: string; adminLabel: string;
}

export interface StatItem {
  icon: "car" | "calendar" | "star" | "shield" | "users" | "zap" | "award";
  value: string; label: string;
}

export interface HowItWorksStep {
  step: string; title: string; desc: string;
  icon: "search" | "calendar" | "shield" | "zap" | "car" | "users";
}

export interface Testimonial {
  name: string; role: string; rating: number;
  text: string; initials: string;
}

export interface FinalCtaContent {
  title: string; subtitle: string;
  primaryBtn: string; secondaryBtn: string; adminLabel: string;
}

export interface FooterContent {
  tagline: string; phone: string; email: string;
  address: string; copyright: string;
}

export interface Branding {
  siteName: string; logoEmoji: string; logoUrl: string; accentColor: string;
}

export interface SeoContent {
  title: string; description: string; keywords: string;
  ogImageUrl: string; twitterHandle: string;
}

export interface SiteContent {
  hero: HeroContent;
  stats: StatItem[];
  howItWorks: HowItWorksStep[];
  testimonials: Testimonial[];
  finalCta: FinalCtaContent;
  footer: FooterContent;
  branding: Branding;
  seo: SeoContent;
  updatedAt: string;
}

export const ICON_OPTIONS_STAT = [
  { value: "car", label: "Car" },
  { value: "calendar", label: "Calendar" },
  { value: "star", label: "Star" },
  { value: "shield", label: "Shield" },
  { value: "users", label: "Users" },
  { value: "zap", label: "Zap" },
  { value: "award", label: "Award" },
] as const;

export const ICON_OPTIONS_HOW = [
  { value: "search", label: "Search" },
  { value: "calendar", label: "Calendar" },
  { value: "shield", label: "Shield" },
  { value: "zap", label: "Zap" },
  { value: "car", label: "Car" },
  { value: "users", label: "Users" },
] as const;
