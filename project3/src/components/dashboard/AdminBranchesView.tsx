import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  MapPin,
  Phone,
  Clock,
  Car as CarIcon,
  ShieldCheck,
  Edit3,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddBranchModal } from './Modals';
import { Branch } from '../../types';

interface AdminBranchesViewProps {
  onOpenAddBranchModal: () => void;
}

export const AdminBranchesView: React.FC<AdminBranchesViewProps> = ({ onOpenAddBranchModal }) => {
  const { language, branches, cars, deleteBranch } = useApp();
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#DFAB44]" />
            <span>{language === 'ar' ? 'شبكة الفروع' : 'Branch Network'}</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'ar'
              ? 'موزعة عبر كافة صالات المطارات الدولية والمراكز الحيوية بالمملكة'
              : 'Distributed across international airport terminals and city hubs'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddBranchModal}
          className="gold-gradient-bg text-[#1C1917] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#C9922C]/20 border border-[#E9C682]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة فرع' : 'Add Branch'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map((branch) => {
          const isAirport = branch.type === 'airport';
          const is24h = branch.workingHours.ar.includes('24');

          return (
            <div
              key={branch.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#C9922C]/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#DFAB44] font-bold">
                      {branch.id.toUpperCase()}
                    </span>
                    <h3 className="font-black text-stone-900 text-sm">
                      {language === 'ar' ? branch.name.ar : branch.name.en}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      isAirport
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-[#C9922C]/20 text-[#DFAB44] border border-[#C9922C]/30'
                    }`}
                  >
                    {isAirport
                      ? language === 'ar' ? 'صالة مطار' : 'Airport'
                      : language === 'ar' ? 'فرع رئيسي' : 'City Center'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#DFAB44] shrink-0" />
                    <span className="truncate">{language === 'ar' ? branch.address.ar : branch.address.en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="text-stone-300">
                      {language === 'ar' ? branch.workingHours.ar : branch.workingHours.en}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono text-stone-300">{branch.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs gap-2">
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'ar' ? 'نشط' : 'Active'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-400 font-mono me-2 hidden sm:inline">
                    {language === 'ar' ? branch.city.ar : branch.city.en}
                  </span>
                  <button type="button" onClick={() => setEditingBranch(branch)} className="p-1.5 rounded-lg bg-white text-stone-300 hover:text-stone-900 hover:bg-white border border-stone-200" title="تعديل">
                    <Edit3 className="w-3.5 h-3.5 text-[#DFAB44]" />
                  </button>
                  <button type="button" onClick={() => deleteBranch(branch.id)} className="p-1.5 rounded-lg bg-white text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 border border-stone-200" title="حذف">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {editingBranch && (
        <AddBranchModal isOpen={!!editingBranch} onClose={() => setEditingBranch(null)} branchToEdit={editingBranch} />
      )}
    </div>
  );
};


