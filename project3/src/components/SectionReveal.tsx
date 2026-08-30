import React, { useEffect, useRef, useState } from 'react';

interface SectionRevealProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

/**
 * Scroll-aware section wrapper. Slides the section in from the left when it
 * enters the viewport and slides it back out to the left when it leaves,
 * one section at a time while scrolling.
 */
export const SectionReveal: React.FC<SectionRevealProps> = ({
  className = '',
  children,
  id
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`section-reveal ${visible ? 'section-reveal-in' : 'section-reveal-out'} ${className}`}
    >
      {children}
    </div>
  );
};
