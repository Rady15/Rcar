import React from 'react';
import logoImg from '../assets/arafgha-logo.png';

interface LogoProps {
  variant?: 'light' | 'dark' | 'color';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  showTagline?: boolean;
  isIconOnly?: boolean;
  className?: string;
  subText?: string;
}

export const AlrafghaLogoEmblem: React.FC<{ size?: number | string; className?: string }> = ({
  size = 48,
  className = ''
}) => {
  return (
    <img
      src={logoImg}
      alt="مجموعة الرفقة - ALRAFGHA GROUP"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
      className={`shrink-0 ${className}`}
      draggable={false}
    />
  );
};

export const AlrafghaLogo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  showTagline = false,
  isIconOnly = false,
  className = '',
  subText
}) => {
  // Size metrics
  const emblemSizes = {
    xs: 28,
    sm: 36,
    md: 46,
    lg: 56,
    xl: 68,
    hero: 84
  };

  const primaryTextClasses = {
    xs: 'text-base font-bold',
    sm: 'text-lg font-bold',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-3xl font-black',
    xl: 'text-3xl sm:text-4xl font-black',
    hero: 'text-4xl sm:text-5xl font-black'
  };

  const englishTextClasses = {
    xs: 'text-[8px] tracking-[0.25em]',
    sm: 'text-[9px] tracking-[0.3em]',
    md: 'text-[10.5px] tracking-[0.35em]',
    lg: 'text-xs tracking-[0.38em]',
    xl: 'text-sm tracking-[0.4em]',
    hero: 'text-base tracking-[0.45em]'
  };

  const isDark = variant === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-3 select-none transition-all ${className}`}
    >
      {/* Official Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <AlrafghaLogoEmblem size={emblemSizes[size]} />
      </div>

      {!isIconOnly && (
        <div className="flex flex-col justify-center leading-none">
          {/* Arabic Typography: مجموعة الرفقة */}
          <span
            className={`${primaryTextClasses[size]} tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-[#231F20]'
            }`}
            style={{ fontFamily: "'Cairo', system-ui, sans-serif" }}
          >
            مجموعة الرفقة
          </span>

          {/* English Typography: ALRAFGHA GROUP */}
          {showSubtitle && (
            <span
              className={`${englishTextClasses[size]} font-semibold uppercase mt-0.5 transition-colors ${
                isDark ? 'text-amber-300/80' : 'text-[#7A7269]'
              }`}
              style={{
                fontFamily: "'Cairo', system-ui, sans-serif"
              }}
            >
              A L R A F G H A &nbsp; G R O U P
            </span>
          )}

          {/* Optional Domain Subtitle / Category Badge */}
          {subText && (
            <span
              className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-sm inline-block w-fit ${
                isDark
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[#FAF3E8] text-[#B57E1E] border border-[#EACD9B]'
              }`}
            >
              {subText}
            </span>
          )}

          {showTagline && (
            <span
              className={`text-xs mt-1 font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              لتأجير السيارات والخدمات اللوجستية بالمملكة
            </span>
          )}
        </div>
      )}
    </div>
  );
};
