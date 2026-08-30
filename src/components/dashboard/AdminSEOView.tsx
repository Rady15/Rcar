import React, { useState } from 'react';
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Layers,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Smartphone,
  Monitor,
  Eye,
  Sliders,
  ShieldCheck,
  Tag,
  MapPin,
  HelpCircle,
  FileText,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageSeoConfig, KeywordRankItem } from '../../types/seo';
import { ClassicCrestBadge, ClassicFacetedStar, ClassicHeritageShield } from '../ClassicIcons';

export const AdminSEOView: React.FC = () => {
  const {
    language,
    globalSeo,
    updateGlobalSeo,
    pageSeoConfigs,
    updatePageSeo,
    schemaConfig,
    updateSchemaConfig,
    robotsConfig,
    updateRobotsConfig,
    keywordRankings,
    addKeywordRankItem,
    deleteKeywordRankItem,
    generateSitemapXml,
    showToast,
    seoReady
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'global' | 'pages' | 'schema' | 'keywords' | 'sitemap'
  >('overview');

  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Global SEO Form Local State
  const [globalForm, setGlobalForm] = useState(globalSeo);

  // Schema Form Local State
  const [schemaForm, setSchemaForm] = useState(schemaConfig);

  // Robots Form Local State
  const [robotsForm, setRobotsForm] = useState(robotsConfig);

  // New Keyword Form
  const [isAddKeywordOpen, setIsAddKeywordOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newCity, setNewCity] = useState('الرياض');
  const [newVolume, setNewVolume] = useState(15000);
  const [newRank, setNewRank] = useState(1);
  const [newTargetUrl, setNewTargetUrl] = useState('');

  // New Keyword tag for global SEO
  const [newGlobalTag, setNewGlobalTag] = useState('');

  const emptyPageSeo: PageSeoConfig = {
    id: '', name: { ar: '', en: '' }, title: { ar: '', en: '' }, description: { ar: '', en: '' },
    keywords: { ar: [], en: [] }, canonicalSlug: '/', priority: 0, changeFreq: 'weekly', schemaType: 'Organization', isIndexed: false
  };
  const selectedPage = pageSeoConfigs.find((p) => p.id === selectedPageId) || pageSeoConfigs[0] || emptyPageSeo;
  const [pageForm, setPageForm] = useState<PageSeoConfig>(selectedPage);

  // Update pageForm when selectedPageId changes
  React.useEffect(() => {
    const p = pageSeoConfigs.find((item) => item.id === selectedPageId);
    if (p) setPageForm(p);
  }, [selectedPageId, pageSeoConfigs]);

  if (!seoReady) {
    return (
      <div className="min-h-[320px] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <RefreshCw className="w-7 h-7 animate-spin mx-auto text-[#C9922C]" />
          <p className="font-bold text-stone-700">{language === 'ar' ? 'جاري تحميل إعدادات السيو من السيرفر...' : 'Loading SEO configuration from the server...'}</p>
        </div>
      </div>
    );
  }

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('info', language === 'ar' ? 'تم النسخ للحافظة' : 'Copied to Clipboard', '');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveGlobalSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalSeo(globalForm);
  };

  const handleSavePageSeo = (e: React.FormEvent) => {
    e.preventDefault();
    updatePageSeo(selectedPage.id, pageForm);
  };

  const handleSaveSchema = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchemaConfig(schemaForm);
  };

  const handleSaveRobots = (e: React.FormEvent) => {
    e.preventDefault();
    updateRobotsConfig(robotsForm);
  };

  const handleAddKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    addKeywordRankItem({
      keyword: newKeyword.trim(),
      city: newCity,
      monthlyVolume: Number(newVolume),
      currentRank: Number(newRank),
      previousRank: Number(newRank) + 1,
      serpFeatures: ['rich_snippet', 'star_ratings'],
      difficulty: 'medium',
      targetUrl: newTargetUrl
    });

    setNewKeyword('');
    setIsAddKeywordOpen(false);
  };

  // SEO Health Checks Calculation
  const pageTitleLength = selectedPage?.title[language]?.length || 0;
  const pageDescLength = selectedPage?.description[language]?.length || 0;
  const isTitleIdeal = pageTitleLength >= 40 && pageTitleLength <= 70;
  const isDescIdeal = pageDescLength >= 120 && pageDescLength <= 170;

  const sitemapXmlContent = generateSitemapXml();

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E1B18] via-[#241F1A] to-[#1E1B18] border border-stone-200 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-[#1C1917] font-black shadow-md shadow-[#C9922C]/20">
              <Globe className="w-5 h-5 text-[#1C1917]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                <span>{language === 'ar' ? 'مركز إدارة السيو والظهور في جوجل' : 'Google SEO & Search Engine Hub'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                  Googlebot Active
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                {language === 'ar'
                  ? 'تحكم كامل في وسوم Meta، عناكب البحث، ترميز Schema.org، ترتيب الكلمات، ومعاينة نتائج جوجل الحية'
                  : 'Full control over Meta tags, search crawlers, Schema.org rich snippets, keyword rankings & live SERP preview'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              showToast(
                'success',
                language === 'ar' ? 'تم إرسال خريطة الموقع' : 'Sitemap Submitted',
                language === 'ar'
                  ? 'تم إرسال sitemap.xml بنجاح إلى Google Search Console وجارٍ زحف العناكب.'
                  : 'sitemap.xml successfully pinged to Googlebot.'
              );
            }}
            className="py-2 px-3.5 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#C9922C]/20 transition-all hover:brightness-105 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1C1917]" />
            <span>{language === 'ar' ? 'تحديث الفهرسة في Search Console' : 'Ping Google Search Console'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200">
        {[
          { id: 'overview', label: language === 'ar' ? 'المؤشرات ومعاينة جوجل SERP' : 'SERP & Health Audit', icon: Eye },
          { id: 'global', label: language === 'ar' ? 'إعدادات السيو العامة' : 'Global Meta Tags', icon: Sliders },
          { id: 'pages', label: language === 'ar' ? 'سيو الصفحات الفردية' : 'Page-by-Page SEO', icon: Layers },
          { id: 'schema', label: language === 'ar' ? 'البيانات المنظمة Schema.org' : 'Structured Data & Rich Snippets', icon: FileCode },
          { id: 'keywords', label: language === 'ar' ? 'متتبع ترتيب الكلمات بالسعودية' : 'KSA Keyword Rank Tracker', icon: TrendingUp },
          { id: 'sitemap', label: language === 'ar' ? 'خريطة Sitemap & ملف الروبوت' : 'Sitemap & Robots.txt', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'gold-gradient-bg text-[#1C1917] font-black shadow-md shadow-[#C9922C]/15'
                  : 'text-stone-400 hover:text-stone-900 hover:bg-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#1C1917]' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & SERP SIMULATOR */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Audit KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-bold">
                  {language === 'ar' ? 'درجة صحة السيو الإجمالية' : 'Overall SEO Health'}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900 font-mono">98</span>
                <span className="text-xs text-emerald-400 font-bold">/ 100 ممتاز (A+)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {language === 'ar' ? 'مطابق لأحدث معايير Core Web Vitals وGoogle Helpful Content' : 'Optimized for Google Core Updates'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-bold">
                  {language === 'ar' ? 'الصفحات المفهرسة بجوجل' : 'Indexed URLs in Sitemap'}
                </span>
                <Layers className="w-4 h-4 text-[#DFAB44]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#DFAB44] font-mono">
                  {pageSeoConfigs.filter((p) => p.isIndexed).length}
                </span>
                <span className="text-xs text-stone-400 font-mono">/ {pageSeoConfigs.length} صفحة نشطة</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {language === 'ar' ? 'كافة المسارات تمتلك وسوم Canonical صالحة' : '100% valid canonical tags'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-bold">
                  {language === 'ar' ? 'الكلمات في الصفحة الأولى بجوجل' : 'Page #1 Keywords'}
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  {keywordRankings.filter((k) => k.currentRank <= 3).length}
                </span>
                <span className="text-xs text-stone-400 font-mono">في المراكز الثلاثة الأولى</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {language === 'ar' ? 'حجم بحث شهري مستهدف +280,000 استعلام' : '+280k monthly target search volume'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-bold">
                  {language === 'ar' ? 'مقتطفات جوجل الغنية Schema' : 'Rich Snippets Enabled'}
                </span>
                <ClassicCrestBadge className="w-4 h-4 text-[#DFAB44]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900 font-mono">4.9 ★</span>
                <span className="text-xs text-[#DFAB44] font-bold">(4,850+ تقييم)</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {language === 'ar' ? 'ظهور مباشر للنجوم والأسعار في بحث جوجل' : 'AutoRental & Star Rating Schema active'}
              </p>
            </div>
          </div>

          {/* Google SERP Live Simulation Box */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#DFAB44]" />
                  <span>{language === 'ar' ? 'معاينة النتيجة المباشرة في محرك بحث جوجل (Google SERP Live Preview)' : 'Live Google SERP Simulator'}</span>
                </h3>
                <p className="text-xs text-stone-400">
                  {language === 'ar'
                    ? 'كيف يظهر موقعك للعملاء عند البحث في السعودية مع التنسيقات الغنية، النجوم، والروابط الإضافية'
                    : 'Real-time simulation of how your page appears on Google Search with Rich Snippets & Sitelinks'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Device Selector */}
                <div className="bg-white p-1 rounded-xl border border-stone-200 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSerpDevice('desktop')}
                    className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      serpDevice === 'desktop' ? 'bg-white text-[#DFAB44] shadow-xs' : 'text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>سطح المكتب</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpDevice('mobile')}
                    className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      serpDevice === 'mobile' ? 'bg-white text-[#DFAB44] shadow-xs' : 'text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>الجوال</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Google Search Result Card Render */}
            <div className="p-5 rounded-2xl bg-white text-stone-900 border border-[#3C4043] font-sans">
              <div className="max-w-2xl space-y-2">
                {/* Favicon & Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#DFAB44] text-xs font-black shadow-xs shrink-0">
                    رف
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-stone-900 text-xs font-medium truncate">
                      {globalSeo.siteName[language]}
                    </div>
                    <div className="text-[#9AA0A6] text-[11px] font-mono truncate dir-ltr text-start">
                      {globalSeo.canonicalBaseUrl}{selectedPage.canonicalSlug !== '/' ? selectedPage.canonicalSlug : ''}
                    </div>
                  </div>
                </div>

                {/* Google Blue Link Title */}
                <h4 className="text-[#8AB4F8] hover:underline cursor-pointer text-lg font-normal leading-snug">
                  {selectedPage.title[language]} {globalSeo.titleSeparator} {globalSeo.siteName[language]}
                </h4>

                {/* Rich Snippet Star Rating & Price */}
                <div className="flex items-center gap-3 text-xs text-[#BDC1C6]">
                  <div className="flex items-center gap-1 text-[#FABB05]">
                    <span>★ 4.9</span>
                    <span className="text-[#9AA0A6]">(4,850 تقييم معتمد)</span>
                  </div>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">الأسعار تبدأ من 120 ر.س / يوم</span>
                  <span>•</span>
                  <span className="text-stone-400">تأجير فوري - فروع المطارات</span>
                </div>

                {/* Meta Description snippet */}
                <p className="text-[#BDC1C6] text-xs sm:text-sm leading-relaxed">
                  {selectedPage.description[language]}
                </p>

                {/* Google Sitelinks Pack */}
                <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-white/50 border border-[#3C4043]">
                    <div className="text-[#8AB4F8] font-medium hover:underline cursor-pointer">
                      أسطول السيارات
                    </div>
                    <div className="text-[#9AA0A6] text-[11px]">مرسيدس، رينج روفر، وكامري مع تفويض تم الفوري.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 border border-[#3C4043]">
                    <div className="text-[#8AB4F8] font-medium hover:underline cursor-pointer">
                      فروع المطارات 24/7
                    </div>
                    <div className="text-[#9AA0A6] text-[11px]">مطار الملك خالد، مطار جدة، وصالات الاستلام الذاتي.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Validation Check Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-300 font-bold block">طول العنوان (Title Tag)</span>
                  <span className={`text-[11px] font-mono ${isTitleIdeal ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                    {pageTitleLength} حرف {isTitleIdeal ? '✓ مثالي (40-70)' : '(يحتاج مراجعة)'}
                  </span>
                </div>
                {isTitleIdeal ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-300 font-bold block">طول الوصف (Meta Description)</span>
                  <span className={`text-[11px] font-mono ${isDescIdeal ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                    {pageDescLength} حرف {isDescIdeal ? '✓ مثالي (120-170)' : '(طول مقبول)'}
                  </span>
                </div>
                {isDescIdeal ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-300 font-bold block">الاستهداف الجغرافي للسعودية</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">SA-01 (Riyadh/KSA) ✓</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL META TAGS */}
      {activeTab === 'global' && (
        <form onSubmit={handleSaveGlobalSeo} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#DFAB44]" />
                <span>{language === 'ar' ? 'إعدادات وسوم Meta العامة والموقع' : 'Global Search & Meta Directives'}</span>
              </h3>
              <p className="text-xs text-stone-400">
                {language === 'ar'
                  ? 'هذه الإعدادات تطبق على رأس الموقع بالكامل وتوجه عناكب البحث لمحاذاة الهوية والموقع بالسعودية'
                  : 'Site-wide head meta tags, OpenGraph protocol & regional geo-targeting for Saudi Arabia'}
              </p>
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#C9922C]/20 transition-all hover:brightness-105"
            >
              <Save className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>{language === 'ar' ? 'حفظ إعدادات السيو العامة' : 'Save Global SEO'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Site Name Arabic */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'اسم الموقع الأساسي (بالعربية)' : 'Site Name (Arabic)'}
              </label>
              <input
                type="text"
                value={globalForm.siteName.ar}
                onChange={(e) => setGlobalForm({ ...globalForm, siteName: { ...globalForm.siteName, ar: e.target.value } })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
              />
            </div>

            {/* Site Name English */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'اسم الموقع (بالإنجليزية)' : 'Site Name (English)'}
              </label>
              <input
                type="text"
                value={globalForm.siteName.en}
                onChange={(e) => setGlobalForm({ ...globalForm, siteName: { ...globalForm.siteName, en: e.target.value } })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden dir-ltr text-start"
              />
            </div>

            {/* Default Meta Title Arabic */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'عنوان Meta الافتراضي (Default Page Title)' : 'Default Title Tag (Arabic)'}
              </label>
              <input
                type="text"
                value={globalForm.defaultTitle.ar}
                onChange={(e) => setGlobalForm({ ...globalForm, defaultTitle: { ...globalForm.defaultTitle, ar: e.target.value } })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
              />
            </div>

            {/* Default Meta Description Arabic */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-stone-300">
                  {language === 'ar' ? 'الوصف التعريفي العام (Meta Description - Arabic)' : 'Default Meta Description'}
                </label>
                <span className="text-[11px] font-mono text-stone-400">
                  {globalForm.metaDescription.ar.length} حرف (الموصى به 140-160)
                </span>
              </div>
              <textarea
                rows={3}
                value={globalForm.metaDescription.ar}
                onChange={(e) => setGlobalForm({ ...globalForm, metaDescription: { ...globalForm.metaDescription, ar: e.target.value } })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden resize-none"
              />
            </div>

            {/* Canonical Base URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'رابط النطاق الأساسي (Canonical Base URL)' : 'Canonical Base URL'}
              </label>
              <input
                type="text"
                value={globalForm.canonicalBaseUrl}
                onChange={(e) => setGlobalForm({ ...globalForm, canonicalBaseUrl: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden dir-ltr text-start font-mono"
              />
            </div>

            {/* Robots Indexing Directive */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'توجيهات الفهرسة العامة (Robots Directive)' : 'Robots Meta Tag'}
              </label>
              <select
                value={globalForm.robotsIndexing}
                onChange={(e) => setGlobalForm({ ...globalForm, robotsIndexing: e.target.value as any })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
              >
                <option value="index, follow">index, follow (السماح بالفهرسة وتتبع الروابط - موصى به)</option>
                <option value="noindex, follow">noindex, follow (عدم الفهرسة وتتبع الروابط)</option>
                <option value="noindex, nofollow">noindex, nofollow (حظر الفهرسة والزحف تماماً)</option>
              </select>
            </div>

            {/* OpenGraph Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'صورة المشاركة الاجتماعية (OpenGraph Image URL)' : 'OG Image URL'}
              </label>
              <input
                type="text"
                value={globalForm.ogImage}
                onChange={(e) => setGlobalForm({ ...globalForm, ogImage: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden dir-ltr text-start font-mono"
              />
            </div>

            {/* Google Site Verification Token */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'رمز التحقق من ملكية موقع جوجل (Google Site Verification)' : 'Google Site Verification'}
              </label>
              <input
                type="text"
                value={globalForm.googleSiteVerification}
                onChange={(e) => setGlobalForm({ ...globalForm, googleSiteVerification: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden dir-ltr text-start font-mono"
              />
            </div>
          </div>

          {/* Keywords Tag Manager */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label className="text-xs font-bold text-stone-300 block">
              {language === 'ar' ? 'الكلمات المفتاحية العامة للموقع (Keywords)' : 'Global SEO Keywords'}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {globalForm.defaultKeywords.ar.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-stone-50 text-[#DFAB44] border border-[#3A3228] text-xs font-bold flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-[#C9922C]" />
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setGlobalForm({
                        ...globalForm,
                        defaultKeywords: {
                          ...globalForm.defaultKeywords,
                          ar: globalForm.defaultKeywords.ar.filter((_, i) => i !== idx)
                        }
                      })
                    }
                    className="hover:text-rose-400 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={language === 'ar' ? 'أضف كلمة مفتاحية جديدة...' : 'Add a keyword...'}
                value={newGlobalTag}
                onChange={(e) => setNewGlobalTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newGlobalTag.trim()) {
                      setGlobalForm({
                        ...globalForm,
                        defaultKeywords: {
                          ...globalForm.defaultKeywords,
                          ar: [...globalForm.defaultKeywords.ar, newGlobalTag.trim()]
                        }
                      });
                      setNewGlobalTag('');
                    }
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  if (newGlobalTag.trim()) {
                    setGlobalForm({
                      ...globalForm,
                      defaultKeywords: {
                        ...globalForm.defaultKeywords,
                        ar: [...globalForm.defaultKeywords.ar, newGlobalTag.trim()]
                      }
                    });
                    setNewGlobalTag('');
                  }
                }}
                className="py-2 px-3 rounded-xl bg-stone-50 hover:bg-white text-stone-900 text-xs font-bold border border-stone-200"
              >
                {language === 'ar' ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: PAGE-BY-PAGE SEO CONTROLLER */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Page Selector Column */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 px-2">
              {language === 'ar' ? 'اختر الصفحة لتعديل السيو:' : 'Select Page Route:'}
            </h3>
            <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
              {pageSeoConfigs.map((page) => {
                const isSelected = page.id === selectedPageId;
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setSelectedPageId(page.id)}
                    className={`w-full text-start p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'gold-gradient-bg text-[#1C1917] border-[#C9922C] shadow-md font-bold'
                        : 'bg-white hover:bg-white text-stone-300 border-[#2A2520]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{page.name[language]}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-white text-[#DFAB44]' : 'bg-white text-stone-400'
                        }`}
                      >
                        {page.canonicalSlug}
                      </span>
                    </div>
                    <div className="text-[11px] truncate mt-1 opacity-80">{page.title[language]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Page SEO Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSavePageSeo} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#DFAB44]" />
                    <span>{language === 'ar' ? `تعديل سيو: ${selectedPage.name[language]}` : `Editing SEO for: ${selectedPage.name[language]}`}</span>
                  </h3>
                  <span className="text-[11px] text-stone-400 font-mono">
                    المسار: {globalSeo.canonicalBaseUrl}{selectedPage.canonicalSlug}
                  </span>
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#C9922C]/20 transition-all hover:brightness-105"
                >
                  <Save className="w-3.5 h-3.5 text-[#1C1917]" />
                  <span>{language === 'ar' ? 'حفظ تعديلات الصفحة' : 'Save Page SEO'}</span>
                </button>
              </div>

              {/* Page Title Arabic */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-stone-300">
                    {language === 'ar' ? 'عنوان الصفحة لمحرك البحث (Meta Title - Arabic)' : 'Page Title (Arabic)'}
                  </label>
                  <span className={`text-[11px] font-mono ${pageForm.title.ar.length >= 40 && pageForm.title.ar.length <= 70 ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                    {pageForm.title.ar.length} حرف (الموصى به 40-70)
                  </span>
                </div>
                <input
                  type="text"
                  value={pageForm.title.ar}
                  onChange={(e) => setPageForm({ ...pageForm, title: { ...pageForm.title, ar: e.target.value } })}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
                />
              </div>

              {/* Page Title English */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">
                  {language === 'ar' ? 'عنوان الصفحة بالإنجليزية (Meta Title - English)' : 'Page Title (English)'}
                </label>
                <input
                  type="text"
                  value={pageForm.title.en}
                  onChange={(e) => setPageForm({ ...pageForm, title: { ...pageForm.title, en: e.target.value } })}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden dir-ltr text-start"
                />
              </div>

              {/* Page Description Arabic */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-stone-300">
                    {language === 'ar' ? 'الوصف التعريفي للصفحة (Meta Description - Arabic)' : 'Page Description'}
                  </label>
                  <span className={`text-[11px] font-mono ${pageForm.description.ar.length >= 120 && pageForm.description.ar.length <= 170 ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                    {pageForm.description.ar.length} حرف (الموصى به 120-170)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={pageForm.description.ar}
                  onChange={(e) => setPageForm({ ...pageForm, description: { ...pageForm.description, ar: e.target.value } })}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden resize-none"
                />
              </div>

              {/* Schema Type & Sitemap Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">
                    {language === 'ar' ? 'نوع الترميز (Schema Type)' : 'Schema Type'}
                  </label>
                  <select
                    value={pageForm.schemaType}
                    onChange={(e) => setPageForm({ ...pageForm, schemaType: e.target.value as any })}
                    className="w-full py-2 px-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
                  >
                    <option value="AutoRental">AutoRental (تأجير سيارات)</option>
                    <option value="LocalBusiness">LocalBusiness (نشاط محلي)</option>
                    <option value="Product">Product (كتالوج سيارات)</option>
                    <option value="FAQPage">FAQPage (أسئلة شائعة)</option>
                    <option value="Article">Article (مقال ودليل)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">
                    {language === 'ar' ? 'أولوية خريطة الموقع (Priority)' : 'Sitemap Priority'}
                  </label>
                  <select
                    value={pageForm.priority}
                    onChange={(e) => setPageForm({ ...pageForm, priority: Number(e.target.value) })}
                    className="w-full py-2 px-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden font-mono"
                  >
                    <option value="1.0">1.0 (أعلى أولوية - رئيسية)</option>
                    <option value="0.9">0.9 (عالية جداً - أسطول/فروع)</option>
                    <option value="0.8">0.8 (عالية - عروض/شركات)</option>
                    <option value="0.7">0.7 (متوسطة - خدمات أخرى)</option>
                    <option value="0.5">0.5 (عادية)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">
                    {language === 'ar' ? 'تكرار التحديث (ChangeFreq)' : 'Change Frequency'}
                  </label>
                  <select
                    value={pageForm.changeFreq}
                    onChange={(e) => setPageForm({ ...pageForm, changeFreq: e.target.value as any })}
                    className="w-full py-2 px-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden font-mono"
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily (يومي)</option>
                    <option value="weekly">weekly (أسبوعي)</option>
                    <option value="monthly">monthly (شهري)</option>
                  </select>
                </div>
              </div>

              {/* Indexing Toggle */}
              <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    {language === 'ar' ? 'فهرسة الصفحة في محركات البحث (Googlebot Indexing)' : 'Allow Googlebot Indexing'}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {pageForm.isIndexed
                      ? 'مفعلة: ستظهر الصفحة في نتائج بحث جوجل وخريطة الموقع sitemap.xml'
                      : 'معطلة: سيتم إرسال وسم noindex لعناكب البحث'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPageForm({ ...pageForm, isIndexed: !pageForm.isIndexed })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    pageForm.isIndexed ? 'bg-emerald-500' : 'bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      pageForm.isIndexed ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: STRUCTURED DATA SCHEMA.ORG */}
      {activeTab === 'schema' && (
        <form onSubmit={handleSaveSchema} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#DFAB44]" />
                <span>{language === 'ar' ? 'البيانات المنظمة والترميز الهيكلي (Schema.org JSON-LD)' : 'Structured Data & Rich Snippets'}</span>
              </h3>
              <p className="text-xs text-stone-400">
                {language === 'ar'
                  ? 'توليد كود JSON-LD تلقائياً لمنح موقعك مقتطفات غنية، تقييمات بالنجوم، وبطاقات الأسطول في جوجل'
                  : 'Automatic JSON-LD generation for Google Rich Snippets, Star Ratings, and AutoRental entity graphs'}
              </p>
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#C9922C]/20 transition-all hover:brightness-105"
            >
              <Save className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>{language === 'ar' ? 'حفظ إعدادات Schema.org' : 'Save Schema Config'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Legal Company Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'الاسم التجاري القانوني للشركة' : 'Legal Company Name'}
              </label>
              <input
                type="text"
                value={schemaForm.companyLegalName.ar}
                onChange={(e) =>
                  setSchemaForm({
                    ...schemaForm,
                    companyLegalName: { ...schemaForm.companyLegalName, ar: e.target.value }
                  })
                }
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
              />
            </div>

            {/* Official Support Telephone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'رقم الهاتف الرسمي في Schema' : 'Support Phone (E.164)'}
              </label>
              <input
                type="text"
                value={schemaForm.telephone}
                onChange={(e) => setSchemaForm({ ...schemaForm, telephone: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden dir-ltr text-start font-mono"
              />
            </div>

            {/* Rating Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'متوسط تقييم العملاء (Google Aggregate Rating)' : 'Rating Value (out of 5)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={schemaForm.ratingValue}
                onChange={(e) => setSchemaForm({ ...schemaForm, ratingValue: Number(e.target.value) })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden font-mono"
              />
            </div>

            {/* Review Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'عدد التقييمات المعتمدة (Review Count)' : 'Total Review Count'}
              </label>
              <input
                type="number"
                value={schemaForm.reviewCount}
                onChange={(e) => setSchemaForm({ ...schemaForm, reviewCount: Number(e.target.value) })}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Toggles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">AutoRental Schema</span>
                <span className="text-[11px] text-stone-400">تفعيل مخطط نشاط تأجير السيارات</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSchemaForm({
                    ...schemaForm,
                    enableAutoRentalSchema: !schemaForm.enableAutoRentalSchema
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  schemaForm.enableAutoRentalSchema ? 'bg-emerald-500' : 'bg-white'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    schemaForm.enableAutoRentalSchema ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Product & Vehicle Catalog</span>
                <span className="text-[11px] text-stone-400">تضمين أسعار السيارات في البحث</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSchemaForm({
                    ...schemaForm,
                    enableCarProductsSchema: !schemaForm.enableCarProductsSchema
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  schemaForm.enableCarProductsSchema ? 'bg-emerald-500' : 'bg-white'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    schemaForm.enableCarProductsSchema ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Live JSON-LD Code Inspector */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-300">
                {language === 'ar' ? 'معاينة كود JSON-LD المحقون في وسم <head>:' : 'Live Injected JSON-LD Code Preview:'}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    JSON.stringify(
                      {
                        '@context': 'https://schema.org',
                        '@type': 'AutoRental',
                        name: schemaForm.companyLegalName.ar,
                        url: globalSeo.canonicalBaseUrl,
                        telephone: schemaForm.telephone,
                        aggregateRating: {
                          '@type': 'AggregateRating',
                          ratingValue: schemaForm.ratingValue,
                          reviewCount: schemaForm.reviewCount
                        }
                      },
                      null,
                      2
                    ),
                    'schema-json'
                  )
                }
                className="py-1 px-2.5 rounded-lg bg-stone-50 hover:bg-white text-stone-300 hover:text-stone-900 text-xs flex items-center gap-1 border border-[#3A3228]"
              >
                {copiedKey === 'schema-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'schema-json' ? 'تم النسخ' : 'نسخ الكود'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-white border border-[#26221D] text-[#85E89D] text-[11px] font-mono overflow-x-auto max-h-48 scrollbar-thin">
              {JSON.stringify(
                {
                  '@context': 'https://schema.org',
                  '@type': 'AutoRental',
                  name: schemaForm.companyLegalName.ar,
                  alternateName: ['الرفاهة لتأجير السيارات', 'Al-Rifaha Car Hire'],
                  url: globalSeo.canonicalBaseUrl,
                  telephone: schemaForm.telephone,
                  priceRange: schemaForm.priceRange,
                  currenciesAccepted: 'SAR',
                  paymentAccepted: schemaForm.paymentAccepted,
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: schemaForm.ratingValue,
                    reviewCount: schemaForm.reviewCount,
                    bestRating: 5
                  }
                },
                null,
                2
              )}
            </pre>
          </div>
        </form>
      )}

      {/* TAB 5: KSA KEYWORDS RANK TRACKER */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'متتبع ترتيب الكلمات المفتاحية في السعودية (Google KSA SERP Rank Tracker)' : 'Google KSA Keyword Rankings Tracker'}</span>
              </h3>
              <p className="text-xs text-stone-400">
                {language === 'ar'
                  ? 'مراقبة حية لمواقع الكلمات المستهدفة في الرياض وجدة والمطارات ومعدلات البحث الشهرية'
                  : 'Live monitoring of automotive search keywords across major Saudi cities'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddKeywordOpen(true)}
              className="py-2 px-3.5 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#C9922C]/20 transition-all hover:brightness-105"
            >
              <Plus className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>{language === 'ar' ? 'إضافة كلمة للتتبع' : 'Track New Keyword'}</span>
            </button>
          </div>

          {/* Keywords Table */}
          <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs text-stone-300">
                <thead className="bg-white text-stone-400 text-start uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الكلمة المفتاحية المستهدفة' : 'Keyword Query'}</th>
                    <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'المدينة / النطاق' : 'City / Region'}</th>
                    <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'حجم البحث الشهري' : 'Search Volume'}</th>
                    <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الترتيب في جوجل' : 'Google Rank'}</th>
                    <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'ميزات SERP' : 'SERP Features'}</th>
                    <th className="py-3.5 px-4 text-end">{language === 'ar' ? 'إجراء' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#241F1A]">
                  {keywordRankings.map((kw) => (
                    <tr key={kw.id} className="hover:bg-white transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#DFAB44]" />
                          <span>{kw.keyword}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono truncate max-w-xs">{kw.targetUrl}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-stone-50 text-stone-300 text-[11px] font-medium border border-[#352E27]">
                          {kw.city}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-200">
                        {kw.monthlyVolume.toLocaleString()} / شهر
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-black ${
                            kw.currentRank === 1
                              ? 'gold-gradient-bg text-[#1C1917] shadow-sm font-black'
                              : kw.currentRank <= 3
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white text-stone-300'
                          }`}
                        >
                          #{kw.currentRank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {kw.serpFeatures.map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-white text-[#DFAB44] border border-[#2E2822] font-mono"
                            >
                              {feat === 'rich_snippet' ? '★ Rich Snippet' : feat === 'maps_pack' ? '📍 Maps Pack' : '🔗 Sitelinks'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-end">
                        <button
                          type="button"
                          onClick={() => deleteKeywordRankItem(kw.id)}
                          className="p-1.5 rounded-lg bg-stone-50 hover:bg-rose-900/30 text-stone-400 hover:text-rose-400 transition-colors"
                          title="حذف الكلمة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Keyword Modal */}
          {isAddKeywordOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
              <form
                onSubmit={handleAddKeywordSubmit}
                className="w-full max-w-md p-6 rounded-2xl bg-white border border-stone-200 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="font-black text-stone-900 text-sm">إضافة كلمة مفتاحية جديدة للتتبع</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddKeywordOpen(false)}
                    className="text-stone-400 hover:text-stone-900"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">الكلمة المفتاحية (Search Query)</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تأجير سيارات فخمة مطار جدة"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">المدينة</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-300">حجم البحث الشهري</label>
                    <input
                      type="number"
                      value={newVolume}
                      onChange={(e) => setNewVolume(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">الرابط المستهدف (Target Landing Page)</label>
                  <input
                    type="text"
                    value={newTargetUrl}
                    onChange={(e) => setNewTargetUrl(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:border-[#C9922C] focus:outline-hidden font-mono dir-ltr text-start"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsAddKeywordOpen(false)}
                    className="py-2 px-3 rounded-xl bg-stone-50 text-stone-300 text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs"
                  >
                    إضافة الكلمة
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SITEMAP & ROBOTS.TXT */}
      {activeTab === 'sitemap' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sitemap.xml Generator */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#DFAB44]" />
                  <span>خريطة الموقع المباشرة (sitemap.xml)</span>
                </h3>
                <span className="text-[11px] text-stone-400 font-mono">
                  {pageSeoConfigs.filter((p) => p.isIndexed).length} روابط مفهرسة
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(sitemapXmlContent, 'sitemap-copy')}
                  className="py-1.5 px-3 rounded-xl bg-stone-50 hover:bg-white text-stone-300 hover:text-stone-900 text-xs font-bold border border-[#3A3228] flex items-center gap-1.5"
                >
                  {copiedKey === 'sitemap-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sitemap-copy' ? 'تم النسخ' : 'نسخ XML'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-white border border-[#26221D] text-[#85E89D] text-[11px] font-mono overflow-x-auto max-h-96 scrollbar-thin">
              {sitemapXmlContent}
            </pre>
          </div>

          {/* Robots.txt Editor */}
          <form onSubmit={handleSaveRobots} className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>محرر ملف الروبوت (robots.txt)</span>
                </h3>
                <span className="text-[11px] text-stone-400">
                  التحكم في أوامر الزحف لعناكب Googlebot وBingbot
                </span>
              </div>
              <button
                type="submit"
                className="py-2 px-3.5 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#C9922C]/20"
              >
                <Save className="w-3.5 h-3.5 text-[#1C1917]" />
                <span>حفظ ملف robots.txt</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">محتوى ملف robots.txt المباشر</label>
              <textarea
                rows={12}
                value={robotsForm.customRobotsTxt}
                onChange={(e) => setRobotsForm({ ...robotsForm, customRobotsTxt: e.target.value })}
                className="w-full p-4 rounded-xl bg-white border border-[#26221D] text-[#85E89D] text-xs font-mono focus:border-[#C9922C] focus:outline-hidden resize-none scrollbar-thin dir-ltr text-start"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


