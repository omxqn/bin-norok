"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

const offsets = {
  up: { y: 20, x: 0 },
  left: { x: -20, y: 0 },
  right: { x: 20, y: 0 },
  none: { x: 0, y: 0 },
};

export function FadeIn({ children, className, delay = 0, direction = "up" }: FadeInProps) {
  const offset = offsets[direction];
  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
