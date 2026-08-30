import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BlogPost } from '../../types';

export const AdminBlogManagerView: React.FC = () => {
  const { language, blogPosts, deleteBlogPost, addBlogPost, updateBlogPost, showToast } = useApp();

  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('guides');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80');
  const [authorNameAr, setAuthorNameAr] = useState('فريق تحرير الرفاهة');
  const [authorRoleAr, setAuthorRoleAr] = useState('محرر ومختص سيارات');
  const [tags, setTags] = useState('تأجير_سيارات, السعودية, دليل_القيادة');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => setCoverImage(reader.result as string); reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitleAr(''); setTitleEn(''); setExcerptAr(''); setExcerptEn(''); setContentAr(''); setContentEn('');
    setCategory('guides'); setCoverImage('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80');
    setAuthorNameAr('فريق تحرير الرفاهة'); setAuthorRoleAr('محرر ومختص سيارات'); setTags('تأجير_سيارات, السعودية, دليل_القيادة');
    setReadTimeMinutes(5); setIsPublished(true); setIsFeatured(false); setEditingPost(null);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitleAr(post.title.ar); setTitleEn(post.title.en);
    setExcerptAr(post.excerpt.ar); setExcerptEn(post.excerpt.en);
    setContentAr(post.content.ar); setContentEn(post.content.en);
    setCategory(post.category); setCoverImage(post.coverImage);
    setAuthorNameAr(post.author.name.ar); setAuthorRoleAr(post.author.role.ar);
    setTags(post.tags.join(', ')); setReadTimeMinutes(post.readTimeMinutes);
    setIsPublished(!!post.isPublished); setIsFeatured(!!post.isFeatured);
    setIsAddPostOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return;
    const payload = {
      slug: editingPost ? editingPost.slug : `guide-${Date.now()}`,
      title: { ar: titleAr, en: titleEn || titleAr },
      excerpt: { ar: excerptAr, en: excerptEn || excerptAr },
      content: { ar: contentAr || `${excerptAr}\n\nتفاصيل المقال ودليل الطريق الشامل...`, en: contentEn || `${excerptEn}\n\nFull guide...` },
      category,
      coverImage,
      author: {
        name: { ar: authorNameAr, en: authorNameAr },
        role: { ar: authorRoleAr, en: authorRoleAr },
        avatar: editingPost?.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      publishedAt: editingPost ? editingPost.publishedAt : new Date().toISOString().split('T')[0],
      readTimeMinutes: Number(readTimeMinutes),
      isPublished,
      isFeatured,
      tags: tags.split(',').map(s => s.trim()).filter(Boolean)
    };
    if (editingPost) {
      updateBlogPost(editingPost.id, payload);
      showToast('success', 'تم التحديث', 'تم حفظ تعديلات المقال');
    } else {
      addBlogPost(payload as any);
      showToast('success', 'تم النشر', 'تم نشر المقال بنجاح في المدونة العامة');
    }
    setIsAddPostOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'إدارة مقالات المدونة ودليل الطرق السياحية' : 'Blog & Road Guides'}</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'ar' ? 'نشر وتحديث المحتوى، نصائح القيادة ومستجدات رؤية 2030' : 'Publish automotive guides and tips'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddPostOpen(true)}
          className="gold-gradient-bg text-[#1C1917] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#C9922C]/20 border border-[#E9C682]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'ar' ? 'كتابة مقال جديد' : 'New Article'}</span>
        </button>
      </div>

      {isAddPostOpen && (
        <form onSubmit={handleSavePost} className="p-6 rounded-2xl bg-white border border-[#C9922C]/40 shadow-2xl space-y-4 max-h-[70vh] overflow-y-auto">
          <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
            <span>{editingPost ? 'تعديل المقال' : 'نشر مقال جديد في المدونة'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">عنوان المقال بالعربية *</label>
              <input type="text" required value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="مثال: أفضل 5 مسارات قيادة في شتاء العلا 2025" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">العنوان بالإنجليزية</label>
              <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="e.g. Top 5 Scenic Drives in AlUla" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">المقتطف عربي *</label>
              <textarea rows={2} required value={excerptAr} onChange={(e) => setExcerptAr(e.target.value)} placeholder="نبذة مختصرة..." className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Excerpt EN</label>
              <textarea rows={2} value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} placeholder="Short excerpt..." className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">المحتوى الكامل عربي</label>
              <textarea rows={4} value={contentAr} onChange={(e) => setContentAr(e.target.value)} placeholder="نص المقال الكامل..." className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Content EN</label>
              <textarea rows={4} value={contentEn} onChange={(e) => setContentEn(e.target.value)} placeholder="Full article content..." className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">التصنيف</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900">
                <option value="guides">guides</option><option value="tourism">tourism</option><option value="fleet_tech">fleet_tech</option><option value="vision2030">vision2030</option><option value="maintenance">maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">وقت القراءة (دقائق)</label>
              <input type="number" value={readTimeMinutes} onChange={(e) => setReadTimeMinutes(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الكاتب — الاسم</label>
              <input type="text" value={authorNameAr} onChange={(e) => setAuthorNameAr(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الكاتب — المسمى الوظيفي</label>
              <input type="text" value={authorRoleAr} onChange={(e) => setAuthorRoleAr(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-300 mb-1">الوسوم (مفصولة بفواصل)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="تأجير_سيارات, السعودية" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-2">صورة الغلاف — رفع من الجهاز</label>
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs text-stone-900 file:me-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-white file:text-[#DFAB44] file:font-bold" />
            <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className="w-full mt-2 bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono" />
            {coverImage && <img src={coverImage} alt="preview" className="w-full h-40 object-cover rounded-xl border border-stone-200 mt-2 bg-white" />}
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-stone-300"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> منشور</label>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-300"><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> مميز</label>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setIsAddPostOpen(false); resetForm(); }} className="px-4 py-2 rounded-xl bg-white text-stone-300 text-xs font-bold">إلغاء</button>
            <button type="submit" className="px-5 py-2 rounded-xl gold-gradient-bg text-[#1C1917] text-xs font-black">{editingPost ? 'حفظ التعديلات' : 'نشر الآن'}</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="h-40 relative">
              <img src={post.coverImage} alt={post.title.en} className="w-full h-full object-cover" />
              <span className="absolute top-3 start-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[#DFAB44] text-[10px] font-bold">
                {post.category}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-stone-900 text-sm line-clamp-1">
                  {language === 'ar' ? post.title.ar : post.title.en}
                </h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  {language === 'ar' ? post.excerpt.ar : post.excerpt.en}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-500 font-mono">{post.publishedAt}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => openEdit(post)} className="p-1.5 rounded-lg bg-white text-stone-300 hover:text-stone-900 border border-stone-200" title="تعديل"><Eye className="w-3.5 h-3.5 text-[#DFAB44]" /></button>
                  <button type="button" onClick={() => deleteBlogPost(post.id)} className="p-1.5 rounded-lg bg-white text-stone-400 hover:text-rose-400 border border-stone-200" title="حذف المقال"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


