import { trustItems } from './landing-content';

export function LandingTrustSection() {
  return (
    <section className="mt-24 rounded-[32px] border border-brand-border bg-gradient-to-br from-surface via-surface-elevated to-background p-8 shadow-floating md:p-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-secondary">
            Secure by design
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Confidence for admins, operators, and stakeholders.
          </h2>
          <p className="mt-4 leading-relaxed text-text-secondary">
            The landing experience mirrors the product promise: premium operations, measurable
            health intelligence, and a trusted path into the admin console.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {trustItems.map((item) => (
            <div key={item.label} className="rounded-card border border-brand-border bg-background/40 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-button bg-brand-primary-glow text-brand-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="font-semibold text-text-primary">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
