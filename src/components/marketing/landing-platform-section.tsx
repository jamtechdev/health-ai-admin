'use client';

import { motion } from 'framer-motion';
import { fadeUp, modules } from './landing-content';

export function LandingPlatformSection() {
  return (
    <motion.section
      id="platform"
      className="mt-28 scroll-mt-28"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">
          Platform modules
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Built for health-tech teams that need control, context, and speed.
        </h2>
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-text-secondary">
        Every screen is designed around the operational flow of a biometric platform: understand
        the user, inspect the signal, review the insight, and act with confidence.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <motion.div
            key={module.title}
            variants={fadeUp}
            className="group rounded-card border border-brand-border bg-surface/70 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-brand-primary/40 hover:bg-surface-elevated hover:shadow-floating"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-button bg-brand-primary-glow text-brand-primary transition group-hover:bg-brand-primary/25">
              <module.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground">{module.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{module.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
