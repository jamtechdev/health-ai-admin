'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { workflow } from './landing-content';

export function LandingWorkflowSection() {
  return (
    <section className="mt-24 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-card border border-brand-border bg-surface/70 p-8 backdrop-blur"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-tertiary-glow px-3 py-1 text-sm font-semibold text-brand-tertiary">
          <Zap className="h-4 w-4" />
          Operational workflow
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-tight">From wearable event to admin action.</h2>
        <p className="mt-4 leading-relaxed text-text-secondary">
          TovaPulse is not a static dashboard. It is a business control layer for teams managing
          biometric products, support workflows, and AI-guided health engagement.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center text-sm font-semibold text-brand-primary transition hover:text-brand-critical"
        >
          Open secure admin area
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </motion.div>

      <div className="grid gap-4">
        {workflow.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
            viewport={{ once: true }}
            className="flex gap-4 rounded-card border border-brand-border bg-surface/60 p-5 backdrop-blur"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-brand-secondary-glow text-sm font-bold text-brand-secondary">
              {index + 1}
            </div>
            <div>
              <p className="font-semibold text-text-primary">{step}</p>
              <p className="mt-1 text-sm text-text-muted">
                Designed to reduce admin friction while keeping every critical health operation visible.
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
