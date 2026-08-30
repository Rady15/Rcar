import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlogPost } from '../types';
import { SectionReveal } from '../components/SectionReveal';
import {
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Share2,
  Search,
  Tag,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  User,
  PlusCircle,
  X,
  CheckCircle
} from 'lucide-react';

export const BlogView: React.FC = () => {
  const { language, t, blogPosts, addBlogPost, likeBlogPost, navigateTo, activeRole } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New post form state
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newExcerptAr, setNewExcerptAr] = useState('');
  const [newExcerptEn, setNewExcerptEn] = useState('');
  const [newContentAr, setNewContentAr] = useState('');
  const [newContentEn, setNewContentEn] = useState('');
  const [newCategory, setNewCategory] = useState<BlogPost['category']>('guides');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80');

  const categories = [
    { id: 'all', label: language === 'ar' ? 'كافة المقالات' : 'All Articles' },
    { id: 'tourism', label: language === 'ar' ? 'سياحة ورحلات برية' : 'Tourism & Road Trips' },
    { id: 'vision2030', label: language === 'ar' ? 'رؤية 2030 والتنقل الذكي' : 'Vision 2030 & EVs' },
    { id: 'maintenance', label: language === 'ar' ? 'نصائح وصيانة' : 'Maintenance Tips' },
    { id: 'guides', label: language === 'ar' ? 'إرشادات ومواسم' : 'Guides & Seasons' }
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      post.title.ar.toLowerCase().includes(q) ||
      post.title.en.toLowerCase().includes(q) ||
      post.excerpt.ar.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });

  const featuredPost = blogPosts.find((p) => p.isFeatured) || blogPosts[0];

  const handleShare = (post: BlogPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedSlug(post.id);
      setTimeout(() => setCopiedSlug(null), 3000);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr.trim()) return;

    addBlogPost({
      slug: `article-${Date.now()}`,
      title: { ar: newTitleAr, en: newTitleEn || newTitleAr },
      excerpt: { ar: newExcerptAr, en: newExcerptEn || newExcerptAr },
      content: { ar: newContentAr, en: newContentEn || newContentAr },
      category: newCategory,
      coverImage: newCoverImage,
      author: {
        name: { ar: 'فريق التحرير بالرفقة', en: 'Al-Rufqah Editorial' },
        role: { ar: 'مستشار التنقل', en: 'Mobility Advisor' },
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      publishedAt: new Date().toISOString().split('T')[0],
      readTimeMinutes: 5,
      isFeatured: false,
      isPublished: true,
      tags: ['تأجير_سيارات', 'السعودية', 'الرفقة']
    });

    setIsAddModalOpen(false);
    setNewTitleAr('');
    setNewTitleEn('');
    setNewExcerptAr('');
    setNewContentAr('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <SectionReveal>
      <div className="bg-gradient-to-r from-[#141210] via-[#1C1917] to-[#141210] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#C9922C]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E8]/10 text-[#DFAB44] text-xs font-black border border-[#C9922C]/30">
            <BookOpen className="w-4 h-4" />
            <span>{language === 'ar' ? 'مدونة الرفقة للسيارات والتنقل' : 'Al-Rufqah Mobility & Auto Blog'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {language === 'ar' ? 'دليلك الشامل لرحلات الطرق وأحدث تقنيات التنقل' : 'Your Ultimate Guide to Road Trips & Smart Mobility'}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            {language === 'ar'
              ? 'مقالات حصرية، نصائح ميكانيكية، مسارات استكشافية لمعالم المملكة الخلابة، ومستقبل السيارات الكهربائية تحت مظلة رؤية 2030.'
              : 'Curated road trip itineraries, expert mechanical guides, Saudi tourist gems, and the evolution of sustainable mobility.'}
          </p>

          {/* Search bar & Admin Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder={language === 'ar' ? 'ابحث في المقالات (العلا، كهربائية، صيانة، موسم الرياض...)' : 'Search articles by keyword...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-stone-900 placeholder-stone-400 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C9922C] border border-[#EDE4D3]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute top-4 end-4 pointer-events-none" />
            </div>

            {activeRole === 'admin' && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl gold-gradient-bg btn-hover btn-pop text-[#1C1917] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg border border-[#E9C682] hover:brightness-105 transition-all whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'إضافة مقال جديد' : 'New Article'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      </SectionReveal>

      {/* Featured Hero Article */}
      <SectionReveal>
      {featuredPost && !searchQuery && selectedCategory === 'all' && (
        <div
          onClick={() => setSelectedPost(featuredPost)}
          className="group relative cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#EDE4D3] shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative overflow-hidden">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title[language]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 start-4 bg-[#1C1917]/80 backdrop-blur-md text-[#DFAB44] text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-[#C9922C]/40">
              <span>{language === 'ar' ? 'المقال المميز' : 'Featured Article'}</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF3E8] text-[#C9922C] font-bold">
                  {categories.find((c) => c.id === featuredPost.category)?.label || featuredPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {featuredPost.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredPost.readTimeMinutes} {language === 'ar' ? 'دقائق' : 'min'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-[#C9922C] transition-colors leading-snug">
                {featuredPost.title[language]}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                {featuredPost.excerpt[language]}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name[language]}
                  className="w-9 h-9 rounded-full object-cover border border-[#C9922C]/40"
                />
                <div>
                  <h4 className="text-xs font-black text-stone-900">{featuredPost.author.name[language]}</h4>
                  <p className="text-[10px] text-stone-500">{featuredPost.author.role[language]}</p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#C9922C] flex items-center gap-1 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                <span>{language === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
                {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </span>
            </div>
          </div>
        </div>
      )}
      </SectionReveal>

      {/* Category Pills */}
      <SectionReveal>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'gold-gradient-bg text-[#1C1917] shadow-md shadow-[#C9922C]/20 border border-[#E9C682]'
                : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-[#EDE4D3]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      </SectionReveal>

      {/* Articles Grid */}
      <SectionReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <SectionReveal key={post.id}>
          <article
            onClick={() => setSelectedPost(post)}
            className="group cursor-pointer bg-white card-hover rounded-3xl overflow-hidden border border-[#EDE4D3] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-48 relative overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 start-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#1C1917]/80 backdrop-blur-md text-[#DFAB44] text-[11px] font-bold border border-[#C9922C]/30">
                    {categories.find((c) => c.id === post.category)?.label || post.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.publishedAt}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTimeMinutes} {language === 'ar' ? 'دقائق' : 'min'}
                  </span>
                </div>

                <h3 className="text-base font-black text-stone-900 group-hover:text-[#C9922C] transition-colors leading-snug line-clamp-2">
                  {post.title[language]}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {post.excerpt[language]}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name[language]}
                  className="w-7 h-7 rounded-full object-cover border border-[#C9922C]/40"
                />
                <span className="text-xs font-bold text-stone-800">{post.author.name[language]}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    likeBlogPost(post.id);
                  }}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-500 transition-colors p-1"
                >
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          </article>
          </SectionReveal>
        ))}
      </div>
      </SectionReveal>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE4D3] space-y-4">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-black text-lg text-stone-900">
            {language === 'ar' ? 'لا توجد مقالات مطابقة' : 'No matching articles'}
          </h3>
          <p className="text-xs text-stone-500">
            {language === 'ar' ? 'جرب البحث بكلمات مختلفة أو اختر تصنيفاً آخر.' : 'Try searching for other keywords or select another category.'}
          </p>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#EDE4D3] my-8 max-h-[90vh] flex flex-col">
            <div className="relative h-64 sm:h-72 shrink-0">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title[language]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 end-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 start-6 end-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-lg gold-gradient-bg text-[#1C1917] text-xs font-black">
                  {categories.find((c) => c.id === selectedPost.category)?.label || selectedPost.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {selectedPost.title[language]}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Author & Metrics */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPost.author.avatar}
                    alt={selectedPost.author.name[language]}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C9922C]"
                  />
                  <div>
                    <h4 className="text-xs font-black text-stone-900">{selectedPost.author.name[language]}</h4>
                    <p className="text-[11px] text-stone-500">{selectedPost.author.role[language]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => likeBlogPost(selectedPost.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-red-500" />
                    <span>{selectedPost.likes} {language === 'ar' ? 'إعجاب' : 'Likes'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(selectedPost)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF3E8] text-[#C9922C] text-xs font-bold hover:bg-[#F2E4CA] transition-colors border border-[#ECD9BA]"
                  >
                    {copiedSlug === selectedPost.id ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedSlug === selectedPost.id ? (language === 'ar' ? 'تم نسخ الرابط' : 'Copied!') : (language === 'ar' ? 'مشاركة' : 'Share')}</span>
                  </button>
                </div>
              </div>

              {/* Full Article Content */}
              <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {selectedPost.content[language]}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200">
                <Tag className="w-4 h-4 text-[#C9922C]" />
                {selectedPost.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Call to action: Book a car for this trip */}
              <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EDE4D3] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-sm text-stone-900">
                    {language === 'ar' ? 'هل تخطط لخوض هذه الرحلة؟' : 'Planning this road trip?'}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {language === 'ar'
                      ? 'استأجر السيارة الأنسب من أسطول الرفقة مع كيلومترات مفتوحة وتأمين شامل.'
                      : 'Rent the optimal car from Al-Rufqah with unlimited mileage and full protection.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPost(null);
                    navigateTo('fleet');
                  }}
                  className="px-5 py-2.5 rounded-xl gold-gradient-bg btn-hover btn-pop text-[#1C1917] text-xs font-black hover:brightness-105 transition-all shadow-xs border border-[#E9C682] whitespace-nowrap"
                >
                  {language === 'ar' ? 'استعراض الأسطول والحجز' : 'Browse Fleet & Book'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Article Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EDE4D3] space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-black text-lg text-stone-900">
                {language === 'ar' ? 'إضافة مقال جديد للمدونة' : 'Publish New Blog Post'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">عنوان المقال (بالعربية) *</label>
                  <input
                    type="text"
                    required
                    value={newTitleAr}
                    onChange={(e) => setNewTitleAr(e.target.value)}
                    placeholder="مثال: دليل القيادة في مرتفعات أبها..."
                    className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C9922C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Title (English)</label>
                  <input
                    type="text"
                    value={newTitleEn}
                    onChange={(e) => setNewTitleEn(e.target.value)}
                    placeholder="e.g. Driving Guide to Abha Mountains"
                    className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C9922C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">التصنيف</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C9922C]"
                  >
                    <option value="guides">إرشادات ومواسم (Guides)</option>
                    <option value="tourism">سياحة ورحلات برية (Tourism)</option>
                    <option value="vision2030">رؤية 2030 وكهربائية (Vision 2030 & EVs)</option>
                    <option value="maintenance">نصائح وصيانة (Maintenance)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">رابط صورة الغلاف (Image URL)</label>
                  <input
                    type="text"
                    value={newCoverImage}
                    onChange={(e) => setNewCoverImage(e.target.value)}
                    className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C9922C]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">الموجز أو المقتطف *</label>
                <textarea
                  rows={2}
                  required
                  value={newExcerptAr}
                  onChange={(e) => setNewExcerptAr(e.target.value)}
                  placeholder="موجز يظهر في بطاقة المقال..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C9922C]"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">محتوى المقال الكامل *</label>
                <textarea
                  rows={5}
                  required
                  value={newContentAr}
                  onChange={(e) => setNewContentAr(e.target.value)}
                  placeholder="اكتب المحتوى الكامل للمقال هنا..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C9922C]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gold-gradient-bg btn-hover btn-pop text-[#1C1917] text-xs font-black hover:brightness-105 border border-[#E9C682]"
                >
                  {language === 'ar' ? 'نشر المقال فوراً' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
