import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Language,
  PageId,
  UserRole,
  Car,
  Branch,
  SearchCriteria,
  BookingDetails,
  ProtectionPlan,
  AppUser,
  BlogPost,
  RoadsideTicket,
  InspectionReport,
  CorporateInquiry,
  SystemAuditLog,
  Offer,
  ContactMessage,
  UsedCar, AddonOption, LoyaltyTier, SubscriptionPackage, FAQItem, Category
} from '../types';
import {
  GlobalSeoSettings,
  PageSeoConfig,
  SchemaConfig,
  RobotsConfig,
  KeywordRankItem
} from '../types/seo';
import { translations } from '../data/translations';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

const EMPTY_GLOBAL_SEO: GlobalSeoSettings = {
  siteName: { ar: '', en: '' }, defaultTitle: { ar: '', en: '' }, titleSeparator: '|',
  metaDescription: { ar: '', en: '' }, canonicalBaseUrl: '', defaultKeywords: { ar: [], en: [] },
  ogImage: '', twitterCard: 'summary_large_image', twitterSite: '', robotsIndexing: 'noindex, nofollow',
  googleSiteVerification: '', googleAnalyticsId: '', googleTagManagerId: '', geoRegion: '', geoPlacename: '', geoPosition: '', icbm: ''
};
const EMPTY_SCHEMA_CONFIG: SchemaConfig = {
  enableAutoRentalSchema: false, enableFaqSchema: false, enableBreadcrumbSchema: false, enableCarProductsSchema: false,
  companyLegalName: { ar: '', en: '' }, telephone: '', email: '', priceRange: '', currenciesAccepted: '', paymentAccepted: '',
  ratingValue: 0, reviewCount: 0, streetAddress: { ar: '', en: '' }, addressLocality: { ar: '', en: '' }, postalCode: '', addressCountry: ''
};
const EMPTY_ROBOTS_CONFIG: RobotsConfig = { customRobotsTxt: '', disallowAdmin: true, disallowApi: true, crawlDelay: 1, sitemapUrl: '' };

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ar'];
  currentPage: PageId;
  navigateTo: (page: PageId) => void;

  // Role Management
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: AppUser;
  authUser: AppUser | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  updateCurrentUser: (user: AppUser) => void;

  // Search Criteria
  searchCriteria: SearchCriteria;
  updateSearchCriteria: (criteria: Partial<SearchCriteria>) => void;

  // Active Car for modal / booking
  selectedCarForModal: Car | null;
  openCarModal: (car: Car) => void;
  closeCarModal: () => void;

  // Booking Wizard
  isBookingWizardOpen: boolean;
  bookingCar: Car | null;
  startBooking: (car: Car) => void;
  closeBookingWizard: () => void;

  // Fleet Management
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (id: string, updates: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  toggleCarStatus: (id: string, status?: Car['status']) => void;

  // Branches
  branches: Branch[];
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (id: string, updates: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  // Bookings Hub
  userBookings: BookingDetails[];
  saveBooking: (booking: BookingDetails) => Promise<BookingDetails>;
  refreshUserBookings: () => Promise<BookingDetails[]>;
  updateBookingStatus: (bookingId: string, status: BookingDetails['status']) => void;
  issueTammAuthorization: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => boolean;
  deleteBooking: (bookingId: string) => void;
  restoreBooking: (bookingId: string) => void;
  lookupBooking: (bookingId: string, idNumberOrPhone?: string) => BookingDetails | null;

  // Blog System
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'views' | 'likes'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  likeBlogPost: (id: string) => void;

  // Users & Staff
  usersList: AppUser[];
  addUser: (user: Omit<AppUser, 'id' | 'createdAt' | 'totalRentalsCount'>) => void;
  updateUser: (id: string, updates: Partial<AppUser>) => void;
  toggleUserStatus: (id: string) => void;

  // Roadside Emergency Dispatch
  roadsideTickets: RoadsideTicket[];
  addRoadsideTicket: (ticket: Omit<RoadsideTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => void;
  updateRoadsideTicketStatus: (id: string, status: RoadsideTicket['status'], assignedUnit?: string) => void;

  // Vehicle Inspection
  inspectionReports: InspectionReport[];
  addInspectionReport: (report: Omit<InspectionReport, 'id' | 'date'>) => void;

  // Corporate Inquiries
  corporateInquiries: CorporateInquiry[];
  addCorporateInquiry: (inquiry: Omit<CorporateInquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateCorporateStatus: (id: string, status: CorporateInquiry['status']) => void;

  // Contact Messages
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<ContactMessage>;
  updateContactStatus: (id: string, status: ContactMessage['status']) => void;
  deleteContactMessage: (id: string) => void;

  // System Audit Logs
  auditLogs: SystemAuditLog[];
  addAuditLog: (actor: string, action: string, category: SystemAuditLog['category'], details: string) => void;

  // SEO & Search Engine Management
  globalSeo: GlobalSeoSettings;
  updateGlobalSeo: (updates: Partial<GlobalSeoSettings>) => void;
  pageSeoConfigs: PageSeoConfig[];
  updatePageSeo: (pageId: string, updates: Partial<PageSeoConfig>) => void;
  schemaConfig: SchemaConfig;
  updateSchemaConfig: (updates: Partial<SchemaConfig>) => void;
  robotsConfig: RobotsConfig;
  updateRobotsConfig: (updates: Partial<RobotsConfig>) => void;
  keywordRankings: KeywordRankItem[];
  seoReady: boolean;
  addKeywordRankItem: (item: Omit<KeywordRankItem, 'id'>) => void;
  deleteKeywordRankItem: (id: string) => void;
  generateSitemapXml: () => string;

  // Offers & Promo Codes
  offers: Offer[];
  usedCars: UsedCar[];
  loyaltyTiers: LoyaltyTier[];
  subscriptions: SubscriptionPackage[];
  faqs: FAQItem[];
  protectionPlans: ProtectionPlan[];
  addonOptions: AddonOption[];
  saveContentItem: (type: 'offers'|'used-cars'|'loyalty'|'subscriptions'|'faq'|'protection-plans'|'addons', item: any) => Promise<any>;
  deleteContentItem: (type: 'offers'|'used-cars'|'loyalty'|'subscriptions'|'faq'|'protection-plans'|'addons', id: string) => Promise<void>;
  paymentSettings: {provider:string;enabled:boolean;environment:'test'|'live';apiUrl:string;publicKey:string;hasApiKey:boolean;hasWebhookSecret:boolean};
  updatePaymentSettings: (settings:any) => Promise<void>;
  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category,'id'|'createdAt'|'updatedAt'>) => Promise<Category>;
  updateCategory: (id:string, patch: Partial<Category>) => Promise<Category>;
  deleteCategory: (id:string) => Promise<void>;
  refreshAuth: () => Promise<void>;
  appliedPromoCode: string;
  applyPromoCode: (code: string) => boolean;

  // Modals & Tools
  isRoadsideModalOpen: boolean;
  openRoadsideModal: () => void;
  closeRoadsideModal: () => void;

  isChatOpen: boolean;
  toggleChat: () => void;

  // Toast notifications
  toasts: ToastMessage[];
  showToast: (
    typeOrTitle: 'success' | 'info' | 'error' | string,
    titleOrType?: string,
    message?: string
  ) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getDefaultDates = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 3);

  const format = (d: Date) => d.toISOString().split('T')[0];
  return {
    pickupDate: format(today),
    returnDate: format(tomorrow)
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [currentPage, setCurrentPage] = useState<PageId>(() => { const p = window.location.pathname.replace(/^\//,'').replace(/\/$/,'') as PageId; return p || 'home'; });
  const [authUser, setAuthUser] = useState<AppUser | null>(null);
  const activeRole: UserRole = authUser?.role || 'user';
  const setActiveRole = (_role: UserRole) => { /* Role is server-authoritative; kept only for backwards-compatible context consumers. */ };
  const [authLoading, setAuthLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');

  const defaultDates = getDefaultDates();

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    pickupCity: 'Riyadh',
    pickupBranchId: 'ruh-t1-2',
    returnToDifferentLocation: false,
    returnCity: 'Riyadh',
    returnBranchId: 'ruh-t1-2',
    pickupDate: defaultDates.pickupDate,
    pickupTime: '10:00',
    returnDate: defaultDates.returnDate,
    returnTime: '10:00',
    promoCode: '',
    selectedCategory: 'all'
  });

  const [selectedCarForModal, setSelectedCarForModal] = useState<Car | null>(null);
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState<boolean>(false);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [isRoadsideModalOpen, setIsRoadsideModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Reactive Cars
  const [cars, setCars] = useState<Car[]>([]);

  // Reactive Branches
  const [branches, setBranches] = useState<Branch[]>([]);

  // Reactive Blog Posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Reactive Users
  const [usersList, setUsersList] = useState<AppUser[]>([]);

  // Current logged in user based on role
  const currentUser = authUser || ({ id: 'anonymous', fullName: language === 'ar' ? 'زائر' : 'Guest', email: '', phone: '', role: 'user', idType: 'national_id', idNumber: '', nationality: '', licenseNumber: '', loyaltyTier: 'silver', loyaltyPoints: 0, avatar: '', isActive: true, totalRentalsCount: 0, createdAt: new Date().toISOString().slice(0,10) } as AppUser);
  const isAuthenticated = Boolean(authUser);

  // Bookings list
  const [userBookings, setUserBookings] = useState<BookingDetails[]>([]);
  // Roadside Tickets
  const [roadsideTickets, setRoadsideTickets] = useState<RoadsideTicket[]>([]);

  // Inspection Reports
  const [inspectionReports, setInspectionReports] = useState<InspectionReport[]>([]);

  // Corporate Inquiries
  const [corporateInquiries, setCorporateInquiries] = useState<CorporateInquiry[]>([]);

  // Contact Messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // System Audit Logs
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [usedCars, setUsedCars] = useState<UsedCar[]>([]);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionPackage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [protectionPlans, setProtectionPlans] = useState<ProtectionPlan[]>([]);
  const [addonOptions, setAddonOptions] = useState<AddonOption[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentSettings, setPaymentSettings] = useState({provider:'generic',enabled:false,environment:'test' as 'test'|'live',apiUrl:'',publicKey:'',hasApiKey:false,hasWebhookSecret:false});

  const refreshAuth = async () => {
    try {
      const {user} = await apiGet<{user: AppUser}>('/api/auth/me');
      setAuthUser(user);
    } catch { setAuthUser(null); }
  };
  useEffect(() => {
    let mounted = true;
    let timedOut = false;
    const t = setTimeout(()=>{ if(mounted && !timedOut){ timedOut=true; setAuthLoading(false);} }, 8000);
    apiGet<{user: AppUser}>('/api/auth/me').then(({user}) => {
      if (!mounted || timedOut) return;
      setAuthUser(user);
    }).catch(() => { if(mounted) setAuthUser(null); }).finally(() => { if (mounted && !timedOut){ clearTimeout(t); setAuthLoading(false);} });
    return () => { mounted = false; clearTimeout(t); };
  }, []);

  // Production API hydration. Server responses are authoritative; empty arrays are valid state and never fall back to mock data.
  useEffect(() => {
    let mounted = true;
    const privileged = Boolean(authUser && ['admin','staff'].includes(authUser.role));
    if (!authUser) {
      setUserBookings([]); setUsersList([]); setAuditLogs([]); setRoadsideTickets([]); setInspectionReports([]); setCorporateInquiries([]); setContactMessages([]);
    } else if (!privileged) {
      setUsersList([]); setAuditLogs([]); setRoadsideTickets([]); setInspectionReports([]); setCorporateInquiries([]); setContactMessages([]);
    }
    Promise.allSettled([apiGet<Car[]>('/api/cars'), apiGet<Branch[]>('/api/branches'), apiGet<BlogPost[]>('/api/blog'), apiGet<Category[]>('/api/categories'), apiGet<Offer[]>('/api/content/offers'), apiGet<UsedCar[]>('/api/content/used-cars'), apiGet<LoyaltyTier[]>('/api/content/loyalty'), apiGet<SubscriptionPackage[]>('/api/content/subscriptions'), apiGet<FAQItem[]>('/api/content/faq'), apiGet<ProtectionPlan[]>('/api/content/protection-plans'), apiGet<AddonOption[]>('/api/content/addons'), ...(authUser ? [apiGet<BookingDetails[]>('/api/bookings/my')] : []), ...(authUser && ['admin','staff'].includes(authUser.role) ? [apiGet<BookingDetails[]>('/api/bookings'), apiGet<RoadsideTicket[]>('/api/roadside'), apiGet<InspectionReport[]>('/api/inspections'), apiGet<CorporateInquiry[]>('/api/corporate'), apiGet<ContactMessage[]>('/api/contact'), apiGet<AppUser[]>('/api/users'), apiGet<SystemAuditLog[]>('/api/logs')] : [])]).then(results => {
      if (!mounted) return;
      const [c,b,bl,cats,o,uc,lt,sp,fq,pp,ao,...privateResults] = results;
      if(c?.status==='fulfilled') setCars(c.value as Car[]);
      if(b?.status==='fulfilled') setBranches(b.value as Branch[]);
      if(bl?.status==='fulfilled') setBlogPosts(bl.value as BlogPost[]);
      if((cats as any)?.status==='fulfilled') setCategories((cats as any).value as Category[]);
      if(o?.status==='fulfilled') setOffers(o.value as Offer[]);
      if(uc?.status==='fulfilled') setUsedCars(uc.value as UsedCar[]);
      if(lt?.status==='fulfilled') setLoyaltyTiers(lt.value as LoyaltyTier[]);
      if(sp?.status==='fulfilled') setSubscriptions(sp.value as SubscriptionPackage[]);
      if(fq?.status==='fulfilled') setFaqs(fq.value as FAQItem[]);
      if(pp?.status==='fulfilled') setProtectionPlans(pp.value as ProtectionPlan[]);
      if(ao?.status==='fulfilled') setAddonOptions(ao.value as AddonOption[]);
      if(authUser) {
        const [myB, ...privTail] = privateResults;
        if((myB as any)?.status==='fulfilled') setUserBookings((myB as any).value as BookingDetails[]);
        if(authUser && ['admin','staff'].includes(authUser.role)) {
          const [bo,r,i,co,cm,ul,al] = privTail;
          if(bo?.status==='fulfilled') setUserBookings(bo.value as BookingDetails[]);
          if(r?.status==='fulfilled') setRoadsideTickets(r.value as RoadsideTicket[]);
          if(i?.status==='fulfilled') setInspectionReports(i.value as InspectionReport[]);
          if(co?.status==='fulfilled') setCorporateInquiries(co.value as CorporateInquiry[]);
          if(cm?.status==='fulfilled') setContactMessages(cm.value as ContactMessage[]);
          if(ul?.status==='fulfilled') setUsersList(ul.value as AppUser[]);
          if(al?.status==='fulfilled') setAuditLogs(al.value as SystemAuditLog[]);
        }
      }
    });
    return () => { mounted = false; };
  }, [authUser]);

  useEffect(() => { if (!authUser || authUser.role !== 'admin') { setPaymentSettings({provider:'generic',enabled:false,environment:'test',apiUrl:'',publicKey:'',hasApiKey:false,hasWebhookSecret:false}); return; } apiGet<any>('/api/settings/payments').then(setPaymentSettings).catch(() => {}); }, [authUser]);

  const saveContentItem = async (type: 'offers'|'used-cars'|'loyalty'|'subscriptions'|'faq'|'protection-plans'|'addons', item: any) => {
    const saved = item.id ? await apiPut<any>(`/api/content/${type}/${item.id}`, item) : await apiPost<any>(`/api/content/${type}`, item);
    const setters:any = {offers:setOffers,'used-cars':setUsedCars,loyalty:setLoyaltyTiers,subscriptions:setSubscriptions,faq:setFaqs,'protection-plans':setProtectionPlans,addons:setAddonOptions};
    setters[type]((prev:any[]) => item.id ? prev.map(x=>x.id===item.id?saved:x) : [saved,...prev]);
    return saved;
  };
  const deleteContentItem = async (type: 'offers'|'used-cars'|'loyalty'|'subscriptions'|'faq'|'protection-plans'|'addons', itemId: string) => {
    await apiDelete(`/api/content/${type}/${itemId}`);
    const setters:any = {offers:setOffers,'used-cars':setUsedCars,loyalty:setLoyaltyTiers,subscriptions:setSubscriptions,faq:setFaqs,'protection-plans':setProtectionPlans,addons:setAddonOptions};
    setters[type]((prev:any[]) => prev.filter(x=>x.id!==itemId));
  };
  const updatePaymentSettings = async (settings:any) => { const saved=await apiPut<any>('/api/settings/payments',settings); setPaymentSettings(saved); };
  const addCategory = async (cat: Omit<Category,'id'|'createdAt'|'updatedAt'>) => {
    const saved = await apiPost<Category>('/api/categories', cat);
    setCategories(prev=>[saved,...prev]);
    showToast('success', language==='ar'?'تمت إضافة الفئة':'Category added', saved.name[language]);
    return saved;
  };
  const updateCategory = async (id:string, patch: Partial<Category>) => {
    const saved = await apiPut<Category>(`/api/categories/${id}`, patch);
    setCategories(prev=>prev.map(c=>c.id===id?saved:c));
    showToast('success', language==='ar'?'تم تحديث الفئة':'Category updated', saved.name[language]);
    return saved;
  };
  const deleteCategory = async (id:string) => {
    await apiDelete(`/api/categories/${id}`);
    setCategories(prev=>prev.filter(c=>c.id!==id));
    showToast('info', language==='ar'?'تم حذف الفئة':'Category deleted', '');
  };

  // SEO & Search Engine Management States
  const [globalSeo, setGlobalSeo] = useState<GlobalSeoSettings>(EMPTY_GLOBAL_SEO);
  const [pageSeoConfigs, setPageSeoConfigs] = useState<PageSeoConfig[]>([]);
  const [schemaConfig, setSchemaConfig] = useState<SchemaConfig>(EMPTY_SCHEMA_CONFIG);
  const [robotsConfig, setRobotsConfig] = useState<RobotsConfig>(EMPTY_ROBOTS_CONFIG);
  const [keywordRankings, setKeywordRankings] = useState<KeywordRankItem[]>([]);
  const [seoReady, setSeoReady] = useState(false);

  useEffect(() => {
    let active = true;
    setSeoReady(false);
    apiGet<any[]>('/api/content/seo').then(rows => {
      if (!active) return;
      const map:any={}; rows.forEach((x:any)=>map[x.key]=x.value);
      if (map.global) setGlobalSeo(map.global);
      if (Array.isArray(map.pages)) setPageSeoConfigs(map.pages);
      if (map.schema) setSchemaConfig(map.schema);
      if (map.robots) setRobotsConfig(map.robots);
      if (Array.isArray(map.keywords)) setKeywordRankings(map.keywords);
      setSeoReady(Boolean(map.global && Array.isArray(map.pages)));
    }).catch(() => {
      if (!active) return;
      setGlobalSeo(EMPTY_GLOBAL_SEO); setPageSeoConfigs([]); setSchemaConfig(EMPTY_SCHEMA_CONFIG); setRobotsConfig(EMPTY_ROBOTS_CONFIG); setKeywordRankings([]); setSeoReady(false);
    });
    return () => { active = false; };
  }, [authUser]);

  const updateGlobalSeo = (updates: Partial<GlobalSeoSettings>) => {
    setGlobalSeo((prev) => { const next={...prev,...updates}; void apiPut('/api/content/seo/global', {key:'global',value:next,id:'global'}).catch(()=>{}); return next; });
    addAuditLog('Admin', 'تحديث إعدادات السيو العامة', 'settings', 'تم تعديل العناوين، الأوصاف أو الكلمات المفتاحية لموقع جوجل.');
    showToast('success', language === 'ar' ? 'تم حفظ إعدادات السيو' : 'SEO Settings Saved', language === 'ar' ? 'تم تحديث وسوم Meta وعناكب البحث بنجاح' : 'Meta tags and search crawler directives updated.');
  };

  const updatePageSeo = (pageId: string, updates: Partial<PageSeoConfig>) => {
    setPageSeoConfigs((prev) => { const next=prev.map((p) => (p.id === pageId ? { ...p, ...updates } : p)); void apiPut('/api/content/seo/pages', {key:'pages',value:next,id:'pages'}).catch(()=>{}); return next; });
    addAuditLog('Admin', `تعديل سيو صفحة (${pageId})`, 'settings', 'تحديث عنوان الصفحة ووصف Meta ومعلمات خريطة الموقع.');
    showToast('success', language === 'ar' ? 'تم حفظ سيو الصفحة' : 'Page SEO Saved', language === 'ar' ? `تم تحديث وسوم صفحة ${pageId} بنجاح` : `SEO tags for ${pageId} updated.`);
  };

  const updateSchemaConfig = (updates: Partial<SchemaConfig>) => {
    setSchemaConfig((prev) => { const next={...prev,...updates}; void apiPut('/api/content/seo/schema', {key:'schema',value:next,id:'schema'}).catch(()=>{}); return next; });
    addAuditLog('Admin', 'تحديث بيانات Schema.org المنظمة', 'settings', 'تحديث بطاقات النشاط التجاري المحلي وتقييمات جوجل.');
    showToast('success', language === 'ar' ? 'تم حفظ بيانات Schema.org' : 'Schema Saved', language === 'ar' ? 'تم تحديث الترميز الهيكلي ومقتطفات جوجل الغنية' : 'Structured data markup updated successfully.');
  };

  const updateRobotsConfig = (updates: Partial<RobotsConfig>) => {
    setRobotsConfig((prev) => { const next={...prev,...updates}; void apiPut('/api/content/seo/robots', {key:'robots',value:next,id:'robots'}).catch(()=>{}); return next; });
    addAuditLog('Admin', 'تحديث ملف Robots.txt', 'settings', 'تعديل توجيهات عناكب البحث وأوامر الحظر والزحف.');
    showToast('success', language === 'ar' ? 'تم حفظ ملف Robots.txt' : 'Robots.txt Saved', language === 'ar' ? 'تم تحديث أوامر الزحف والفهرسة' : 'Crawler rules updated.');
  };

  const addKeywordRankItem = (item: Omit<KeywordRankItem, 'id'>) => {
    const newItem: KeywordRankItem = {
      ...item,
      id: `kw-${Date.now()}`
    };
    setKeywordRankings((prev) => { const next=[newItem,...prev]; void apiPut('/api/content/seo/keywords', {key:'keywords',value:next,id:'keywords'}).catch(()=>{}); return next; });
    showToast('success', language === 'ar' ? 'تمت إضافة الكلمة المفتاحية' : 'Keyword Added', item.keyword);
  };

  const deleteKeywordRankItem = (id: string) => {
    setKeywordRankings((prev) => { const next=prev.filter((k) => k.id !== id); void apiPut('/api/content/seo/keywords', {key:'keywords',value:next,id:'keywords'}).catch(()=>{}); return next; });
    showToast('info', language === 'ar' ? 'تم حذف الكلمة' : 'Keyword Removed', 'تمت إزالة الكلمة من جدول التتبع.');
  };

  const generateSitemapXml = (): string => {
    const urls = pageSeoConfigs
      .filter((p) => p.isIndexed)
      .map(
        (p) => `  <url>
    <loc>${globalSeo.canonicalBaseUrl}${p.canonicalSlug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${p.changeFreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
  };


  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    const path = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== path) window.history.pushState({ page }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPop = () => { const p = window.location.pathname.replace(/^\//,'').replace(/\/$/,'') as PageId; setCurrentPage((p || 'home') as PageId); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const updateSearchCriteria = (criteria: Partial<SearchCriteria>) => {
    setSearchCriteria((prev) => ({ ...prev, ...criteria }));
  };

  const openCarModal = (car: Car) => setSelectedCarForModal(car);
  const closeCarModal = () => setSelectedCarForModal(null);

  const startBooking = (car: Car) => {
    setBookingCar(car);
    setSelectedCarForModal(null);
    setIsBookingWizardOpen(true);
  };

  const closeBookingWizard = () => {
    setIsBookingWizardOpen(false);
    setBookingCar(null);
  };

  // Fleet Actions
  const addCar = (newCarData: Omit<Car, 'id'>) => {
    const id = `car-${Date.now()}`;
    const newCar: Car = { ...newCarData, id };
    setCars((prev) => [newCar, ...prev]);
    void apiPost<Car>('/api/cars', newCar).then(saved => setCars(prev => prev.map(c => c.id === newCar.id ? saved : c))).catch(err => showToast('error', 'API Error', err.message));
    addAuditLog('Admin', `إضافة سيارة: ${newCar.name.ar}`, 'fleet', `تمت إضافة سيارة جديدة ${newCar.brand} ${newCar.modelYear}`);
    showToast('success', language === 'ar' ? 'تمت إضافة السيارة' : 'Car Added', language === 'ar' ? `تمت إضافة ${newCar.name.ar} للأسطول.` : `${newCar.name.en} added to fleet.`);
  };

  const updateCar = (id: string, updates: Partial<Car>) => {
    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    const next = cars.find(c => c.id === id);
    if (next) void apiPut<Car>(`/api/cars/${id}`, { ...next, ...updates }).then(saved => setCars(prev => prev.map(c => c.id === id ? saved : c))).catch(err => showToast('error','API Error',err.message));
    addAuditLog('Admin', `تعديل سيارة #${id}`, 'fleet', 'تم تحديث بيانات المركبة');
    showToast('success', language === 'ar' ? 'تم التحديث' : 'Car Updated', language === 'ar' ? 'تم حفظ التعديلات بنجاح.' : 'Vehicle details updated successfully.');
  };

  const deleteCar = (id: string) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
    void apiDelete(`/api/cars/${id}`).catch(err => { showToast('error','API Error',err.message); void apiGet<Car[]>('/api/cars').then(setCars).catch(()=>{}); });
    addAuditLog('Admin', `حذف سيارة #${id}`, 'fleet', 'تم إخراج المركبة من الأسطول النشط');
  };

  const toggleCarStatus = (id: string, status?: Car['status']) => {
    const target=cars.find(c=>c.id===id); if(!target) return;
    const nextStatus=status || (target.status==='available' ? 'maintenance' : 'available');
    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)));
    void apiPut<Car>(`/api/cars/${id}`, { ...target, status: nextStatus }).then(saved=>setCars(prev=>prev.map(c=>c.id===id?saved:c))).catch(err=>{showToast('error','API Error',err.message);void apiGet<Car[]>('/api/cars').then(setCars).catch(()=>{});});
  };

  // Branch Actions
  const addBranch = (newBranchData: Omit<Branch, 'id'>) => {
    const id = `branch-${Date.now()}`;
    const newBranch: Branch = { ...newBranchData, id };
    setBranches((prev) => [...prev, newBranch]);
    void apiPost<Branch>('/api/branches', newBranch).then(saved => setBranches(prev => prev.map(b => b.id === newBranch.id ? saved : b))).catch(err => showToast('error','API Error',err.message));
    showToast('success', 'Branch Added', 'تمت إضافة الفرع بنجاح');
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    const oldBranch = branches.find(b => b.id === id);
    if(oldBranch) void apiPut<Branch>(`/api/branches/${id}`, {...oldBranch,...updates}).catch(err=>showToast('error','API Error',err.message));
    showToast('success', 'Branch Updated', 'تم تحديث بيانات الفرع');
  };

  const deleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
    void apiDelete(`/api/branches/${id}`).catch(err=>{showToast('error','API Error',err.message);void apiGet<Branch[]>('/api/branches').then(setBranches).catch(()=>{});});
    addAuditLog('Admin', `حذف فرع #${id}`, 'fleet', 'تم حذف الفرع من الشبكة');
  };

  // Bookings Actions
  const saveBooking = async (booking: BookingDetails): Promise<BookingDetails> => {
    const saved = await apiPost<BookingDetails>('/api/bookings', booking);
    setUserBookings((prev) => [saved, ...prev.filter(b => b.bookingId !== saved.bookingId)]);
    addAuditLog('System', `حجز جديد #${saved.bookingId}`, 'booking', `حجز ${saved.car.name.ar} بقيمة ${saved.payment.totalAmount} ر.س`);
    showToast('success', language === 'ar' ? 'تم تأكيد الحجز بنجاح!' : 'Booking Confirmed!', language === 'ar' ? `رقم الحجز: ${saved.bookingId}` : `Booking Ref: ${saved.bookingId}`);
    return saved;
  };

  const refreshUserBookings = useCallback(async (): Promise<BookingDetails[]> => {
    try {
      const isPrivileged = authUser && ['admin','staff'].includes(authUser.role);
      const list = await apiGet<BookingDetails[]>(isPrivileged ? '/api/bookings' : '/api/bookings/my');
      setUserBookings(list);
      return list;
    } catch {
      return [];
    }
  }, [authUser]);

  const updateBookingStatus = (bookingId: string, status: BookingDetails['status']) => {
    setUserBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b)));
    void apiPut<BookingDetails>(`/api/bookings/${bookingId}/status`, { status }).catch(err => showToast('error','API Error',err.message));
    addAuditLog(activeRole, `تغيير حالة الحجز #${bookingId}`, 'booking', `الحالة الجديدة: ${status}`);
    showToast('info', language === 'ar' ? 'تم تعديل حالة الحجز' : 'Status Updated', `Booking status changed to ${status}`);
  };

  const issueTammAuthorization = (bookingId: string) => {
    void apiPut(`/api/bookings/${bookingId}/tamm`, {}).then(() => showToast('success', language === 'ar' ? 'تم توثيق العقد داخلياً' : 'Contract Verified Internally', bookingId)).catch(err => showToast('error', language === 'ar' ? 'تعذر التوثيق' : 'Verification failed', err.message));
  };

  const cancelBooking = (bookingId: string): boolean => {
    let found = false;
    setUserBookings((prev) =>
      prev.map((b) => {
        if (b.bookingId === bookingId) {
          found = true;
          return { ...b, status: 'cancelled' };
        }
        return b;
      })
    );
    if (found) {
      void apiPost<BookingDetails>(`/api/bookings/${bookingId}/cancel`, { secret: (userBookings.find(b => b.bookingId === bookingId)?.customer.phone || '') }).catch(err => {
        showToast('error', language === 'ar' ? 'تعذر إلغاء الحجز' : 'Cancellation failed', err.message);
        void apiGet<BookingDetails[]>(`/api/bookings`).then(setUserBookings).catch(()=>{});
      });
      addAuditLog(activeRole, `إلغاء الحجز #${bookingId}`, 'booking', 'تم طلب إلغاء الحجز من خلال النظام');
      showToast(
        'info',
        language === 'ar' ? 'تم إلغاء الحجز' : 'Booking Cancelled',
        language === 'ar' ? `تم إلغاء الحجز رقم ${bookingId} بنجاح.` : `Reservation ${bookingId} has been cancelled.`
      );
    }
    return found;
  };

  const deleteBooking = (bookingId: string) => {
    setUserBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    void apiDelete(`/api/bookings/${bookingId}`).catch(err => {
      showToast('error', 'API Error', err.message);
      void apiGet<BookingDetails[]>(`/api/bookings`).then(setUserBookings).catch(()=>{});
    });
    addAuditLog(activeRole, `حذف الحجز #${bookingId}`, 'booking', 'تم حذف الحجز نهائياً من السجلات');
  };

  const restoreBooking = (bookingId: string) => {
    setUserBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? { ...b, status: 'confirmed' } : b)));
    void apiPost<BookingDetails>(`/api/bookings/${bookingId}/reinstate`, {}).then((saved) => setUserBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? saved : b)))).catch(err => {
      showToast('error', 'API Error', err.message);
      void apiGet<BookingDetails[]>(`/api/bookings`).then(setUserBookings).catch(()=>{});
    });
    addAuditLog(activeRole, `استعادة الحجز #${bookingId}`, 'booking', 'تمت استعادة الحجز إلى الحالة المؤكدة');
  };

  const lookupBooking = (bookingId: string, idOrPhone?: string): BookingDetails | null => {
    const cleanId = bookingId.trim().toUpperCase();
    const found = userBookings.find((b) => {
      const matchId = b.bookingId.toUpperCase() === cleanId;
      if (!matchId) return false;
      if (!idOrPhone) return true;
      const cleanParam = idOrPhone.trim();
      return (
        b.customer.idNumber.includes(cleanParam) ||
        b.customer.phone.includes(cleanParam) ||
        b.customer.email.toLowerCase().includes(cleanParam.toLowerCase())
      );
    });
    return found || null;
  };

  // Blog Actions
  const addBlogPost = (newPostData: Omit<BlogPost, 'id' | 'views' | 'likes'>) => {
    const id = `post-${Date.now()}`;
    const newPost: BlogPost = {
      ...newPostData,
      id,
      views: 1,
      likes: 0
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    void apiPost<BlogPost>('/api/blog', newPost).then(saved => setBlogPosts(prev => prev.map(p => p.id === newPost.id ? saved : p))).catch(err=>showToast('error','API Error',err.message));
    addAuditLog('Admin', `نشر مقال جديد: ${newPost.title.ar}`, 'blog', 'تمت إضافة تدوينة للمدونة');
    showToast('success', language === 'ar' ? 'تم نشر المقال!' : 'Article Published!', newPost.title[language]);
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const oldPost=blogPosts.find(p=>p.id===id); if(oldPost) void apiPut<BlogPost>(`/api/blog/${id}`,{...oldPost,...updates}).catch(err=>showToast('error','API Error',err.message));
    showToast('success', language === 'ar' ? 'تم التحديث' : 'Post Updated', 'تم حفظ تعديلات المقال.');
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    void apiDelete(`/api/blog/${id}`).catch(err=>showToast('error','API Error',err.message));
    showToast('info', language === 'ar' ? 'تم الحذف' : 'Post Deleted', 'تم حذف المقال من المدونة.');
  };

  const likeBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
    void apiPost<{likes:number}>(`/api/blog/${id}/like`, {}).catch(()=>{});
  };

  // Users & Staff Actions
  const addUser = (userData: Omit<AppUser, 'id' | 'createdAt' | 'totalRentalsCount'>) => {
    const id = `usr-${Date.now()}`;
    const newUser: AppUser = {
      ...userData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      totalRentalsCount: 0
    };
    setUsersList((prev) => [newUser, ...prev]);
    void apiPost<AppUser>('/api/users', newUser).then(saved=>setUsersList(prev=>prev.map(u=>u.id===newUser.id?saved:u))).catch(err=>showToast('error','API Error',err.message));
    showToast('success', 'User Added', `تمت إضافة ${newUser.fullName}`);
  };

  const updateUser = (id: string, updates: Partial<AppUser>) => {
    setUsersList((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    const oldUser=usersList.find(u=>u.id===id); if(oldUser) void apiPut<AppUser>(`/api/users/${id}`,{...oldUser,...updates}).catch(err=>showToast('error','API Error',err.message));
    showToast('success', 'User Updated', 'تم تحديث بيانات المستخدم');
  };

  const toggleUserStatus = (id: string) => {
    const target=usersList.find(u=>u.id===id);
    if(target){ const next={...target,isActive:!target.isActive}; setUsersList((prev)=>prev.map(u=>u.id===id?next:u)); void apiPut<AppUser>(`/api/users/${id}`,next).catch(err=>showToast('error','API Error',err.message)); }
  };

  // Roadside Tickets
  const addRoadsideTicket = (ticketData: Omit<RoadsideTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => {
    const id = `sos-${Date.now()}`;
    const ticketNumber = `SOS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: RoadsideTicket = {
      ...ticketData,
      id,
      ticketNumber,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setRoadsideTickets((prev) => [newTicket, ...prev]);
    void apiPost<RoadsideTicket>('/api/roadside', newTicket).then(saved=>setRoadsideTickets(prev=>prev.map(t=>t.id===newTicket.id?saved:t))).catch(err=>showToast('error','API Error',err.message));
    addAuditLog('User SOS', `طلب مساعدة طوارئ #${ticketNumber}`, 'settings', `موقع: ${newTicket.city} - المشكلة: ${newTicket.issueType}`);
    showToast('success', language === 'ar' ? 'تم إرسال بلاغ الطوارئ!' : 'SOS Dispatched!', `Ticket: ${ticketNumber}`);
  };

  const updateRoadsideTicketStatus = (id: string, status: RoadsideTicket['status'], assignedUnit?: string) => {
    setRoadsideTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status, assignedUnit: assignedUnit || t.assignedUnit } : t)));
    void apiPut<RoadsideTicket>(`/api/roadside/${id}`, { ...(roadsideTickets.find(t=>t.id===id)||{}), status, assignedUnit }).catch(err=>showToast('error','API Error',err.message));
    showToast('info', 'SOS Updated', `Roadside ticket status: ${status}`);
  };

  // Inspection
  const addInspectionReport = (reportData: Omit<InspectionReport, 'id' | 'date'>) => {
    const id = `insp-${Date.now()}`;
    const report: InspectionReport = {
      ...reportData,
      id,
      date: new Date().toISOString()
    };
    setInspectionReports((prev) => [report, ...prev]);
    void apiPost<InspectionReport>('/api/inspections', report).catch(err=>showToast('error','API Error',err.message));
    if (report.type === 'pickup') {
      setUserBookings((prev) => prev.map((b) => (b.bookingId === report.bookingId ? { ...b, pickupInspected: true } : b)));
    } else {
      setUserBookings((prev) => prev.map((b) => (b.bookingId === report.bookingId ? { ...b, returnInspected: true, status: 'completed' } : b)));
    }
    showToast('success', language === 'ar' ? 'تم تسجيل الفحص الرقمي' : 'Digital Inspection Saved', `Booking #${report.bookingId}`);
  };

  // Corporate
  const addCorporateInquiry = (inquiryData: Omit<CorporateInquiry, 'id' | 'createdAt' | 'status'>) => {
    const id = `corp-${Date.now()}`;
    const inquiry: CorporateInquiry = {
      ...inquiryData,
      id,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCorporateInquiries((prev) => [inquiry, ...prev]);
    void apiPost<CorporateInquiry>('/api/corporate', inquiry).catch(err=>showToast('error','API Error',err.message));
    showToast('success', language === 'ar' ? 'تم استلام طلب الشركة' : 'Inquiry Submitted', inquiry.companyName);
  };

  const updateCorporateStatus = (id: string, status: CorporateInquiry['status']) => {
    setCorporateInquiries((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    const oldInquiry=corporateInquiries.find(c=>c.id===id); if(oldInquiry) void apiPut<CorporateInquiry>(`/api/corporate/${id}`,{...oldInquiry,status}).catch(err=>showToast('error','API Error',err.message));
  };

  // Contact Messages
  const addContactMessage = async (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage> => {
    const saved = await apiPost<ContactMessage>('/api/contact', msgData);
    setContactMessages((prev) => [saved, ...prev]);
    showToast('success', language === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message Sent', language === 'ar' ? 'سنتواصل معك قريباً' : 'We will reply shortly');
    return saved;
  };
  const updateContactStatus = (id: string, status: ContactMessage['status']) => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    const old = contactMessages.find(m=>m.id===id); if(old) void apiPut<ContactMessage>(`/api/contact/${id}`, {...old, status}).catch(err=>showToast('error','API Error',err.message));
  };
  const deleteContactMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    void apiDelete(`/api/contact/${id}`).catch(err=>showToast('error','API Error',err.message));
    showToast('info', language === 'ar' ? 'تم حذف الرسالة' : 'Message Deleted', '');
  };

  // Audit Logs
  const addAuditLog = (actor: string, action: string, category: SystemAuditLog['category'], details: string) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      category,
      details
    };
    void apiPost<SystemAuditLog>('/api/logs', newLog).then(saved => {
      setAuditLogs(prev => [saved, ...prev.filter(log => log.id !== newLog.id)]);
    }).catch(() => {
      setAuditLogs(prev => prev.filter(log => log.id !== newLog.id));
    });
  };

  const updateCurrentUser = (u: AppUser) => {
    setAuthUser((prev) => (prev && prev.id === u.id ? u : prev));
  };

  const logout = async () => {
    try { await apiPost('/api/auth/logout', {}); } finally {
      setAuthUser(null);
      
      navigateTo('home');
    }
  };

  const openRoadsideModal = () => setIsRoadsideModalOpen(true);
  const closeRoadsideModal = () => setIsRoadsideModalOpen(false);
  const toggleChat = () => setIsChatOpen((prev) => !prev);

  const showToast = (
    typeOrTitle: 'success' | 'info' | 'error' | string,
    titleOrType?: string,
    message?: string
  ) => {
    const id = Date.now().toString();
    let finalType: 'success' | 'info' | 'error' = 'info';
    let finalTitle = '';
    let finalMessage = '';

    if (typeOrTitle === 'success' || typeOrTitle === 'info' || typeOrTitle === 'error') {
      finalType = typeOrTitle;
      finalTitle = titleOrType || '';
      finalMessage = message || '';
    } else {
      // First arg is title/message, second arg is type (or empty)
      if (titleOrType === 'success' || titleOrType === 'info' || titleOrType === 'error') {
        finalType = titleOrType;
      }
      finalTitle = typeOrTitle;
      finalMessage = message || '';
    }

    setToasts((prev) => [...prev, { id, type: finalType, title: finalTitle, message: finalMessage }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (offers.some(o => o.isActive !== false && String(o.code || '').toUpperCase() === clean)) {
      setAppliedPromoCode(clean);
      updateSearchCriteria({ promoCode: clean });
      showToast(
        'success',
        language === 'ar' ? 'تم تطبيق كود الخصم!' : 'Promo Code Applied!',
        language === 'ar' ? `تم تفعيل الرمز ${clean} بنجاح.` : `Code ${clean} applied successfully.`
      );
      return true;
    } else {
      showToast(
        'error',
        language === 'ar' ? 'رمز غير صالح' : 'Invalid Code',
        language === 'ar' ? 'يرجى التحقق من صحة كود الخصم.' : 'Please check your promo code and try again.'
      );
      return false;
    }
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentPage,
        navigateTo,
        activeRole,
        setActiveRole,
        currentUser,
        authUser,
        authLoading,
        isAuthenticated,
        logout,
        updateCurrentUser,
        searchCriteria,
        updateSearchCriteria,
        selectedCarForModal,
        openCarModal,
        closeCarModal,
        isBookingWizardOpen,
        bookingCar,
        startBooking,
        closeBookingWizard,
        cars,
        addCar,
        updateCar,
        deleteCar,
        toggleCarStatus,
        branches,
        addBranch,
        updateBranch,
        deleteBranch,
        userBookings,
        saveBooking,
        refreshUserBookings,
        updateBookingStatus,
        issueTammAuthorization,
        cancelBooking,
        deleteBooking,
        restoreBooking,
        lookupBooking,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        likeBlogPost,
        usersList,
        addUser,
        updateUser,
        toggleUserStatus,
        roadsideTickets,
        addRoadsideTicket,
        updateRoadsideTicketStatus,
        inspectionReports,
        addInspectionReport,
        corporateInquiries,
        addCorporateInquiry,
        updateCorporateStatus,
        contactMessages,
        addContactMessage,
        updateContactStatus,
        deleteContactMessage,
        auditLogs,
        addAuditLog,
        globalSeo,
        updateGlobalSeo,
        pageSeoConfigs,
        updatePageSeo,
        schemaConfig,
        updateSchemaConfig,
        robotsConfig,
        updateRobotsConfig,
        keywordRankings,
        seoReady,
        addKeywordRankItem,
        deleteKeywordRankItem,
        generateSitemapXml,
        offers,
        usedCars,
        loyaltyTiers,
        subscriptions,
        faqs,
        protectionPlans,
        addonOptions,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshAuth,
        saveContentItem,
        deleteContentItem,
        paymentSettings,
        updatePaymentSettings,
        appliedPromoCode,
        applyPromoCode,
        isRoadsideModalOpen,
        openRoadsideModal,
        closeRoadsideModal,
        isChatOpen,
        toggleChat,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
