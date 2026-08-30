import React from 'react';

interface CarLoaderProps {
  size?: number;
  fullScreen?: boolean;
  text?: string;
}

export const CarLoader: React.FC<CarLoaderProps> = ({ size = 72, fullScreen = false, text }) => {
  const wrapperClass = fullScreen
    ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FBF9F5]/95 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center py-10';

  return (
    <div className={wrapperClass} role="status" aria-live="polite" aria-label="Loading">
      <div className="car-loader" style={{ width: size * 2.2, height: size * 1.4 } as React.CSSProperties}>
        <div className="car-loader-3d">
          {/* Car body with 3D tilt */}
          <div className="car-loader-body">
            <svg width={size} height={size * 0.62} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="car-loader-svg">
              {/* Shadow */}
              <ellipse cx="60" cy="56" rx="42" ry="6" fill="#1C1917" opacity="0.12" className="car-loader-shadow" />
              {/* Body */}
              <path d="M12 28 L18 18 L42 16 L52 16 L66 16 L84 18 L96 22 L106 28 L106 38 L96 42 L84 42 L66 42 L42 42 L24 42 L12 38 Z" fill="#1C1917" stroke="#C9922C" strokeWidth="1.8" />
              <path d="M20 28 L24 20 L42 18 L52 18 L64 18 L82 20 L95 26 L102 28" fill="#2A2520" stroke="#C9922C" strokeWidth="1.2" />
              {/* Windows */}
              <path d="M26 28 L30 20 L42 19 L42 28 Z" fill="#DFAB44" opacity="0.95" />
              <path d="M44 28 L44 19 L64 19 L68 28 Z" fill="#DFAB44" opacity="0.95" />
              <path d="M70 28 L66 19 L83 20 L92 27 Z" fill="#DFAB44" opacity="0.85" />
              {/* Gold stripe */}
              <rect x="14" y="31" width="90" height="2.5" rx="1.2" fill="#C9922C" opacity="0.95" />
              {/* Door handle */}
              <rect x="48" y="33.5" width="10" height="1.6" rx="0.8" fill="#DFAB44" opacity="0.9" />
              {/* Headlight */}
              <ellipse cx="104.5" cy="32.5" rx="2.8" ry="3.5" fill="#DFAB44" />
              <ellipse cx="104.5" cy="32.5" rx="1.2" ry="1.8" fill="#FFF8E1" opacity="0.9" />
              {/* Taillight */}
              <ellipse cx="13.5" cy="33.5" rx="1.6" ry="2.8" fill="#C0392B" />
            </svg>
            {/* Wheels */}
            <div className="car-loader-wheel car-loader-wheel--front" style={{ width: size * 0.22, height: size * 0.22 }}>
              <div className="car-loader-wheel-inner">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="car-loader-wheel car-loader-wheel--rear" style={{ width: size * 0.22, height: size * 0.22 }}>
              <div className="car-loader-wheel-inner">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          {/* Road */}
          <div className="car-loader-road">
            <div className="car-loader-road-line" />
          </div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-xs font-black tracking-wider text-[#A47018] uppercase animate-pulse">
          {text}
        </p>
      )}
      <span className="sr-only">جاري التحميل</span>
    </div>
  );
};

export const CarLoaderInline: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div className="inline-flex items-center justify-center">
    <div className="car-loader car-loader--inline" style={{ width: size * 2, height: size * 0.9 } as React.CSSProperties}>
      <div className="car-loader-3d">
        <div className="car-loader-body">
          <svg width={size * 1.1} height={size * 0.6} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 28 L18 18 L42 16 L52 16 L66 16 L84 18 L96 22 L106 28 L106 38 L96 42 L84 42 L66 42 L42 42 L24 42 L12 38 Z" fill="#1C1917" stroke="#C9922C" strokeWidth="1.8" />
            <rect x="14" y="31" width="90" height="2.5" rx="1.2" fill="#C9922C" />
            <ellipse cx="104.5" cy="32.5" rx="2.8" ry="3.5" fill="#DFAB44" />
          </svg>
          <div className="car-loader-wheel car-loader-wheel--front" style={{ width: size * 0.28, height: size * 0.28 }}><div className="car-loader-wheel-inner"><span /><span /><span /></div></div>
          <div className="car-loader-wheel car-loader-wheel--rear" style={{ width: size * 0.28, height: size * 0.28 }}><div className="car-loader-wheel-inner"><span /><span /><span /></div></div>
        </div>
      </div>
    </div>
  </div>
);
