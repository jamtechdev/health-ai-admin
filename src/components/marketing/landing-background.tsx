'use client';

import { motion } from 'framer-motion';

export function LandingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-brand-primary/20 blur-[120px]" />
      <motion.div
        className="absolute -right-24 top-1/4 h-[480px] w-[480px] rounded-full bg-brand-tertiary-glow blur-[100px]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="absolute bottom-0 left-1/2 h-64 w-full -translate-x-1/2 bg-gradient-to-t from-background to-transparent" />
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--text-primary) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--text-primary) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  );
}
