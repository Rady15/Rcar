import React, { useEffect, useRef, useState } from 'react';

interface MountTransitionProps {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Plays an enter animation when `open` becomes true and an exit animation when
 * it becomes false, unmounting the children only after the exit completes.
 * Ideal for drawers/accordions that must animate both ways.
 */
export const MountTransition: React.FC<MountTransitionProps> = ({
  open,
  className = '',
  children
}) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      rafRef.current = requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [open]);

  const handleAnimationEnd = () => {
    if (!open) setMounted(false);
  };

  if (!mounted) return null;

  return (
    <div
      className={`${className} ${visible ? 'mt-open' : 'mt-closed'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
};
