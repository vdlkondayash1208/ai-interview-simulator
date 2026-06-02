import React from 'react';
import { motion } from 'motion/react';
import { cn } from './GlassCard';

interface LoadingStateProps {
  text?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      fullScreen ? "fixed inset-0 bg-brand-bg/80 backdrop-blur-md z-50" : "w-full py-12"
    )}>
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 border-4 border-t-neon-cyan border-r-neon-purple border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-t-transparent border-r-transparent border-b-neon-purple border-l-neon-cyan rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {text && (
        <motion.p
          className="text-slate-400 font-medium tracking-widest text-sm uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div
      className={cn("bg-brand-border rounded animate-pulse", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
};
