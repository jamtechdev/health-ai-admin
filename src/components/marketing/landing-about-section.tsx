import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { aboutHighlights, adminLinks } from './landing-content';

export function LandingAboutSection() {
  return (
    <section
      id="about"
      className="mt-24 scroll-mt-28 rounded-[32px] border border-brand-border bg-surface/60 p-8 backdrop-blur md:p-10"
    >
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">
            About us
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            TovaPulse is built for serious health operations.
          </h2>
          <p className="mt-4 leading-relaxed text-text-secondary">
            We help digital health teams turn scattered biometric data into a clear operating
            system. The platform brings together users, wearables, AI insights, subscriptions,
            audit trails, and support signals so administrators can make faster decisions.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {aboutHighlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-input border border-brand-border bg-background/35 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-brand-secondary" />
                <span className="text-sm text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="admin-view" className="scroll-mt-28 rounded-card border border-brand-border bg-background/45 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                Admin side
              </span>
              <h3 className="mt-3 text-2xl font-bold">View every control area.</h3>
            </div>
            <Link
              href="/login"
              className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-brand-primary/90"
            >
              Sign in
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {adminLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-input border border-brand-border bg-surface-elevated px-4 py-3 text-sm font-semibold text-text-secondary transition hover:border-brand-primary/40 hover:text-text-primary"
              >
                <span>{item.label}</span>
                <ArrowRight className="ml-2 inline h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
