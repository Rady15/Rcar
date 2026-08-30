import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppUser } from '../../types';

interface AdminUsersViewProps {
  onOpenAddUserModal: () => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ onOpenAddUserModal }) => {
  const { language, usersList, toggleUserStatus, branches } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = usersList.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q);

    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم، البريد أو الهاتف...' : 'Search user...'}
            className="w-full bg-white border border-stone-200 rounded-xl py-2 ps-10 pe-4 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#C9922C]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200">
            {['all', 'admin', 'staff', 'user'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  roleFilter === r ? 'gold-gradient-bg text-[#1C1917]' : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                {r === 'all'
                  ? language === 'ar' ? 'الكل' : 'All'
                  : r === 'admin'
                  ? language === 'ar' ? 'المدراء' : 'Admins'
                  : r === 'staff'
                  ? language === 'ar' ? 'الموظفين' : 'Staff'
                  : language === 'ar' ? 'العملاء' : 'Clients'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenAddUserModal}
            className="gold-gradient-bg text-[#1C1917] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#C9922C]/20 border border-[#E9C682]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة مستخدم' : 'Add User'}</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden">
        <table className="w-full text-start text-xs">
          <thead className="bg-white text-stone-400 border-b border-stone-200 uppercase text-[11px] font-bold">
            <tr>
              <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'المستخدم' : 'User'}</th>
              <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الدور والصلاحية' : 'Role'}</th>
              <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الفرع التابع له' : 'Branch'}</th>
              <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'معلومات الاتصال' : 'Contact'}</th>
              <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الحالة' : 'Status'}</th>
              <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'تحكم' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C2621] text-stone-200">
            {filteredUsers.map((u) => {
              const branchObj = branches.find((b) => b.id === u.branchId);

              return (
                <tr key={u.id} className="hover:bg-white transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9922C] to-[#DFAB44] text-[#1C1917] font-bold flex items-center justify-center text-xs">
                        {u.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-xs">{u.fullName}</div>
                        <div className="text-[10px] text-stone-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-[#C9922C]/20 text-[#DFAB44] border border-[#C9922C]/30'
                          : u.role === 'staff'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-white text-stone-300'
                        }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-300">
                    {branchObj ? (
                      <span className="flex items-center gap-1 text-[11px]">
                        <Building2 className="w-3.5 h-3.5 text-[#DFAB44]" />
                        {language === 'ar' ? branchObj.name.ar : branchObj.name.en}
                      </span>
                    ) : (
                      <span className="text-stone-500">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400">{u.phone}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                        }`}
                    >
                      {u.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'موقوف' : 'Suspended')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u.id)}
                      className="px-2.5 py-1 rounded-lg bg-white text-stone-300 hover:text-stone-900 text-[10px] font-bold border border-stone-200"
                    >
                      {u.isActive ? (language === 'ar' ? 'تعليق' : 'Suspend') : (language === 'ar' ? 'تفعيل' : 'Activate')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};