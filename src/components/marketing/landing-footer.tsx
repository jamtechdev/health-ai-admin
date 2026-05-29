export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-brand-border bg-surface/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-text-secondary">TovaPulse</p>
          <p className="mt-1">Biometric intelligence dashboard for administrators.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#platform" className="transition hover:text-text-primary">
            Health data
          </a>
          <a href="#about" className="transition hover:text-text-primary">
            About us
          </a>
          <a href="#admin-view" className="transition hover:text-text-primary">
            Admin view
          </a>
          <a href="#contact" className="transition hover:text-text-primary">
            Contact
          </a>
        </div>
        <p>© {new Date().getFullYear()} TovaPulse. Administrator access only.</p>
      </div>
    </footer>
  );
}
