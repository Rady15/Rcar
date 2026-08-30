import React, { useState } from 'react';
import {
  Car as CarIcon,
  PlusCircle,
  Search,
  Filter,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Gauge,
  Fuel,
  Users,
  DollarSign,
  Eye,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Car } from '../../types';

interface AdminFleetViewProps {
  onOpenAddCarModal: () => void;
  onEditCar: (car: Car) => void;
}

export const AdminFleetView: React.FC<AdminFleetViewProps> = ({
  onOpenAddCarModal,
  onEditCar
}) => {
  const { language, cars, deleteCar, toggleCarStatus, updateCar, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
    { id: 'luxury', label: language === 'ar' ? 'فاخرة (Luxury)' : 'Luxury' },
    { id: 'suv', label: language === 'ar' ? 'عائلية وSUV' : 'SUV' },
    { id: 'sedan', label: language === 'ar' ? 'سيدان واقتصادية' : 'Sedan' },
    { id: 'sports', label: language === 'ar' ? 'رياضية' : 'Sports' },
    { id: 'electric', label: language === 'ar' ? 'كهربائية' : 'Electric' }
  ];

  const filteredCars = cars.filter((car) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      car.name.ar.toLowerCase().includes(q) ||
      car.name.en.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q) ||
      (car.plateNumber && car.plateNumber.toLowerCase().includes(q));

    const matchCategory = selectedCategory === 'all' || car.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || car.status === selectedStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Actions Header */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'بحث باسم السيارة أو الماركة أو اللوحة...'
                : 'Search car name, brand, plate...'
            }
            className="w-full bg-white border border-stone-200 rounded-xl py-2 ps-10 pe-4 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#C9922C]"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'gold-gradient-bg text-[#1C1917] shadow-sm font-black'
                  : 'bg-white text-stone-400 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Mode & Add Button */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <div className="bg-white p-1 rounded-xl border border-stone-200 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#DFAB44]' : 'text-stone-400 hover:text-stone-900'
              }`}
              title="عرض كجدول بيانات"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#DFAB44]' : 'text-stone-400 hover:text-stone-900'
              }`}
              title="عرض كبطاقات شبكية"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAddCarModal}
            className="gold-gradient-bg text-[#1C1917] px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#C9922C]/20 border border-[#E9C682]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة سيارة جديدة' : 'Add Vehicle'}</span>
          </button>
        </div>
      </div>

      {/* Content Rendering: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-white text-stone-400 border-b border-stone-200 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'المركبة والموديل' : 'Vehicle & Model'}</th>
                  <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'رقم اللوحة' : 'Plate Number'}</th>
                  <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                  <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'السعر اليومي' : 'Daily Price'}</th>
                  <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'السعر الشهري' : 'Monthly Price'}</th>
                  <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الحالة والجاهزية' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C2621] text-stone-200">
                {filteredCars.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      {language === 'ar' ? 'لا توجد سيارات مطابقة لبحثك.' : 'No vehicles found.'}
                    </td>
                  </tr>
                ) : (
                  filteredCars.map((car) => {
                    const isAvailable = !car.status || car.status === 'available';
                    const isRented = car.status === 'rented';
                    const isMaint = car.status === 'maintenance';

                    return (
                      <tr key={car.id} className="hover:bg-white transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.image}
                              alt={car.name.en}
                              className="w-12 h-8 rounded-lg object-cover bg-white border border-stone-800 shrink-0"
                            />
                            <div>
                              <div className="font-black text-stone-900 text-xs">
                                {language === 'ar' ? car.name.ar : car.name.en}
                              </div>
                              <div className="text-[10px] text-[#DFAB44] font-mono">
                                {car.brand} • {car.modelYear}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-300">
                          {car.plateNumber || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-white text-stone-300 text-[10px] font-bold uppercase">
                            {car.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-stone-900 font-mono">
                          {car.dailyPrice} {language === 'ar' ? 'ر.س' : 'SAR'}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#DFAB44] font-mono">
                          {car.monthlyPrice || car.dailyPrice * 25} {language === 'ar' ? 'ر.س' : 'SAR'}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => toggleCarStatus(car.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 transition-all ${
                              isAvailable
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : isRented
                                ? 'bg-[#C9922C]/20 text-[#DFAB44] border border-[#C9922C]/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                            title="انقر لتغيير الحالة فوراً"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isAvailable
                                  ? 'bg-emerald-400'
                                  : isRented
                                  ? 'bg-[#DFAB44]'
                                  : 'bg-amber-400'
                              }`}
                            />
                            <span>
                              {isAvailable
                                ? language === 'ar' ? 'متاحة للحجز' : 'Available'
                                : isRented
                                ? language === 'ar' ? 'مؤجرة نشطة' : 'Rented'
                                : language === 'ar' ? 'صيانة وفحص' : 'Maintenance'}
                            </span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onEditCar(car)}
                              className="p-1.5 rounded-lg bg-white text-stone-300 hover:text-stone-900 hover:bg-white border border-stone-200 transition-colors"
                              title="تعديل بيانات المركبة"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#DFAB44]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteCar(car.id)}
                              className="p-1.5 rounded-lg bg-white text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 border border-stone-200 transition-colors"
                              title="حذف من الأسطول"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCars.map((car) => {
            const isAvailable = !car.status || car.status === 'available';
            const isRented = car.status === 'rented';

            return (
              <div
                key={car.id}
                className="rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-[#C9922C]/40 transition-all"
              >
                <div className="relative h-44 bg-white overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[#DFAB44] text-[10px] font-mono font-bold border border-white/10">
                    {car.plateNumber || '—'}
                  </div>
                  <div className="absolute top-3 end-3">
                    <button
                      type="button"
                      onClick={() => toggleCarStatus(car.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-md ${
                        isAvailable
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : isRented
                          ? 'bg-amber-950/80 text-[#DFAB44] border border-[#C9922C]/30'
                          : 'bg-white/80 text-stone-400 border border-stone-700'
                      }`}
                    >
                      {isAvailable
                        ? language === 'ar' ? 'متاحة' : 'Available'
                        : isRented
                        ? language === 'ar' ? 'مؤجرة' : 'Rented'
                        : language === 'ar' ? 'صيانة' : 'Maintenance'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-stone-900 text-sm">
                        {language === 'ar' ? car.name.ar : car.name.en}
                      </h3>
                      <p className="text-[11px] text-[#DFAB44] font-mono font-bold">
                        {car.brand} • {car.modelYear} • {car.category.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-end">
                      <div className="text-base font-black text-stone-900 font-mono">
                        {car.dailyPrice} <span className="text-[10px] text-stone-400">{language === 'ar' ? 'ر.س/يوم' : 'SAR/d'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-200 text-[10px] text-stone-400 text-center font-mono">
                    <div>
                      <span className="block text-stone-500">أسبوعي</span>
                      <span className="font-bold text-stone-200">{car.weeklyPrice} SAR</span>
                    </div>
                    <div>
                      <span className="block text-stone-500">شهري</span>
                      <span className="font-bold text-stone-200">{car.monthlyPrice} SAR</span>
                    </div>
                    <div>
                      <span className="block text-stone-500">تأمين</span>
                      <span className="font-bold text-emerald-400">{car.depositRequired || 0} SAR</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onEditCar(car)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-white hover:bg-white text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors me-2"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#DFAB44]" />
                      <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCar(car.id)}
                      className="p-1.5 rounded-xl bg-white text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 border border-stone-200 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


