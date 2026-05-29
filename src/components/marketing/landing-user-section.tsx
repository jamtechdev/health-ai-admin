import { userBenefits } from './landing-content';

export function LandingUserSection() {
  return (
    <section id="users" className="mt-24 scroll-mt-32 rounded-[32px] border border-brand-border bg-surface/60 p-8 backdrop-blur md:p-10">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-secondary">
            User experience
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Built for people who want their health data to make sense.
          </h2>
          <p className="mt-4 leading-relaxed text-text-secondary">
            TovaPulse connects end users, wearables, and admin operations so health teams can support
            members with clearer timelines, smarter insights, and faster follow-up.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {userBenefits.map((item) => (
            <div key={item.title} className="rounded-card border border-brand-border bg-background/40 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-button bg-brand-primary-glow text-brand-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
