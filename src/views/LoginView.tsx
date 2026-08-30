import React, { useEffect, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, ArrowLeft, UserRound, Phone, Chrome } from 'lucide-react';
import { apiPost } from '../lib/api';
import { useApp } from '../context/AppContext';
import { CarLoaderInline } from '../components/CarLoader';

export const LoginView: React.FC = () => {
  const { language, navigateTo, showToast, refreshAuth } = useApp() as any;
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      const messages: Record<string,string> = { google_not_configured:'Google Sign-In غير مُكوّن على الخادم', google_state:'انتهت جلسة Google، حاول مرة أخرى', google_cancelled:'تم إلغاء تسجيل الدخول بواسطة Google', google_token:'تعذر إكمال مصادقة Google', google_identity:'تعذر التحقق من حساب Google', google_email:'حساب Google لا يحتوي على بريد إلكتروني صالح', google_failed:'حدث خطأ أثناء تسجيل الدخول بواسطة Google', account_disabled:'هذا الحساب غير نشط' };
      showToast('error', language === 'ar' ? 'فشل تسجيل الدخول' : 'Sign-in failed', messages[error] || error);
      window.history.replaceState({}, '', '/login');
    }
  }, [language, showToast]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (mode === 'login') {
        await apiPost('/api/auth/login', { email, password });
        await refreshAuth();
        showToast('success', language === 'ar' ? 'تم تسجيل الدخول' : 'Signed in', language === 'ar' ? 'مرحبًا بك' : 'Welcome back');
      } else {
        await apiPost('/api/auth/register', { fullName, email, phone, password });
        await refreshAuth();
        showToast('success', language === 'ar' ? 'تم إنشاء الحساب' : 'Account created', language === 'ar' ? 'تم تسجيل دخولك تلقائيًا' : 'You are now signed in');
      }
      navigateTo('dashboard');
    } catch (err: any) {
      showToast('error', language === 'ar' ? 'تعذر إكمال العملية' : 'Unable to continue', err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-[#C9922C]/20"><ShieldCheck className="w-8 h-8 text-[#1C1917]" /></div>
          <h1 className="mt-5 text-3xl font-black text-stone-900">{mode==='login' ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign in') : (language === 'ar' ? 'إنشاء حساب' : 'Create account')}</h1>
          <p className="mt-2 text-sm text-stone-500">{language === 'ar' ? 'حسابك لإدارة الحجوزات والفواتير' : 'Manage bookings and invoices from your account'}</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-3xl border border-[#EDE4D3] shadow-xl p-6 sm:p-8 space-y-4">
          {mode==='register' && <>
            <label className="block"><span className="text-xs font-bold text-stone-700">الاسم الكامل</span><div className="mt-2 relative"><UserRound className="absolute start-3 top-3.5 w-4 h-4 text-stone-400"/><input value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 ps-10 pe-3 py-3 text-sm" required minLength={2}/></div></label>
            <label className="block"><span className="text-xs font-bold text-stone-700">رقم الجوال</span><div className="mt-2 relative"><Phone className="absolute start-3 top-3.5 w-4 h-4 text-stone-400"/><input dir="ltr" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 ps-10 pe-3 py-3 text-sm" required minLength={6}/></div></label>
          </>}
          <label className="block"><span className="text-xs font-bold text-stone-700">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span><div className="mt-2 relative"><Mail className="absolute start-3 top-3.5 w-4 h-4 text-stone-400"/><input dir="ltr" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 ps-10 pe-3 py-3 text-sm" required/></div></label>
          <label className="block"><span className="text-xs font-bold text-stone-700">{language === 'ar' ? 'كلمة المرور' : 'Password'}</span><div className="mt-2 relative"><LockKeyhole className="absolute start-3 top-3.5 w-4 h-4 text-stone-400"/><input dir="ltr" type="password" autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 ps-10 pe-3 py-3 text-sm" minLength={12} required/></div>{mode==='register' && <span className="text-[11px] text-stone-400">12 حرفًا على الأقل</span>}</label>
          <button disabled={loading} className="w-full rounded-xl gold-gradient-bg py-3 font-black text-sm text-[#1C1917] disabled:opacity-60 flex items-center justify-center gap-2">{loading?<><CarLoaderInline size={22}/><span>جاري التنفيذ...</span></>:<span>{mode==='login'?'دخول آمن':'إنشاء الحساب'}</span>}</button>
          <div className="relative py-1"><div className="border-t border-stone-200"/><span className="absolute inset-x-0 -top-2.5 mx-auto w-fit bg-white px-3 text-[10px] text-stone-400">أو</span></div>
          <button type="button" onClick={()=>{window.location.href='/api/auth/google'}} className="w-full rounded-xl border border-stone-200 bg-white py-3 font-black text-sm text-stone-800 flex items-center justify-center gap-2 hover:bg-stone-50"><Chrome className="w-4 h-4"/> التسجيل / الدخول بواسطة Google</button>
          <button type="button" onClick={()=>setMode(mode==='login'?'register':'login')} className="w-full py-2 text-xs font-bold text-[#A47018] hover:text-stone-900">{mode==='login'?'ليس لديك حساب؟ إنشاء حساب':'لديك حساب بالفعل؟ تسجيل الدخول'}</button>
          <button type="button" onClick={()=>navigateTo('home')} className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4"/>العودة للموقع</button>
        </form>
      </div>
    </div>
  );
};
