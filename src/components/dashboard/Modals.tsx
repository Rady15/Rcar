import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Car as CarIcon,
  Users,
  Building2,
  FileText,
  Printer,
  ShieldCheck,
  Gauge,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Car, BookingDetails, Branch, AppUser, UserRole, InspectionReport, Category } from '../../types';

// ==========================================
// 1. ADD / EDIT CAR MODAL
// ==========================================
interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  carToEdit?: Car | null;
}

export const AddCarModal: React.FC<AddCarModalProps> = ({ isOpen, onClose, carToEdit }) => {
  const { addCar, updateCar, showToast, language, categories } = useApp() as any;

  const [brand, setBrand] = useState('Toyota');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [modelYear, setModelYear] = useState<number | ''>('');
  const [category, setCategory] = useState<Car['category']>('sedan');
  const [plateNumber, setPlateNumber] = useState('');
  const [dailyPrice, setDailyPrice] = useState(790);
  const [weeklyPrice, setWeeklyPrice] = useState(5100);
  const [monthlyPrice, setMonthlyPrice] = useState(17500);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80');
  const [seats, setSeats] = useState(7);
  const [luggage, setLuggage] = useState(5);
  const [doors, setDoors] = useState(5);
  const [transmission, setTransmission] = useState<Car['transmission']>('auto');
  const [fuelType, setFuelType] = useState<Car['fuelType']>('petrol');
  const [engineCapacity, setEngineCapacity] = useState('3.5L Twin-Turbo V6 409 HP');
  const [depositRequired, setDepositRequired] = useState(2000);
  const [availableQuantity, setAvailableQuantity] = useState(5);
  const [minDriverAge, setMinDriverAge] = useState(25);
  const [includedMileagePerDay, setIncludedMileagePerDay] = useState(350);
  const [isPopular, setIsPopular] = useState(false);
  const [isSpecialOffer, setIsSpecialOffer] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [featuresAr, setFeaturesAr] = useState('دفع رباعي مستمر مع نظام الزحف واختيار التضاريس MTS\nمقاعد جلد فاخرة مع تبريد وتدفئة لجميع الصفوف\nنظام صوتي JBL بـ 14 سماعة\nشاشة ملاحة 12.3 بوصة وشاشات خلفية\nثلاجة مدمجة وفتحة سقف');
  const [featuresEn, setFeaturesEn] = useState('Full-Time 4WD with Multi-Terrain Select & Crawl\nPremium Leather with Multi-Row Climate Seats\nJBL 14-Speaker Audio\n12.3" Nav Display & Dual Rear Entertainment\nIntegrated Cool Box & Sunroof');

  const parseFeatures = (raw: string) => raw.split('\n').map(s => s.trim()).filter(Boolean);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (carToEdit) {
      setBrand(carToEdit.brand);
      setNameAr(carToEdit.name.ar);
      setNameEn(carToEdit.name.en);
      setModelYear(carToEdit.modelYear);
      setCategory(carToEdit.category);
      setPlateNumber(carToEdit.plateNumber || '');
      setDailyPrice(carToEdit.dailyPrice);
      setWeeklyPrice(carToEdit.weeklyPrice);
      setMonthlyPrice(carToEdit.monthlyPrice);
      setImage(carToEdit.image);
      setSeats(carToEdit.seats);
      setLuggage(carToEdit.luggage);
      setDoors(carToEdit.doors);
      setTransmission(carToEdit.transmission);
      setFuelType(carToEdit.fuelType);
      setEngineCapacity(carToEdit.engineCapacity);
      setDepositRequired(carToEdit.depositRequired || 0);
      setAvailableQuantity(carToEdit.availableQuantity);
      setMinDriverAge(carToEdit.minDriverAge);
      setIncludedMileagePerDay(carToEdit.includedMileagePerDay);
      setIsPopular(!!carToEdit.isPopular);
      setIsSpecialOffer(!!carToEdit.isSpecialOffer);
      setDiscountPercentage(carToEdit.discountPercentage || 0);
      setFeaturesAr((carToEdit.features.ar || []).join('\n'));
      setFeaturesEn((carToEdit.features.en || []).join('\n'));
    } else {
      setNameAr('');
      setNameEn('');
      setPlateNumber('');
      setIsPopular(false);
      setIsSpecialOffer(false);
      setDiscountPercentage(0);
    }
  }, [carToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;
    const featsAr = parseFeatures(featuresAr);
    const featsEn = parseFeatures(featuresEn);

    const payload: Partial<Car> = {
      name: { ar: nameAr, en: nameEn || nameAr },
      brand,
      modelYear: Number(modelYear),
      category,
      image,
      dailyPrice: Number(dailyPrice),
      weeklyPrice: Number(weeklyPrice),
      monthlyPrice: Number(monthlyPrice),
      plateNumber: plateNumber.trim(),
      seats: Number(seats),
      luggage: Number(luggage),
      doors: Number(doors),
      transmission,
      fuelType,
      engineCapacity,
      features: {
        ar: featsAr.length ? featsAr : ['مثبت سرعة ذكي', 'دخول ذكي بدون مفتاح', 'Apple CarPlay & Android Auto', 'كاميرا وحساسات'],
        en: featsEn.length ? featsEn : ['Smart Cruise Control', 'Keyless Entry', 'Apple CarPlay', 'Rear Camera & Sensors']
      },
      availableQuantity: Number(availableQuantity),
      minDriverAge: Number(minDriverAge),
      depositRequired: Number(depositRequired),
      includedMileagePerDay: Number(includedMileagePerDay),
      isPopular,
      isSpecialOffer,
      discountPercentage: isSpecialOffer ? Number(discountPercentage) : undefined,
    };

    if (carToEdit) {
      updateCar(carToEdit.id, payload);
      showToast(language === 'ar' ? 'تم تحديث بيانات السيارة بنجاح' : 'Vehicle updated', 'success');
    } else {
      addCar({
        ...(payload as Car),
        availableQuantity: Number(availableQuantity),
        minDriverAge: Number(minDriverAge),
        depositRequired: Number(depositRequired),
        includedMileagePerDay: Number(includedMileagePerDay),
        plateNumber: plateNumber.trim(),
        status: 'available'
      } as Car);
      showToast(language === 'ar' ? 'تمت إضافة السيارة الجديدة للأسطول' : 'Vehicle added to fleet', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-stone-900 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <CarIcon className="w-5 h-5 text-[#DFAB44]" />
            <h2 className="text-lg font-black">
              {carToEdit
                ? language === 'ar' ? 'تعديل بيانات المركبة' : 'Edit Vehicle'
                : language === 'ar' ? 'إضافة مركبة جديدة للأسطول' : 'Add New Fleet Vehicle'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white text-stone-400 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pe-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">اسم السيارة بالعربية *</label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: تويوتا لاندكروزر VXR 2025 توين تيربو"
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الاسم بالإنجليزية</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Toyota Land Cruiser VXR 2025 Twin-Turbo"
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الماركة <span className="text-stone-400 font-normal">({language==='ar'?'من إدارة الماركات':'from Brands'})</span></label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              >
                {categories?.length ? categories.filter((c:Category)=>c.isActive!==false).sort((a:Category,b:Category)=>(a.sortOrder||0)-(b.sortOrder||0)).map((cat:Category)=>(
                  <option key={cat.slug} value={cat.name.en}>{language==='ar'? `${cat.name.ar} (${cat.name.en})` : `${cat.name.en} (${cat.name.ar})`}</option>
                )) : ['Toyota','Hyundai','Kia','Nissan','Mercedes-Benz','BMW','Lexus','Cadillac','Porsche','GMC','Chevrolet'].map((b)=>(
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <p className="text-[10px] text-stone-400 mt-1">{language==='ar'?'الماركات تُدار من السايدبار > الماركات':'Brands are managed from Sidebar > Brands'}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">سنة الصنع</label>
              <input
                type="number"
                value={modelYear}
                onChange={(e) => setModelYear(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الفئة</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              >
                <option value="economy">اقتصادية - Economy</option>
                <option value="compact">مدمجة - Compact</option>
                <option value="sedan">سيدان - Sedan</option>
                <option value="suv">SUV / دفع رباعي</option>
                <option value="luxury">فاخرة - Luxury</option>
                <option value="family">عائلية - Family</option>
                <option value="commercial">تجارية - Commercial</option>
                <option value="electric">كهربائية - Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">رقم اللوحة</label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="أ ب ج 1234"
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">السعر اليومي (ر.س)</label>
              <input
                type="number"
                required
                value={dailyPrice}
                onChange={(e) => setDailyPrice(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">السعر الأسبوعي (ر.س)</label>
              <input
                type="number"
                value={weeklyPrice}
                onChange={(e) => setWeeklyPrice(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">السعر الشهري (ر.س)</label>
              <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">مبلغ التأمين المسترد (ر.س)</label>
              <input
                type="number"
                value={depositRequired}
                onChange={(e) => setDepositRequired(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">المقاعد</label>
              <input type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الحقائب</label>
              <input type="number" value={luggage} onChange={(e) => setLuggage(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الأبواب</label>
              <input type="number" value={doors} onChange={(e) => setDoors(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">ناقل الحركة</label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value as any)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900">
                <option value="auto">أوتوماتيك</option>
                <option value="manual">عادي</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">نوع الوقود</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value as any)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900">
                <option value="petrol">بنزين</option>
                <option value="diesel">ديزل</option>
                <option value="hybrid">هايبرد</option>
                <option value="electric">كهربائي</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">سعة المحرك</label>
              <input type="text" value={engineCapacity} onChange={(e) => setEngineCapacity(e.target.value)} placeholder="مثال: 3.5L Twin-Turbo V6 409 HP" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الكمية المتاحة</label>
              <input type="number" value={availableQuantity} onChange={(e) => setAvailableQuantity(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الحد الأدنى للعمر</label>
              <input type="number" value={minDriverAge} onChange={(e) => setMinDriverAge(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">كم/يوم مشمولة مجاناً</label>
              <input type="number" value={includedMileagePerDay} onChange={(e) => setIncludedMileagePerDay(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-300"><input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} className="rounded" /> الأكثر طلباً</label>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-300"><input type="checkbox" checked={isSpecialOffer} onChange={(e) => setIsSpecialOffer(e.target.checked)} className="rounded" /> عرض خاص</label>
              {isSpecialOffer && (
                <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(Number(e.target.value))} placeholder="نسبة الخصم %" className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs text-stone-900" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">المواصفات والكماليات (عربي) — كل سطر ميزة</label>
              <textarea rows={5} value={featuresAr} onChange={(e) => setFeaturesAr(e.target.value)} placeholder="كل ميزة في سطر منفصل" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Features (EN) — one per line</label>
              <textarea rows={5} value={featuresEn} onChange={(e) => setFeaturesEn(e.target.value)} placeholder="One feature per line" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1 flex items-center gap-2"><Upload className="w-3.5 h-3.5 text-[#DFAB44]" /> صورة السيارة — رفع من الجهاز</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs text-stone-900 file:me-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-white file:text-[#DFAB44] file:font-bold" />
            <div className="mt-2">
              <label className="block text-[11px] text-stone-500 mb-1">أو رابط صورة خارجي</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono"
              />
            </div>
            {image && (
              <div className="mt-3">
                <img src={image} alt="preview" className="w-full h-40 object-cover rounded-xl border border-stone-200 bg-white" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white text-stone-300 text-xs font-bold hover:bg-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-[#1C1917] text-xs font-black shadow-lg shadow-[#C9922C]/20"
            >
              حفظ المركبة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. ADD USER MODAL
// ==========================================
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { addUser, branches, showToast, language } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'ruh-t1-2');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      fullName: name,
      email,
      phone,
      role,
      branchId,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    });
    showToast(language === 'ar' ? 'تمت إضافة المستخدم بنجاح' : 'User created', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-stone-900">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#DFAB44]" />
            <h2 className="text-base font-black">إضافة مستخدم أو موظف جديد</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white text-stone-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: خالد بن فهد الشمري"
              className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">البريد الإلكتروني *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@alrafaha.sa"
              className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">رقم الجوال</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الدور والصلاحية</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              >
                <option value="staff">موظف فرع (Staff)</option>
                <option value="admin">مدير نظام (Admin)</option>
                <option value="user">عميل (Customer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الفرع التابع له</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name.ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-stone-300 text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient-bg text-[#1C1917] text-xs font-black"
            >
              إضافة المستخدم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. ADD BRANCH MODAL
// ==========================================
interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchToEdit?: Branch | null;
}

export const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose, branchToEdit }) => {
  const { addBranch, updateBranch, showToast, language } = useApp();
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [cityAr, setCityAr] = useState('الرياض');
  const [cityEn, setCityEn] = useState('Riyadh');
  const [type, setType] = useState<Branch['type']>('airport');
  const [terminal, setTerminal] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [phone, setPhone] = useState('');
  const [workingHoursAr, setWorkingHoursAr] = useState('24 ساعة طوال أيام الأسبوع');
  const [workingHoursEn, setWorkingHoursEn] = useState('24/7 Everyday');
  const [is24Hours, setIs24Hours] = useState(true);
  const [hasSelfServiceKiosk, setHasSelfServiceKiosk] = useState(true);
  const [hasVipLounge, setHasVipLounge] = useState(false);
  const [latitude, setLatitude] = useState(24.7136);
  const [longitude, setLongitude] = useState(46.6753);
  const [rating, setRating] = useState(4.8);
  const [googleMapUrl, setGoogleMapUrl] = useState('');

  useEffect(() => {
    if (branchToEdit) {
      setNameAr(branchToEdit.name.ar);
      setNameEn(branchToEdit.name.en);
      setCityAr(branchToEdit.city.ar);
      setCityEn(branchToEdit.city.en);
      setType(branchToEdit.type);
      setTerminal((branchToEdit as any).terminal || '');
      setAddressAr(branchToEdit.address.ar);
      setAddressEn(branchToEdit.address.en);
      setPhone(branchToEdit.phone);
      setWorkingHoursAr(branchToEdit.workingHours.ar);
      setWorkingHoursEn(branchToEdit.workingHours.en);
      setIs24Hours(!!branchToEdit.is24Hours);
      setHasSelfServiceKiosk(!!branchToEdit.hasSelfServiceKiosk);
      setHasVipLounge(!!branchToEdit.hasVipLounge);
      setLatitude(branchToEdit.latitude || (branchToEdit as any).coordinates?.lat || 24.7136);
      setLongitude(branchToEdit.longitude || (branchToEdit as any).coordinates?.lng || 46.6753);
      setRating(branchToEdit.rating || 4.8);
      setGoogleMapUrl(branchToEdit.googleMapUrl || '');
    } else if (isOpen) {
      setNameAr(''); setNameEn(''); setAddressAr(''); setAddressEn(''); setTerminal(''); setGoogleMapUrl('');
    }
  }, [branchToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;
    const payload: Omit<Branch, 'id'> = {
      city: { ar: cityAr, en: cityEn || cityAr },
      name: { ar: nameAr, en: nameEn || nameAr },
      type,
      terminal: terminal || undefined,
      address: { ar: addressAr || nameAr, en: addressEn || nameEn || addressAr || nameAr },
      phone,
      workingHours: { ar: workingHoursAr, en: workingHoursEn },
      is24Hours,
      hasSelfServiceKiosk,
      hasVipLounge,
      latitude: Number(latitude),
      longitude: Number(longitude),
      rating: Number(rating),
      googleMapUrl: googleMapUrl || `https://maps.google.com/?q=${latitude},${longitude}`,
    } as any;
    // include coordinates for backward compatibility
    (payload as any).coordinates = { lat: Number(latitude), lng: Number(longitude) };
    if (branchToEdit) {
      updateBranch(branchToEdit.id, payload);
      showToast(language === 'ar' ? 'تم تحديث الفرع بنجاح' : 'Branch updated', 'success');
    } else {
      addBranch(payload);
      showToast(language === 'ar' ? 'تمت إضافة الفرع بنجاح' : 'Branch added', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-stone-900 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#DFAB44]" />
            <h2 className="text-base font-black">{branchToEdit ? (language === 'ar' ? 'تعديل بيانات الفرع' : 'Edit Branch') : (language === 'ar' ? 'إضافة فرع' : 'Add Branch')}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white text-stone-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pe-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">اسم الفرع بالعربية *</label>
              <input type="text" required value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="مثال: مطار الملك فهد الدولي - صالة 1" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Branch name (EN)</label>
              <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. King Khalid Airport T2" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">المدينة (عربي)</label>
              <input type="text" value={cityAr} onChange={(e) => setCityAr(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">City (EN)</label>
              <input type="text" value={cityEn} onChange={(e) => setCityEn(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">نوع الفرع</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900">
                <option value="airport">صالة مطار</option>
                <option value="downtown">مركز رئيسي</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">الصالة / المبنى</label>
              <input type="text" value={terminal} onChange={(e) => setTerminal(e.target.value)} placeholder="مثال: صالة 1" className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-300 mb-1">العنوان التفصيلي (عربي)</label>
              <input type="text" value={addressAr} onChange={(e) => setAddressAr(e.target.value)} placeholder="مبنى صالات السفر الدولي..." className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-300 mb-1">Address (EN)</label>
              <input type="text" value={addressEn} onChange={(e) => setAddressEn(e.target.value)} placeholder="International terminal building..." className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">رقم الهاتف</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">التقييم (من 5)</label>
              <input type="number" step="0.1" min={0} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">ساعات العمل (عربي)</label>
              <input type="text" value={workingHoursAr} onChange={(e) => setWorkingHoursAr(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Working hours (EN)</label>
              <input type="text" value={workingHoursEn} onChange={(e) => setWorkingHoursEn(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Latitude</label>
              <input type="number" step={0.0001} value={latitude} onChange={(e) => setLatitude(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Longitude</label>
              <input type="number" step={0.0001} value={longitude} onChange={(e) => setLongitude(Number(e.target.value))} className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-300 mb-1">رابط خرائط Google</label>
              <input type="text" value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} placeholder="https://maps.google.com/?q=..." className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-stone-300"><input type="checkbox" checked={is24Hours} onChange={(e) => setIs24Hours(e.target.checked)} /> 24 ساعة</label>
            <label className="flex items-center gap-2 text-xs font-bold text-stone-300"><input type="checkbox" checked={hasVipLounge} onChange={(e) => setHasVipLounge(e.target.checked)} /> صالة VIP</label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-stone-300 text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient-bg text-[#1C1917] text-xs font-black"
            >
              {branchToEdit ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'حفظ الفرع' : 'Save Branch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. RENTAL INVOICE MODAL
// ==========================================
interface InvoiceModalProps {
  booking: BookingDetails | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="print-invoice-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div id="invoice-print-root" className="print-invoice w-full max-w-xl bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 print:p-0">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-black text-stone-900">فاتورة تأجير — الرفقة</h2>
            <p className="text-xs text-stone-500 font-mono">فاتورة إيجار مركبة داخلية</p>
          </div>
          <button onClick={onClose} className="print-invoice-close p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        {(() => {
          const totalAmt = booking.payment?.totalAmount ?? 0;
          const vatAmt = booking.payment?.vatAmount ?? (totalAmt * 0.15 / 1.15);
          const baseAmt = booking.payment?.baseAmount ?? (totalAmt - vatAmt);
          const days = booking.numberOfDays ?? 1;
          const issueDate = booking.createdAt?.split('T')[0] || booking.searchCriteria?.pickupDate || '—';
          const customerName = booking.customer?.fullName || 'العميل';
          const customerPhone = booking.customer?.phone || '';
          const customerId = booking.customer?.idNumber || 'غير مسجل';
          const carName = booking.car?.name?.ar || booking.car?.name?.en || 'السيارة';
          const plateNum = booking.car?.plateNumber || 'غير محددة';
          const refNum = booking.tammAuthorizationNumber || `AR-${booking.bookingId}`;

          return (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <div className="font-bold text-stone-900">شركة الرفقة لتأجير السيارات</div>
                  <div className="text-stone-500">فرع الرياض - طريق الملك فهد</div>
                </div>
                <div className="text-end">
                  <div className="font-mono font-bold text-stone-900">INV-{booking.bookingId}</div>
                  <div className="text-stone-500">تاريخ الإصدار: {issueDate}</div>
                  <div className="text-emerald-700 font-bold">مرجع التوثيق: {refNum}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900">بيانات العميل المستأجر:</div>
                <div className="text-stone-700">{customerName} {customerPhone ? `• هاتف: ${customerPhone}` : ''}</div>
                <div className="text-stone-500">الهوية الوطنية / الإقامة: {customerId}</div>
              </div>

              {/* Table Breakdown */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-stone-300 text-stone-600 text-start">
                    <th className="py-2 text-start">البيان</th>
                    <th className="py-2 text-center">المدة</th>
                    <th className="py-2 text-end">القيمة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="py-2">
                      <span className="font-bold">{carName}</span>
                      <span className="block text-[10px] text-stone-500">لوحة: {plateNum}</span>
                    </td>
                    <td className="py-2 text-center">{days} يوم</td>
                    <td className="py-2 text-end font-mono">{baseAmt.toFixed(2)} ر.س</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="py-2 text-start font-bold">ضريبة القيمة المضافة (15% VAT):</td>
                    <td className="py-2 text-end font-mono font-bold text-stone-900">
                      {vatAmt.toFixed(2)} ر.س
                    </td>
                  </tr>
                  <tr className="text-sm font-black bg-stone-100">
                    <td colSpan={2} className="py-2 px-2 text-start">الإجمالي الشامل للضريبة:</td>
                    <td className="py-2 px-2 text-end font-mono text-[#C9922C]">
                      {totalAmt.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Internal reference */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <div className="font-bold text-stone-900">توثيق داخلي للشركة</div>
                  <div className="text-[10px] text-stone-500 font-mono">بدون إرسال لأي جهة خارجية</div>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-sm border border-stone-200">
                  <FileText className="w-12 h-12 text-[#C9922C]" />
                </div>
              </div>
            </div>
          );
        })()}

        <div className="print-invoice-actions flex justify-end gap-2 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-white text-stone-900 text-xs font-bold flex items-center gap-2 hover:bg-black"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. INSPECTION REPORT MODAL
// ==========================================
interface InspectionModalProps {
  booking: BookingDetails | null;
  type: 'pickup' | 'return';
  onClose: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({ booking, type, onClose }) => {
  const { addInspectionReport, currentUser, showToast, language } = useApp();

  const [odometer, setOdometer] = useState<number | ''>('');
  const [fuelLevel, setFuelLevel] = useState<InspectionReport['fuelLevel']>('full');
  const [cleanliness, setCleanliness] = useState<InspectionReport['cleanliness']>('clean');
  const [tiresCondition, setTiresCondition] = useState<InspectionReport['tiresCondition']>('good');
  const [notes, setNotes] = useState('');

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addInspectionReport({
      bookingId: booking.bookingId,
      carId: booking.car.id,
      carName: booking.car.name.ar,
      plateNumber: booking.car.plateNumber || '—',
      type,
      inspectorName: currentUser.fullName,
      odometer: Number(odometer),
      fuelLevel,
      cleanliness,
      tiresCondition,
      acWorking: true,
      spareTirePresent: true,
      scratchesOrDents: [],
      notes: notes || 'تم الفحص الفني والتحقق من سلامة الهيكل والمحرك.'
    });

    showToast(
      type === 'pickup'
        ? (language === 'ar' ? 'تم تسجيل تسليم المركبة بنجاح' : 'Pickup registered')
        : (language === 'ar' ? 'تم تسجيل فحص استلام المركبة' : 'Return inspection saved'),
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-stone-900">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#DFAB44]" />
            <h2 className="text-base font-black">
              {type === 'pickup' ? 'نموذج فحص وتسليم المركبة للعميل' : 'نموذج فحص واسترجاع المركبة'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white text-stone-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-white border border-stone-200">
            <div className="font-bold text-stone-900">{booking.car.name.ar}</div>
            <div className="text-[11px] text-stone-400">
              العميل: {booking.customer.fullName} • لوحة: {booking.car.plateNumber || '—'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-300 mb-1">قراءة العداد (كم) *</label>
              <input
                type="number"
                required
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 mb-1">مستوى الوقود</label>
              <select
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              >
                <option value="full">ممتلئ (Full 100%)</option>
                <option value="three_quarters">ثلاثة أرباع (75%)</option>
                <option value="half">نصف (50%)</option>
                <option value="quarter">ربع (25%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-300 mb-1">نظافة المقصورة والهيكل</label>
              <select
                value={cleanliness}
                onChange={(e) => setCleanliness(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              >
                <option value="clean">ممتازة ونظيفة تماماً</option>
                <option value="moderate">متوسطة (بحاجة غسيل)</option>
                <option value="dirty">غير نظيفة</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-300 mb-1">حالة الإطارات وضغط الهواء</label>
              <select
                value={tiresCondition}
                onChange={(e) => setTiresCondition(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
              >
                <option value="good">سليمة ومطابقة للمواصفات</option>
                <option value="fair">مقبولة</option>
                <option value="needs_replacement">بحاجة تغيير</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-300 mb-1">ملاحظات الفاحص والمفتش</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تسليم المفتاح الذكي، تدقيق العجلات والهيكل الخارجي..."
              className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-stone-300 text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl gold-gradient-bg text-[#1C1917] text-xs font-black"
            >
              اعتماد الفحص والتسليم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


