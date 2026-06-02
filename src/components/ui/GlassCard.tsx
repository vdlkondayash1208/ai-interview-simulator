import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'cyan' | 'purple' | 'blue' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverEffect = false,
  glowColor = 'none',
  ...props 
}) => {
  const glowClasses = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:border-neon-cyan/50',
    purple: 'hover:shadow-[0_0_30px_rgba(176,38,255,0.3)] hover:border-neon-purple/50',
    blue: 'hover:shadow-[0_0_30px_rgba(0,71,255,0.3)] hover:border-neon-blue/50',
    none: ''
  };

  return (
    <motion.div
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
        hoverEffect && "hover:-translate-y-1",
        glowClasses[glowColor],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
