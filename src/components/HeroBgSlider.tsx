import React, { useEffect, useState } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1900&q=80',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1900&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1900&q=80',
  'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1900&q=80',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1900&q=80'
];

/**
 * Auto-advancing hero background image slider with crossfade (fade in/out)
 * and a dark overlay gradient so foreground text stays readable.
 */
export const HeroBgSlider: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141210]/85 via-[#1C1917]/65 to-[#141210]/92" />

      {/* Slide indicators */}
      <div className="absolute bottom-5 start-1/2 -translate-x-1/2 flex items-center gap-2">
        {IMAGES.map((_, i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-full transition-all duration-500 ${
              i === active ? 'w-6 bg-[#DFAB44]' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
