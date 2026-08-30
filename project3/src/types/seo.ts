export interface GlobalSeoSettings {
  siteName: { ar: string; en: string };
  defaultTitle: { ar: string; en: string };
  titleSeparator: string;
  metaDescription: { ar: string; en: string };
  canonicalBaseUrl: string;
  defaultKeywords: { ar: string[]; en: string[] };
  ogImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterSite: string;
  robotsIndexing: 'index, follow' | 'noindex, nofollow' | 'index, nofollow';
  googleSiteVerification: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  geoRegion: string;
  geoPlacename: string;
  geoPosition: string;
  icbm: string;
}

export interface PageSeoConfig {
  id: string;
  name: { ar: string; en: string };
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  keywords: { ar: string[]; en: string[] };
  canonicalSlug: string;
  priority: number;
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  schemaType: 'AutoRental' | 'LocalBusiness' | 'Product' | 'FAQPage' | 'Organization' | 'Article';
  isIndexed: boolean;
  ogImage?: string;
}

export interface SchemaConfig {
  enableAutoRentalSchema: boolean;
  enableFaqSchema: boolean;
  enableBreadcrumbSchema: boolean;
  enableCarProductsSchema: boolean;
  companyLegalName: { ar: string; en: string };
  telephone: string;
  email: string;
  priceRange: string;
  currenciesAccepted: string;
  paymentAccepted: string;
  ratingValue: number;
  reviewCount: number;
  streetAddress: { ar: string; en: string };
  addressLocality: { ar: string; en: string };
  postalCode: string;
  addressCountry: string;
}

export interface RobotsConfig {
  customRobotsTxt: string;
  disallowAdmin: boolean;
  disallowApi: boolean;
  crawlDelay: number;
  sitemapUrl: string;
}

export interface KeywordRankItem {
  id: string;
  keyword: string;
  city: string;
  monthlyVolume: number;
  currentRank: number;
  previousRank: number;
  serpFeatures: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  targetUrl: string;
}

export interface SeoAuditIssue {
  id: string;
  type: 'success' | 'warning' | 'error';
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  recommendation: { ar: string; en: string };
}
