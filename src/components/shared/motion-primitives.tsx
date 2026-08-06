"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";

export function Reveal({ children, delay = 0, y = 24, className, once = true }: {
  children: ReactNode; delay?: number; y?: number; className?: string; once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

export function Stagger({ children, className, gap = 0.08 }: {
  children: ReactNode; className?: string; gap?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >{children}</motion.div>
  );
}

export function StaggerItem({ children, className, y = 28 }: {
  children: ReactNode; className?: string; y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className}
      variants={reduce ? undefined : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >{children}</motion.div>
  );
}

export function MagneticWrap({ children, className, strength = 0.35 }: {
  children: ReactNode; className?: string; strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - (rect.left + rect.width / 2)) * strength,
      y: (e.clientY - (rect.top + rect.height / 2)) * strength,
    });
  };
  return (
    <motion.div ref={ref} className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 250, damping: 18, mass: 0.5 }}
    >{children}</motion.div>
  );
}

export function useScrollToSection() {
  return (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />;
}

export function useIsScrolled(offset = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}
