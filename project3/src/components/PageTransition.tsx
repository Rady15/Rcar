import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  pageKey: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Full-site page transition wrapper. Animates the outgoing page out,
 * swaps the rendered content, then animates the incoming page in.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  pageKey,
  className = '',
  children
}) => {
  const [renderKey, setRenderKey] = useState(pageKey);
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');
  const [currentChildren, setCurrentChildren] = useState<React.ReactNode>(children);

  // Route changed: keep showing the old page and animate it out.
  // Same route: adopt the newest content immediately (e.g. loading gate -> page).
  useEffect(() => {
    if (pageKey !== renderKey) {
      setPhase('exit');
    } else {
      setCurrentChildren(children);
    }
  }, [pageKey, renderKey, children]);

  // Exit animation finished: swap in the new page and animate it in.
  const handleExitDone = () => {
    if (pageKey !== renderKey) {
      setRenderKey(pageKey);
      setCurrentChildren(children);
    }
    setPhase('enter');
  };

  const isExiting = phase === 'exit' && pageKey !== renderKey;
  const phaseClass = isExiting ? 'page-exit' : 'page-enter';

  return (
    <div
      key={renderKey}
      className={`${className} ${phaseClass}`}
      onAnimationEnd={isExiting ? handleExitDone : undefined}
      aria-live="polite"
    >
      {currentChildren}
    </div>
  );
};
