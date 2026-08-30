import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 1. Classic Royal Crown & Laurel Crest (شعار التميز الملكي والكلاسيكي)
export const ClassicCrestBadge: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2L14.5 7L20 8L16 12L17 17.5L12 15L7 17.5L8 12L4 8L9.5 7L12 2Z"
      fill="currentColor"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="2.5" fill="currentColor" />
    <path
      d="M3 21C5.5 19 8.5 18 12 18C15.5 18 18.5 19 21 21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 2. Classic Speedometer / Chrono Dial (عداد السرعة الكلاسيكي التناظري)
export const ClassicSpeedometerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 21C6.5 21 2 16.5 2 11C2 5.5 6.5 2 12 2C17.5 2 22 5.5 22 11C22 16.5 17.5 21 12 21Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12 12L16.5 7.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M5 11H7M17 11H19M12 5V7M7 6.5L8.5 8M17 6.5L15.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// 3. Classic Transmission & Gear Shift Emblem (ناقل الحركة الكلاسيكي المصقول)
export const ClassicGearShiftIcon: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7V17M12 7V17M16 7V17M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="7" r="1.5" fill="currentColor" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
    <circle cx="16" cy="7" r="1.5" fill="currentColor" />
    <circle cx="16" cy="17" r="1.5" fill="currentColor" />
  </svg>
);

// 4. Classic Heritage Fuel & Petroleum Gauge (مقياس الوقود الكلاسيكي الفاخر)
export const ClassicFuelGaugeIcon: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M4 19V6C4 4.9 4.9 4 6 4H14C15.1 4 16 4.9 16 6V19"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M3 19H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="7" y="7" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
    <path
      d="M16 9L19 12V17C19 18.1 18.1 19 17 19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="19.5" cy="10.5" r="1" fill="currentColor" />
  </svg>
);

// 5. Classic Luxury Leather Seat (مقعد الجلد الفاخر المبطن)
export const ClassicLeatherSeatIcon: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M7 4C7 2.9 7.9 2 9 2H15C16.1 2 17 2.9 17 4V13C17 14.1 16.1 15 15 15H9C7.9 15 7 14.1 7 13V4Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5 15H19C20.1 15 21 15.9 21 17V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V17C3 15.9 3.9 15 5 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M10 6V11M14 6V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 6. Classic Vintage Trunk / Suitcase (حقائب السفر الكلاسيكية)
export const ClassicVintageTrunkIcon: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="7" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" stroke="currentColor" strokeWidth="1.5" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
    <rect x="11" y="11" width="2" height="3" rx="0.5" fill="currentColor" />
  </svg>
);

// 7. Classic Mechanical Engine Precision Badge (شعار المحرك الميكانيكي الكلاسيكي)
export const ClassicV8EngineIcon: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M4 8H7V5H17V8H20V12H22V16H20V19H4V16H2V12H4V8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="13.5" r="2.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.2" />
    <path d="M9 13.5H7M17 13.5H15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// 8. Classic Heritage Shield Badge (درع الرفاهة الكلاسيكي الملكي)
export const ClassicHeritageShield: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2L4 5V11.5C4 16.5 7.4 20.9 12 22C16.6 20.9 20 16.5 20 11.5V5L12 2Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9 11.5L11 13.5L15 9.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 9. Classic Star Rating Facet (نجمة ذهبية كلاسيكية منحوتة)
export const ClassicFacetedStar: React.FC<IconProps> = ({ className = 'w-4 h-4 text-[#DFAB44]' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);
