import React, { useState, useEffect } from 'react';
import { Save, Trash2, CreditCard, Database, ShieldCheck, PlusCircle, Edit3, Eye, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const sections = [
  ['offers','العروض','Offers'], ['used-cars','السيارات المستعملة','Used Cars'], ['loyalty','الولاء','Loyalty'],
  ['subscriptions','الاشتراكات','Subscriptions'], ['protection-plans','الحماية والتأمين','Protection Plans'], ['addons','الإضافات','Add-ons'], ['faq','الأسئلة الشائعة','FAQ'], ['used-car-leads','طلبات تجربة المستعمل','Used Car Leads']
] as const;

function Field({label, children}:{label:string, children:React.ReactNode}) {
  return <label className="space-y-1 block"><span className="text-xs font-bold text-stone-700">{label}</span>{children}</label>;
}
function Input(props:any){ return <input {...props} className={`w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#C9922C] focus:ring-2 focus:ring-[#C9922C]/20 ${props.className||''}`} /> }
function Textarea(props:any){ return <textarea {...props} className={`w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#C9922C] focus:ring-2 focus:ring-[#C9922C]/20 ${props.className||''}`} /> }

export const AdminContentView: React.FC = () => {
  const { language, offers, usedCars, loyaltyTiers, subscriptions, protectionPlans, addonOptions, faqs, saveContentItem, deleteContentItem, paymentSettings, updatePaymentSettings, showToast } = useApp() as any;
  const isAr = language==='ar';
  const [tab,setTab]=useState<string>('offers');
  const [payment,setPayment]=useState<any>({...paymentSettings,apiKey:'',webhookSecret:''});
  const data:any={offers, 'used-cars':usedCars, loyalty:loyaltyTiers, subscriptions, 'protection-plans':protectionPlans, addons:addonOptions, faq:faqs};
  useEffect(()=>setPayment({...paymentSettings,apiKey:'',webhookSecret:''}),[paymentSettings]);
  const [leads,setLeads]=useState<any[]>([]);
  useEffect(()=>{if(tab==='used-car-leads') fetch('/api/content/used-car-leads',{credentials:'include'}).then(r=>r.ok?r.json():[]).then(setLeads).catch(()=>setLeads([]));},[tab]);
  if(tab==='used-car-leads') data['used-car-leads']=leads;
  const rows=data[tab]||[];

  const [isFormOpen,setIsFormOpen]=useState(false);
  const [formData,setFormData]=useState<any>({});

  const openNew = ()=>{
    const base:any={id:`${tab}-${Date.now()}`};
    if(tab==='offers') Object.assign(base,{title:{ar:'',en:''},description:{ar:'',en:''},discount:'',code:'',badge:{ar:'',en:''},validUntil:new Date().toISOString().slice(0,10),category:'daily',image:'',isActive:true});
    if(tab==='used-cars') Object.assign(base,{name:{ar:'',en:''},brand:'',year:2023,modelYear:2023,mileage:0,price:0,city:{ar:'الرياض',en:'Riyadh'},monthlyInstallment:0,inspectionPassed:true,warrantyMonths:12,warranty:{ar:'',en:''},image:'',specs:{ar:[],en:[]},category:'Sedan'});
    if(tab==='loyalty') Object.assign(base,{id:'silver',name:{ar:'',en:''},minRentals:0,qualifyingRentals:{ar:'',en:''},discountPercentage:5,color:'#C9922C',benefits:{ar:[],en:[]},perks:{ar:[],en:[]},multiplier:1});
    if(tab==='subscriptions') Object.assign(base,{tier:{ar:'',en:''},monthlyPrice:0,sampleCars:{ar:[],en:[]},includedKmPerMonth:3000,image:'',features:{ar:[],en:[]}});
    if(tab==='protection-plans') Object.assign(base,{name:{ar:'',en:''},description:{ar:'',en:''},pricePerDay:0,deductible:0,features:{ar:[],en:[]},recommended:false});
    if(tab==='addons') Object.assign(base,{name:{ar:'',en:''},description:{ar:'',en:''},pricePerDay:0,icon:'Baby',maxQuantity:1});
    if(tab==='faq') Object.assign(base,{category:'booking',question:{ar:'',en:''},answer:{ar:'',en:''}});
    setFormData(base); setIsFormOpen(true);
  };
  const openEdit = (item:any)=>{ setFormData({...item}); setIsFormOpen(true); };
  const savePayment=async()=>{try{await updatePaymentSettings(payment);showToast('success',isAr?'تم حفظ إعدادات الدفع':'Payment settings saved','');}catch(e:any){showToast('error','Payment settings',e.message)}};

  const handleSave = async()=>{
    try{
      // normalize arrays from comma strings if needed
      const toSave = {...formData};
      // convert specs/benefits etc if they are strings
      ['specs','benefits','perks','features','sampleCars'].forEach(k=>{
        if(toSave[k] && typeof toSave[k].ar === 'string') toSave[k]={ar: toSave[k].ar.split('\n').map((s:string)=>s.trim()).filter(Boolean), en: toSave[k].en.split('\n').map((s:string)=>s.trim()).filter(Boolean)};
        if(toSave[k] && Array.isArray(toSave[k].ar)===false && typeof toSave[k].ar === 'object'){} // keep
      });
      await saveContentItem(tab as any, toSave);
      setIsFormOpen(false);
      showToast('success', isAr?'تم الحفظ':'Saved', isAr?'تم حفظ البيانات بنجاح':'Saved successfully');
    }catch(e:any){ showToast('error', e.message||'Save failed',''); }
  };

  // helper to update nested localized field
  const setLoc = (key:string, lang:'ar'|'en', val:string)=> setFormData((p:any)=> ({...p, [key]: {...(p[key]||{ar:'',en:''}), [lang]: val } as any}));
  const setArrLoc = (key:string, lang:'ar'|'en', val:string)=> {
    const arr = val.split('\n');
    setFormData((p:any)=> ({...p, [key]: {...(p[key]||{ar:[],en:[]}), [lang]: arr} as any}));
  };

  return <div className="space-y-6">
    <div className="p-6 rounded-2xl bg-white border border-stone-200 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center"><Database className="w-5 h-5 text-[#1C1917]"/></div>
      <div><h2 className="text-xl font-black text-stone-900">{isAr?'مركز المحتوى والإعدادات':'Content & Settings Center'}</h2><p className="text-xs text-stone-500">{isAr?'إدارة محتوى الموقع بدون أكواد - واجهة سهلة':'Manage website content easily - no coding required'}</p></div>
    </div>
    <div className="flex flex-wrap gap-2">
      {sections.map(([id,ar,en])=><button key={id} onClick={()=>setTab(id)} className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${tab===id?'gold-gradient-bg text-[#1C1917] border-[#E9C682] shadow-md':'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}>{isAr?ar:en}</button>)}
      <button onClick={()=>setTab('payments')} className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border ${tab==='payments'?'gold-gradient-bg text-[#1C1917] border-[#E9C682]':'bg-white text-stone-600 border-stone-200'}`}><CreditCard className="w-4 h-4"/>{isAr?'بوابة الدفع':'Payments'}</button>
    </div>
    {tab==='payments' ? <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5 shadow-sm">
      <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#DFAB44]"/><h3 className="text-stone-900 font-black">{isAr?'إعدادات بوابة الدفع':'Payment Gateway Configuration'}</h3></div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Provider"><Input value={payment.provider||''} onChange={e=>setPayment({...payment,provider:e.target.value})} /></Field>
        <Field label="API URL"><Input value={payment.apiUrl||''} onChange={e=>setPayment({...payment,apiUrl:e.target.value})} /></Field>
        <Field label="Public Key"><Input value={payment.publicKey||''} onChange={e=>setPayment({...payment,publicKey:e.target.value})} /></Field>
        <Field label={`Secret API Key ${paymentSettings.hasApiKey?'✓':''}`}><Input type="password" value={payment.apiKey||''} placeholder={isAr?'اتركه فارغا للاحتفاظ':'Leave blank to keep'} onChange={e=>setPayment({...payment,apiKey:e.target.value})} /></Field>
        <Field label={`Webhook Secret ${paymentSettings.hasWebhookSecret?'✓':''}`}><Input type="password" value={payment.webhookSecret||''} placeholder={isAr?'اتركه فارغا':'Leave blank'} onChange={e=>setPayment({...payment,webhookSecret:e.target.value})} /></Field>
        <Field label="Environment"><select value={payment.environment||'test'} onChange={e=>setPayment({...payment,environment:e.target.value})} className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm"><option value="test">Test</option><option value="live">Live</option></select></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-900"><input type="checkbox" checked={Boolean(payment.enabled)} onChange={e=>setPayment({...payment,enabled:e.target.checked})}/>{isAr?'تفعيل الدفع الإلكتروني':'Enable online payments'}</label>
      <button onClick={savePayment} className="px-5 py-3 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-sm flex items-center gap-2"><Save className="w-4 h-4"/> {isAr?'حفظ الإعدادات':'Save Settings'}</button>
    </div> : <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500 font-medium">{rows.length} {isAr?'عنصر':'items'}</span>
        {tab!=='used-car-leads' && <button onClick={openNew} className="px-4 py-2.5 rounded-xl gold-gradient-bg text-[#1C1917] text-xs font-black flex items-center gap-2 shadow-md border border-[#E9C682]"><PlusCircle className="w-4 h-4"/>{isAr?'إضافة جديد':'Add New'}</button>}
      </div>

      <div className="grid gap-3">
        {rows.map((item:any)=>(
          <div key={item.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-3 min-w-0 flex-1">
              {item.image && <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"/>}
              <div className="min-w-0 flex-1">
                <div className="text-stone-900 font-bold text-sm truncate">{item.title?.ar||item.title?.en||item.name?.ar||item.name?.en||item.question?.ar||item.question?.en||item.tier?.ar||item.id}</div>
                <div className="text-xs text-stone-500 truncate mt-0.5">{item.description?.ar||item.description?.en||item.answer?.ar||item.excerpt?.ar||item.brand||item.category||item.code||''}</div>
                <div className="text-[11px] text-stone-400 font-mono mt-1 flex flex-wrap gap-2">
                  {item.code && <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200"> {item.code} </span>}
                  {item.discount && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{item.discount}</span>}
                  {item.price && <span>{item.price} SAR</span>}
                  {item.monthlyPrice && <span>{item.monthlyPrice} SAR/شهر</span>}
                  {item.category && <span> {item.category} </span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {tab==='used-car-leads' ? <span className="text-xs text-stone-400">{item.customerName||item.createdAt}</span> :
              <>
                <button onClick={()=>openEdit(item)} className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5 text-[#C9922C]"/>{isAr?'تعديل':'Edit'}</button>
                <button onClick={()=> deleteContentItem(tab as any,item.id)} className="p-2.5 rounded-xl bg-white border border-stone-200 text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4"/></button>
              </>}
            </div>
          </div>
        ))}
        {rows.length===0 && <div className="text-center py-12 text-stone-400 text-sm bg-white border border-stone-200 rounded-2xl">{isAr?'لا توجد عناصر بعد':'No items yet'}</div>}
      </div>
    </div>}

    {isFormOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>setIsFormOpen(false)} />
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200">
          <div className="sticky top-0 bg-white border-b border-stone-200 p-5 flex items-center justify-between">
            <h3 className="font-black text-stone-900 flex items-center gap-2"><Edit3 className="w-5 h-5 text-[#C9922C]"/>{formData.id?.includes('-') ? (isAr?'تعديل':'Edit') : (isAr?'إضافة':'Add')} - {sections.find(s=>s[0]===tab)?.[isAr?1:2] || tab}</h3>
            <button onClick={()=>setIsFormOpen(false)} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200"><X className="w-4 h-4"/></button>
          </div>
          <div className="p-5 space-y-4">
            {/* Generic fields per tab */}
            {tab==='offers' && <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr?'العنوان عربي *':'Title AR *'}><Input value={formData.title?.ar||''} onChange={e=>setLoc('title','ar',e.target.value)} placeholder="عرض نهاية الأسبوع" /></Field>
                <Field label={isAr?'Title EN *':'Title EN *'}><Input value={formData.title?.en||''} onChange={e=>setLoc('title','en',e.target.value)} placeholder="Weekend Offer" /></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr?'الوصف عربي':'Description AR'}><Textarea rows={2} value={formData.description?.ar||''} onChange={e=>setLoc('description','ar',e.target.value)} /></Field>
                <Field label="Description EN"><Textarea rows={2} value={formData.description?.en||''} onChange={e=>setLoc('description','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Code"><Input value={formData.code||''} onChange={e=>setFormData({...formData,code:e.target.value.toUpperCase()})} placeholder="WEEKEND20" /></Field>
                <Field label="Discount"><Input value={formData.discount||''} onChange={e=>setFormData({...formData,discount:e.target.value})} placeholder="20%" /></Field>
                <Field label="Category"><select value={formData.category||'daily'} onChange={e=>setFormData({...formData,category:e.target.value})} className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm"><option value="daily">daily</option><option value="monthly">monthly</option><option value="weekend">weekend</option><option value="airport">airport</option><option value="partner">partner</option></select></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr?'الشارة عربي':'Badge AR'}><Input value={formData.badge?.ar||''} onChange={e=>setLoc('badge','ar',e.target.value)} /></Field>
                <Field label="Badge EN"><Input value={formData.badge?.en||''} onChange={e=>setLoc('badge','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Valid Until"><Input type="date" value={formData.validUntil||''} onChange={e=>setFormData({...formData,validUntil:e.target.value})} /></Field>
                <Field label="Image URL"><Input value={formData.image||''} onChange={e=>setFormData({...formData,image:e.target.value})} placeholder="https://..." /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isActive!==false} onChange={e=>setFormData({...formData,isActive:e.target.checked})}/>{isAr?'نشط':'Active'}</label>
            </>}
            {tab==='faq' && <>
              <Field label="Category"><select value={formData.category||'booking'} onChange={e=>setFormData({...formData,category:e.target.value})} className="w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm"><option value="booking">booking</option><option value="insurance">insurance</option><option value="payments">payments</option><option value="requirements">requirements</option><option value="traffic">traffic</option><option value="general">general</option></select></Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr?'السؤال عربي':'Question AR'}><Textarea rows={2} value={formData.question?.ar||''} onChange={e=>setLoc('question','ar',e.target.value)} /></Field>
                <Field label="Question EN"><Textarea rows={2} value={formData.question?.en||''} onChange={e=>setLoc('question','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={isAr?'الإجابة عربي':'Answer AR'}><Textarea rows={4} value={formData.answer?.ar||''} onChange={e=>setLoc('answer','ar',e.target.value)} /></Field>
                <Field label="Answer EN"><Textarea rows={4} value={formData.answer?.en||''} onChange={e=>setLoc('answer','en',e.target.value)} /></Field>
              </div>
            </>}
            {tab==='protection-plans' && <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name AR"><Input value={formData.name?.ar||''} onChange={e=>setLoc('name','ar',e.target.value)} /></Field>
                <Field label="Name EN"><Input value={formData.name?.en||''} onChange={e=>setLoc('name','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Description AR"><Textarea rows={2} value={formData.description?.ar||''} onChange={e=>setLoc('description','ar',e.target.value)} /></Field>
                <Field label="Description EN"><Textarea rows={2} value={formData.description?.en||''} onChange={e=>setLoc('description','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Price/Day"><Input type="number" value={formData.pricePerDay||0} onChange={e=>setFormData({...formData,pricePerDay:Number(e.target.value)})} /></Field>
                <Field label="Deductible"><Input type="number" value={formData.deductible||0} onChange={e=>setFormData({...formData,deductible:Number(e.target.value)})} /></Field>
                <Field label="Recommended"><label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={!!formData.recommended} onChange={e=>setFormData({...formData,recommended:e.target.checked})}/> {isAr?'مستحسن':'Recommended'}</label></Field>
              </div>
              <Field label={isAr?'المميزات (كل سطر ميزة) عربي':'Features AR (one per line)'}><Textarea rows={3} value={Array.isArray(formData.features?.ar)? formData.features.ar.join('\n') : formData.features?.ar||''} onChange={e=>setArrLoc('features','ar',e.target.value)} /></Field>
              <Field label="Features EN"><Textarea rows={3} value={Array.isArray(formData.features?.en)? formData.features.en.join('\n') : formData.features?.en||''} onChange={e=>setArrLoc('features','en',e.target.value)} /></Field>
            </>}
            {tab==='addons' && <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name AR"><Input value={formData.name?.ar||''} onChange={e=>setLoc('name','ar',e.target.value)} /></Field>
                <Field label="Name EN"><Input value={formData.name?.en||''} onChange={e=>setLoc('name','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Description AR"><Textarea rows={2} value={formData.description?.ar||''} onChange={e=>setLoc('description','ar',e.target.value)} /></Field>
                <Field label="Description EN"><Textarea rows={2} value={formData.description?.en||''} onChange={e=>setLoc('description','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Price/Day"><Input type="number" value={formData.pricePerDay||0} onChange={e=>setFormData({...formData,pricePerDay:Number(e.target.value)})} /></Field>
                <Field label="Icon"><Input value={formData.icon||''} onChange={e=>setFormData({...formData,icon:e.target.value})} placeholder="Baby" /></Field>
                <Field label="Max Qty"><Input type="number" value={formData.maxQuantity||1} onChange={e=>setFormData({...formData,maxQuantity:Number(e.target.value)})} /></Field>
              </div>
            </>}
            {tab==='subscriptions' && <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Tier AR"><Input value={formData.tier?.ar||''} onChange={e=>setLoc('tier','ar',e.target.value)} /></Field>
                <Field label="Tier EN"><Input value={formData.tier?.en||''} onChange={e=>setLoc('tier','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Monthly Price"><Input type="number" value={formData.monthlyPrice||0} onChange={e=>setFormData({...formData,monthlyPrice:Number(e.target.value)})} /></Field>
                <Field label="Included KM"><Input type="number" value={formData.includedKmPerMonth||0} onChange={e=>setFormData({...formData,includedKmPerMonth:Number(e.target.value)})} /></Field>
              </div>
              <Field label="Image URL"><Input value={formData.image||''} onChange={e=>setFormData({...formData,image:e.target.value})} /></Field>
              <Field label="Sample Cars AR (one per line)"><Textarea rows={2} value={Array.isArray(formData.sampleCars?.ar)? formData.sampleCars.ar.join('\n'): formData.sampleCars?.ar||''} onChange={e=>setArrLoc('sampleCars','ar',e.target.value)} /></Field>
              <Field label="Sample Cars EN"><Textarea rows={2} value={Array.isArray(formData.sampleCars?.en)? formData.sampleCars.en.join('\n'): formData.sampleCars?.en||''} onChange={e=>setArrLoc('sampleCars','en',e.target.value)} /></Field>
              <Field label="Features AR"><Textarea rows={3} value={Array.isArray(formData.features?.ar)? formData.features.ar.join('\n'): formData.features?.ar||''} onChange={e=>setArrLoc('features','ar',e.target.value)} /></Field>
              <Field label="Features EN"><Textarea rows={3} value={Array.isArray(formData.features?.en)? formData.features.en.join('\n'): formData.features?.en||''} onChange={e=>setArrLoc('features','en',e.target.value)} /></Field>
            </>}
            {tab==='loyalty' && <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name AR"><Input value={formData.name?.ar||''} onChange={e=>setLoc('name','ar',e.target.value)} /></Field>
                <Field label="Name EN"><Input value={formData.name?.en||''} onChange={e=>setLoc('name','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Min Rentals"><Input type="number" value={formData.minRentals||0} onChange={e=>setFormData({...formData,minRentals:Number(e.target.value)})} /></Field>
                <Field label="Discount %"><Input type="number" value={formData.discountPercentage||0} onChange={e=>setFormData({...formData,discountPercentage:Number(e.target.value)})} /></Field>
                <Field label="Color"><Input type="color" value={formData.color||'#C9922C'} onChange={e=>setFormData({...formData,color:e.target.value})} /></Field>
              </div>
              <Field label="Benefits AR (one per line)"><Textarea rows={3} value={Array.isArray(formData.benefits?.ar)? formData.benefits.ar.join('\n'): formData.benefits?.ar||''} onChange={e=>setArrLoc('benefits','ar',e.target.value)} /></Field>
              <Field label="Benefits EN"><Textarea rows={3} value={Array.isArray(formData.benefits?.en)? formData.benefits.en.join('\n'): formData.benefits?.en||''} onChange={e=>setArrLoc('benefits','en',e.target.value)} /></Field>
            </>}
            {tab==='used-cars' && <>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name AR"><Input value={formData.name?.ar||''} onChange={e=>setLoc('name','ar',e.target.value)} /></Field>
                <Field label="Name EN"><Input value={formData.name?.en||''} onChange={e=>setLoc('name','en',e.target.value)} /></Field>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Brand"><Input value={formData.brand||''} onChange={e=>setFormData({...formData,brand:e.target.value})} /></Field>
                <Field label="Year"><Input type="number" value={formData.year||2023} onChange={e=>setFormData({...formData,year:Number(e.target.value)})} /></Field>
                <Field label="Price"><Input type="number" value={formData.price||0} onChange={e=>setFormData({...formData,price:Number(e.target.value)})} /></Field>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Mileage"><Input type="number" value={formData.mileage||0} onChange={e=>setFormData({...formData,mileage:Number(e.target.value)})} /></Field>
                <Field label="City AR"><Input value={formData.city?.ar||''} onChange={e=>setLoc('city','ar',e.target.value)} /></Field>
                <Field label="City EN"><Input value={formData.city?.en||''} onChange={e=>setLoc('city','en',e.target.value)} /></Field>
              </div>
              <Field label="Image URL"><Input value={formData.image||''} onChange={e=>setFormData({...formData,image:e.target.value})} /></Field>
              <Field label="Specs AR (one per line)"><Textarea rows={2} value={Array.isArray(formData.specs?.ar)? formData.specs.ar.join('\n'): formData.specs?.ar||''} onChange={e=>setArrLoc('specs','ar',e.target.value)} /></Field>
              <Field label="Specs EN"><Textarea rows={2} value={Array.isArray(formData.specs?.en)? formData.specs.en.join('\n'): formData.specs?.en||''} onChange={e=>setArrLoc('specs','en',e.target.value)} /></Field>
            </>}
          </div>
          <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4 flex gap-2">
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-sm flex items-center justify-center gap-2"><Save className="w-4 h-4"/>{isAr?'حفظ':'Save'}</button>
            <button onClick={()=>setIsFormOpen(false)} className="px-6 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold border border-stone-200">{isAr?'إلغاء':'Cancel'}</button>
          </div>
        </div>
      </div>
    )}
  </div>
}
