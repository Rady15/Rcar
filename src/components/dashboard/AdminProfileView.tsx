import React, { useState } from 'react';
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  CalendarDays,
  LogOut,
  Save,
  IdCard,
  Car,
  Users,
  Building2,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiPatch } from '../../lib/api';
import { AppUser } from '../../types';

const roleLabel = (role: string, ar: boolean): string => {
  if (role === 'admin') return ar ? 'مدير النظام' : 'System Administrator';
  if (role === 'staff') return ar ? 'موظف' : 'Staff';
  return ar ? 'عميل' : 'Customer';
};

const tierLabel = (tier: string): string => {
  if (tier === 'gold') return 'Gold';
  if (tier === 'platinum') return 'Platinum';
  return 'Silver';
};

export const AdminProfileView: React.FC = () => {
  const { language, currentUser, cars, branches, usersList, userBookings, showToast, updateCurrentUser, logout } = useApp();
  const ar = language === 'ar';

  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  const memberSince =
    currentUser.createdAt
      ? (() => {
          const t = new Date(currentUser.createdAt);
          if (!isNaN(t.getTime())) return t.toLocaleDateString(ar ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          return String(currentUser.createdAt);
        })()
      : '—';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return showToast('error', ar ? 'الاسم مطلوب' : 'Name is required', '');
    setSaving(true);
    try {
      const res = await apiPatch<{ user: AppUser }>('/api/auth/me', { fullName: fullName.trim(), phone: phone.trim() });
      if (res?.user) updateCurrentUser(res.user);
      setFullName(res?.user?.fullName || '');
      setPhone(res?.user?.phone || '');
      showToast('success', ar ? 'تم حفظ البيانات' : 'Profile saved', '');
    } catch (err: any) {
      showToast('error', ar ? 'فشل الحفظ' : 'Save failed', err?.message || '');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return showToast('error', ar ? 'كلمة المرور 8 خانات على الأقل' : 'Password must be at least 8 characters', '');
    if (newPassword !== confirmPassword) return showToast('error', ar ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match', '');
    setChanging(true);
    try {
      const res = await apiPatch<{ user: AppUser }>('/api/auth/me', { currentPassword, newPassword });
      if (res?.user) updateCurrentUser(res.user);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      showToast('success', ar ? 'تم تغيير كلمة المرور' : 'Password changed', '');
    } catch (err: any) {
      showToast('error', ar ? 'فشل التغيير' : 'Password change failed', err?.message || '');
    } finally {
      setChanging(false);
    }
  };

  const stats = [
    { icon: Car, label: ar ? 'الحجوزات' : 'Bookings', value: userBookings.length },
    { icon: Users, label: ar ? 'العملاء' : 'Customers', value: usersList.length },
    { icon: Building2, label: ar ? 'الفروع' : 'Branches', value: branches.length },
    { icon: IdCard, label: ar ? 'الأسطول' : 'Fleet', value: cars.length }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E1B18] via-[#241F1A] to-[#1E1B18] border border-stone-200 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-[#1C1917] font-black shadow-md shadow-[#C9922C]/20">
              <UserRound className="w-5 h-5 text-[#1C1917]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">{ar ? 'الملف الشخصي' : 'Profile'}</h2>
              <p className="text-xs text-stone-400">{ar ? 'بيانات حسابك وإعداداته من مكان واحد' : 'Your account data & settings in one place'}</p>
            </div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
          {ar ? 'نشط' : 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Identity card */}
        <section className="dashboard-panel p-6">
          <div className="dashboard-panel-head mb-4">
            <div><h3>{ar ? 'بطاقة الحساب' : 'Account card'}</h3><p>{ar ? 'هوية المستخدم والدور والانضمام' : 'Identity, role & membership'}</p></div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl gold-gradient-bg flex items-center justify-center text-[#1C1917] text-3xl font-black shadow-md shadow-[#C9922C]/25">
              {(currentUser.fullName || 'U').charAt(0).toUpperCase()}
            </div>
            <h4 className="mt-3 text-lg font-black text-stone-900">{currentUser.fullName || '—'}</h4>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              {roleLabel(currentUser.role, ar)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
              <Star size={14} className="text-amber-500" />
              {tierLabel(currentUser.loyaltyTier)} · {currentUser.loyaltyPoints} {ar ? 'نقطة ولاء' : 'loyalty points'}
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-sm">
            <div className="flex items-center gap-2.5 text-stone-600"><Mail size={16} className="text-[#8c87a6] shrink-0" /><span dir="ltr" className="font-mono text-[13px]">{currentUser.email || '—'}</span></div>
            <div className="flex items-center gap-2.5 text-stone-600"><Phone size={16} className="text-[#8c87a6] shrink-0" /><span dir="ltr">{currentUser.phone || '—'}</span></div>
            <div className="flex items-center gap-2.5 text-stone-600"><IdCard size={16} className="text-[#8c87a6] shrink-0" /><span>{currentUser.idNumber || '—'}{currentUser.nationality ? ` · ${currentUser.nationality}` : ''}</span></div>
            <div className="flex items-center gap-2.5 text-stone-600"><CalendarDays size={16} className="text-[#8c87a6] shrink-0" /><span>{ar ? 'عضو منذ' : 'Member since'} {memberSince}</span></div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-stone-200 bg-white py-3 flex flex-col items-center gap-1">
                <Icon size={15} className="text-[#42339b]" />
                <strong className="text-lg font-black text-stone-900">{value}</strong>
                <span className="text-[10px] text-stone-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Settings card */}
        <section className="dashboard-panel p-6 space-y-6">
          <div className="dashboard-panel-head">
            <div><h3>{ar ? 'معلومات الحساب' : 'Account information'}</h3><p>{ar ? 'تعديل الاسم ورقم الجوال' : 'Update your name & phone'}</p></div>
          </div>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700">{ar ? 'الاسم الكامل' : 'Full name'}</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/60 outline-none bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700">{ar ? 'رقم الجوال' : 'Phone'}</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/60 outline-none bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl gold-gradient-bg text-[#1C1917] font-black text-xs px-4 py-2.5 shadow-md shadow-[#C9922C]/20 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
            >
              <Save size={14} className="text-[#1C1917]" />
              {saving ? (ar ? 'جارٍ الحفظ...' : 'Saving...') : ar ? 'حفظ البيانات' : 'Save changes'}
            </button>
          </form>

          <div className="border-t border-stone-200 pt-5">
            <div className="dashboard-panel-head mb-3">
              <div><h3>{ar ? 'تغيير كلمة المرور' : 'Change password'}</h3><p>{ar ? 'استخدم كلمة مرور قوية جديدة' : 'Use a strong new password'}</p></div>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                placeholder={ar ? 'كلمة المرور الحالية' : 'Current password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/60 outline-none bg-white"
              />
              <input
                type="password"
                placeholder={ar ? 'كلمة المرور الجديدة (8+ خانات)' : 'New password (8+ chars)'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/60 outline-none bg-white"
              />
              <input
                type="password"
                placeholder={ar ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/60 outline-none bg-white"
              />
              <button
                type="submit"
                disabled={changing}
                className="flex items-center gap-2 rounded-xl bg-[#42339b] text-white font-black text-xs px-4 py-2.5 shadow-md shadow-[#42339b]/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                <KeyRound size={14} />
                {changing ? (ar ? 'جارٍ التغيير...' : 'Applying...') : ar ? 'تغيير كلمة المرور' : 'Change password'}
              </button>
            </form>
          </div>

          <div className="border-t border-stone-200 pt-5">
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-rose-500/10 text-rose-600 font-black text-xs px-4 py-2.5 border border-rose-200 transition-all hover:bg-rose-500/20 active:scale-95"
            >
              <LogOut size={14} />
              {ar ? 'تسجيل الخروج' : 'Sign out'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};