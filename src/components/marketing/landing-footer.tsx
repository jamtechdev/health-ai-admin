export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-brand-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 text-sm text-text-muted md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <img src="/tovapulse-logo.png" alt="TovaPulse" className="h-7 w-7" />
            <p className="font-semibold text-text-secondary">TovaPulse</p>
          </div>
          <p className="mt-1">Biometric intelligence dashboard for administrators.</p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-text-secondary">Platform</p>
          <div className="flex flex-col gap-2">
            <a href="#platform" className="transition hover:text-text-primary">Health data</a>
            <a href="#admin-view" className="transition hover:text-text-primary">Admin view</a>
            <a href="#about" className="transition hover:text-text-primary">About us</a>
            <a href="#contact" className="transition hover:text-text-primary">Contact</a>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold text-text-secondary">Account</p>
          <div className="flex flex-col gap-2">
            <a href="/login" className="transition hover:text-text-primary">Login</a>
            <a href="/forgot-password" className="transition hover:text-text-primary">Forgot password</a>
            <a href="/verify-email" className="transition hover:text-text-primary">Verify email</a>
          </div>
        </div>
        <div>
          <p className="mb-3 font-semibold text-text-secondary">Legal</p>
          <div className="flex flex-col gap-2">
            <a href="/privacy-policy" className="transition hover:text-text-primary">Privacy Policy</a>
            <a href="/terms-of-service" className="transition hover:text-text-primary">Terms of Service</a>
            <a href="/delete-account" className="transition hover:text-text-primary">Delete account</a>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-border py-4 text-center text-sm text-text-muted">
        <p>© {new Date().getFullYear()} TovaPulse. Administrator access only.</p>
      </div>
    </footer>
  );
}
