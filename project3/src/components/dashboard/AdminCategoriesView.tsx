import React, { useState, useMemo } from 'react';
import { Tag, PlusCircle, Search, Edit3, Trash2, Eye, X, Save, AlertTriangle, LayoutGrid, List, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

const iconOptions = ['Tag','Car','Truck','Crown','Users','Gauge','Zap','Briefcase','CarFront','Star','Award','Shield'];

export const AdminCategoriesView: React.FC = () => {
  const { language, categories, cars, addCategory, updateCategory, deleteCategory } = useApp() as any;
  const isAr = language === 'ar';
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table'|'grid'>('table');
  const [viewCat, setViewCat] = useState<Category|null>(null);
  const [editCat, setEditCat] = useState<Category|null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = useMemo(()=>{
    const q = search.toLowerCase().trim();
    if(!q) return categories;
    return categories.filter((c:Category)=> `${c.name.ar} ${c.name.en} ${c.slug}`.toLowerCase().includes(q));
  },[categories,search]);

  const handleDelete = async (cat:Category)=>{
    try{ await deleteCategory(cat.id); }catch(e:any){ alert(e.message); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center shrink-0"><Tag className="w-5 h-5 text-[#1C1917]"/></div>
          <div>
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              {isAr ? 'إدارة الماركات' : 'Brands Management'}
              <span className="px-2 py-0.5 rounded-full bg-white text-[#DFAB44] text-[11px] font-mono border border-stone-200">{categories.length}</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">{isAr ? 'إضافة وتعديل وحذف وعرض جميع ماركات السيارات - متصل مباشرة بقاعدة البيانات' : 'Add / Edit / Delete / View all car brands - synced with backend'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-xl border border-stone-200 flex items-center gap-1">
            <button onClick={()=>setViewMode('table')} className={`p-1.5 rounded-lg ${viewMode==='table'?'bg-white text-[#DFAB44]':'text-stone-400'}`}><List className="w-4 h-4"/></button>
            <button onClick={()=>setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode==='grid'?'bg-white text-[#DFAB44]':'text-stone-400'}`}><LayoutGrid className="w-4 h-4"/></button>
          </div>
          <button onClick={()=>{setEditCat(null); setIsAddOpen(true);}} className="gold-gradient-bg text-[#1C1917] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#C9922C]/20 border border-[#E9C682]">
            <PlusCircle className="w-4 h-4"/>{isAr ? 'إضافة ماركة جديدة' : 'Add Brand'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-500 absolute start-3 top-1/2 -translate-y-1/2"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isAr ? 'بحث باسم الماركة أو الرمز...' : 'Search by brand name or slug...'} className="w-full bg-white border border-stone-200 rounded-xl py-2.5 ps-10 pe-4 text-xs text-stone-900 placeholder-stone-500 focus:outline-none focus:border-[#C9922C]"/>
        </div>
        <span className="text-xs text-stone-500 font-mono">{filtered.length} {isAr ? 'ماركة' : 'brands'}</span>
      </div>

      {/* Content */}
      {viewMode==='table' ? (
        <div className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-white text-stone-400 border-b border-stone-200 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4">{isAr ? 'الماركة' : 'Brand'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'الرمز (Slug)' : 'Slug'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'الترتيب' : 'Order'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'عدد السيارات' : 'Vehicles'}</th>
                  <th className="py-3.5 px-4 text-center">{isAr ? 'إجراءات (عرض/تعديل/حذف)' : 'Actions (View/Edit/Del)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C2621] text-stone-200">
                {filtered.length===0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-stone-500">{isAr ? 'لا توجد فئات' : 'No categories found'}</td></tr>
                ) : filtered.map((cat:Category)=>{
                  const count = cars.filter((c:any)=> c.brand.toLowerCase()===cat.slug.toLowerCase() || c.brand.toLowerCase()===cat.name.en.toLowerCase()).length;
                  return (
                    <tr key={cat.id} className="hover:bg-white transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0" style={{backgroundColor:`${cat.color}15`, borderColor:`${cat.color}40`, color:cat.color}}><Tag className="w-4 h-4"/></div>
                          <div>
                            <div className="font-black text-stone-900 text-xs">{isAr ? cat.name.ar : cat.name.en}</div>
                            <div className="text-[11px] text-stone-500">{isAr ? cat.name.en : cat.name.ar}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#DFAB44]">{cat.slug}</td>
                      <td className="py-3.5 px-4 font-mono">{cat.sortOrder ?? 0}</td>
                      <td className="py-3.5 px-4">
                        {cat.isActive!==false ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black"><CheckCircle2 className="w-3 h-3"/>{isAr?'نشط':'Active'}</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/30 text-stone-400 border border-stone-700 text-[10px] font-black"><XCircle className="w-3 h-3"/>{isAr?'متوقف':'Inactive'}</span>}
                      </td>
                      <td className="py-3.5 px-4"><span className="px-2 py-1 rounded-full bg-white text-stone-300 font-mono text-[11px]">{count}</span></td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={()=>setViewCat(cat)} className="p-1.5 rounded-lg bg-white text-stone-300 hover:text-stone-900 border border-stone-200" title={isAr?'عرض':'View'}><Eye className="w-3.5 h-3.5 text-sky-400"/></button>
                          <button onClick={()=>setEditCat(cat)} className="p-1.5 rounded-lg bg-white text-stone-300 hover:text-stone-900 border border-stone-200" title={isAr?'تعديل':'Edit'}><Edit3 className="w-3.5 h-3.5 text-[#DFAB44]"/></button>
                          <button onClick={()=>handleDelete(cat)} className="p-1.5 rounded-lg bg-white text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 border border-stone-200" title={isAr?'حذف':'Delete'}><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat:Category)=>{
            const count = cars.filter((c:any)=> c.brand.toLowerCase()===cat.slug.toLowerCase() || c.brand.toLowerCase()===cat.name.en.toLowerCase()).length;
            return (
              <div key={cat.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl hover:border-[#C9922C]/40 transition-all space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{backgroundColor:`${cat.color}15`, borderColor:`${cat.color}30`, color:cat.color}}><Tag className="w-5 h-5"/></div>
                    <div>
                      <div className="font-black text-stone-900 text-sm">{isAr ? cat.name.ar : cat.name.en}</div>
                      <div className="text-[11px] font-mono text-[#DFAB44]">{cat.slug}</div>
                    </div>
                  </div>
                  {cat.isActive!==false ? <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"/> : <span className="w-2.5 h-2.5 rounded-full bg-stone-600"/>}
                </div>
                {cat.description && <p className="text-xs text-stone-400 line-clamp-2">{isAr ? cat.description.ar : cat.description.en}</p>}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-200">
                  <span className="text-stone-500">{isAr?'السيارات':'Vehicles'}: <b className="text-stone-900 font-mono">{count}</b></span>
                  <span className="text-stone-500">{isAr?'الترتيب':'Order'}: <b className="text-stone-900 font-mono">{cat.sortOrder}</b></span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={()=>setViewCat(cat)} className="flex-1 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold border border-stone-200 flex items-center justify-center gap-1"><Eye className="w-3.5 h-3.5 text-sky-400"/>{isAr?'عرض':'View'}</button>
                  <button onClick={()=>setEditCat(cat)} className="flex-1 py-2 rounded-xl bg-white text-stone-900 text-xs font-bold border border-stone-200 flex items-center justify-center gap-1"><Edit3 className="w-3.5 h-3.5 text-[#DFAB44]"/>{isAr?'تعديل':'Edit'}</button>
                  <button onClick={()=>handleDelete(cat)} className="p-2 rounded-xl bg-rose-950/30 text-rose-400 border border-rose-900/50"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View Modal */}
      {viewCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>setViewCat(null)}/>
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-stone-900 font-black flex items-center gap-2"><Eye className="w-5 h-5 text-sky-400"/>{isAr?'عرض الفئة':'View Category'}</h3>
              <button onClick={()=>setViewCat(null)} className="p-2 rounded-lg bg-white text-stone-400"><X className="w-4 h-4"/></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{backgroundColor:`${viewCat.color}20`, borderColor:`${viewCat.color}40`, color:viewCat.color}}><Tag className="w-5 h-5"/></div>
                <div>
                  <div className="font-black text-stone-900">{isAr ? viewCat.name.ar : viewCat.name.en} <span className="text-stone-500 font-normal">/ {isAr ? viewCat.name.en : viewCat.name.ar}</span></div>
                  <div className="font-mono text-[#DFAB44] text-xs">{viewCat.slug} • ID: {viewCat.id}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-stone-200"><div className="text-[11px] text-stone-500">{isAr?'الرمز':'Slug'}</div><div className="font-mono text-stone-900">{viewCat.slug}</div></div>
                <div className="p-3 rounded-xl bg-white border border-stone-200"><div className="text-[11px] text-stone-500">{isAr?'الترتيب':'Sort Order'}</div><div className="font-mono text-stone-900">{viewCat.sortOrder}</div></div>
                <div className="p-3 rounded-xl bg-white border border-stone-200"><div className="text-[11px] text-stone-500">{isAr?'الحالة':'Status'}</div><div className={`${viewCat.isActive!==false?'text-emerald-400':'text-stone-400'} font-bold`}>{viewCat.isActive!==false ? (isAr?'نشط':'Active'):(isAr?'متوقف':'Inactive')}</div></div>
                <div className="p-3 rounded-xl bg-white border border-stone-200"><div className="text-[11px] text-stone-500">{isAr?'اللون':'Color'}</div><div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor:viewCat.color}}/><span className="font-mono text-stone-900">{viewCat.color}</span></div></div>
              </div>
              {viewCat.description && <div className="p-3 rounded-xl bg-white border border-stone-200"><div className="text-[11px] text-stone-500 mb-1">{isAr?'الوصف':'Description'}</div><div className="text-stone-300 text-xs">{isAr ? viewCat.description.ar : viewCat.description.en}</div><div className="text-stone-500 text-xs mt-1">{isAr ? viewCat.description.en : viewCat.description.ar}</div></div>}
                            <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs
          text-stone-400"><div>{isAr?'عدد السيارات بهذه الماركة':'Vehicles in this brand'}: <b className="text-stone-900">{cars.filter((c:any)=>c.brand.toLowerCase()===viewCat.slug.toLowerCase() || c.brand.toLowerCase()===viewCat.name.en.toLowerCase()).length}</b></div><div className="font-mono text-[11px] mt-1">{viewCat.createdAt && `Created: ${viewCat.createdAt}`}</div></div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>{setEditCat(viewCat); setViewCat(null)}} className="flex-1 py-2.5 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs flex items-center justify-center gap-2"><Edit3 className="w-4 h-4"/>{isAr?'تعديل الفئة':'Edit'}</button>
              <button onClick={()=>setViewCat(null)} className="px-5 py-2.5 rounded-xl bg-white text-stone-900 text-xs font-bold">{isAr?'إغلاق':'Close'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddOpen || editCat) && (
        <CategoryFormModal
          key={editCat?.id || 'new'}
          category={editCat}
          onClose={()=>{setIsAddOpen(false); setEditCat(null);}}
          onSave={async (data)=>{
            try{
              if(editCat) await updateCategory(editCat.id, data);
              else await addCategory(data as any);
              setIsAddOpen(false); setEditCat(null);
            }catch(e:any){ alert(e.message); }
          }}
          language={language}
        />
      )}
    </div>
  );
};

const CategoryFormModal: React.FC<{category:Category|null; onClose:()=>void; onSave:(data:any)=>Promise<void>; language:string}> = ({category, onClose, onSave, language})=>{
  const isAr = language==='ar';
  const isEdit = !!category;
  const [form, setForm] = useState({
    slug: category?.slug || '',
    nameAr: category?.name.ar || '',
    nameEn: category?.name.en || '',
    descAr: category?.description?.ar || '',
    descEn: category?.description?.en || '',
    icon: category?.icon || 'Tag',
    color: category?.color || '#DFAB44',
    sortOrder: category?.sortOrder ?? 0,
    isActive: category?.isActive!==false,
  });
  const [saving,setSaving]=useState(false);

  // auto slug from english name if creating
  const handleNameEnChange = (v:string)=>{
    setForm(f=> ({...f, nameEn:v, slug: !isEdit && !f.slug ? v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') : f.slug }));
  };

  const submit = async ()=>{
    if(!form.nameAr.trim() || !form.nameEn.trim()) return alert(isAr ? 'الاسم العربي والإنجليزي مطلوب' : 'Both names required');
    if(!form.slug.trim()) return alert('Slug required');
    setSaving(true);
    await onSave({
      slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9-_]+/g,'-'),
      name: { ar: form.nameAr.trim(), en: form.nameEn.trim() },
      description: (form.descAr.trim()||form.descEn.trim()) ? { ar: form.descAr.trim(), en: form.descEn.trim() } : undefined,
      icon: form.icon,
      color: form.color,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200 rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white p-5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-stone-900 font-black flex items-center gap-2">{isEdit ? <Edit3 className="w-5 h-5 text-[#DFAB44]"/> : <PlusCircle className="w-5 h-5 text-[#DFAB44]"/>}{isEdit ? (isAr?'تعديل الفئة':'Edit Category') : (isAr?'إضافة فئة جديدة':'Add New Category')}</h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-white text-stone-400"><X className="w-4 h-4"/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-xs font-bold text-stone-300">{isAr?'الاسم العربي *':'Arabic Name *'}</span>
              <input value={form.nameAr} onChange={e=>setForm({...form,nameAr:e.target.value})} placeholder="اقتصادية" className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-500 focus:border-[#C9922C] focus:outline-none"/>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold text-stone-300">{isAr?'الاسم الإنجليزي *':'English Name *'}</span>
              <input value={form.nameEn} onChange={e=>handleNameEnChange(e.target.value)} placeholder="Economy" className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-500 focus:border-[#C9922C] focus:outline-none"/>
            </label>
          </div>
          <label className="space-y-1 block">
            <span className="text-xs font-bold text-stone-300">Slug * <span className="text-stone-500 font-normal">(a-z,0-9,-)</span></span>
            <input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g,'-')})} placeholder="economy" className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm font-mono text-[#DFAB44] focus:border-[#C9922C] focus:outline-none"/>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-xs font-bold text-stone-300">{isAr?'الوصف العربي':'Arabic Description'}</span>
              <textarea value={form.descAr} onChange={e=>setForm({...form,descAr:e.target.value})} rows={2} placeholder="وصف الفئة..." className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-500 focus:border-[#C9922C] focus:outline-none"/>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold text-stone-300">{isAr?'الوصف الإنجليزي':'English Description'}</span>
              <textarea value={form.descEn} onChange={e=>setForm({...form,descEn:e.target.value})} rows={2} placeholder="Category description..." className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-500 focus:border-[#C9922C] focus:outline-none"/>
            </label>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="space-y-1">
              <span className="text-xs font-bold text-stone-300">{isAr?'الأيقونة':'Icon'}</span>
              <select value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 focus:border-[#C9922C] focus:outline-none">
                {iconOptions.map(ic=><option key={ic} value={ic}>{ic}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold text-stone-300">{isAr?'اللون':'Color'}</span>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={e=>setForm({...form,color:e.target.value})} className="w-12 h-[42px] rounded-xl border border-stone-200 bg-white p-1"/>
                <input value={form.color} onChange={e=>setForm({...form,color:e.target.value})} className="flex-1 rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm font-mono text-stone-900 focus:border-[#C9922C] focus:outline-none"/>
              </div>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-bold text-stone-300">{isAr?'الترتيب':'Sort Order'}</span>
              <input type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:Number(e.target.value)})} className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm font-mono text-stone-900 focus:border-[#C9922C] focus:outline-none"/>
            </label>
          </div>
          <label className="flex items-center gap-2 p-3 rounded-xl bg-white border border-stone-200 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="w-4 h-4 rounded"/>
            <span className="text-sm font-bold text-stone-900">{isAr?'فئة نشطة (تظهر في الفلاتر والحجز)':'Active (visible in filters & booking)'}</span>
          </label>
          {isEdit && <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-950/30 border border-amber-900/50 rounded-xl p-3"><AlertTriangle className="w-4 h-4 shrink-0"/>{isAr?'تغيير الرمز سيؤثر على السيارات المرتبطة بهذه الفئة':'Changing slug will affect vehicles linked to this category'}</div>}
        </div>
        <div className="sticky bottom-0 bg-white p-4 border-t border-stone-200 flex gap-2">
          <button disabled={saving} onClick={submit} className="flex-1 py-3 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/>{saving ? (isAr?'جاري الحفظ...':'Saving...') : (isAr?'حفظ الفئة':'Save Category')}</button>
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white text-stone-900 text-sm font-bold border border-stone-200">{isAr?'إلغاء':'Cancel'}</button>
        </div>
      </div>
    </div>
  );
};




