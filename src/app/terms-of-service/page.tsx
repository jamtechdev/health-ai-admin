'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PageData {
  title: string;
  content: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const legalContentClass =
  'public-page-content mt-8 max-w-none space-y-4';

const termsOfServiceFallback = `
<p class="updated">Last updated: June 2026</p>
<p>By using TovaPulse, you agree to these terms. Please read them carefully.</p>
<h2>Use of Service</h2>
<p>You must be at least 18 years old to use this service. You are responsible for maintaining the confidentiality of your account credentials.</p>
<h2>Health Data</h2>
<p>Health insights provided are for informational purposes only and do not constitute medical advice. Always consult a healthcare professional.</p>
<h2>Limitation of Liability</h2>
<p>TovaPulse is not liable for any damages arising from your use of the service or reliance on health insights.</p>
<h2>Changes</h2>
<p>We may update these terms at any time. Continued use after changes constitutes acceptance.</p>
<h2>Contact</h2>
<p>Questions? Email us at support@tovapulse.com.</p>
`;

function PageContent({ slug, fallbackTitle, fallbackBody }: { slug: string; fallbackTitle: string; fallbackBody: string }) {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/backend/pages/slug/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((res) => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-secondary" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-surface-secondary" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-secondary" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-surface-secondary" />
        </div>
      </div>
    );
  }

  const title = data?.title ?? fallbackTitle;
  const body = data?.content ?? fallbackBody;

  return (
    <div className="mx-auto max-w-3xl py-16">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {data?.updatedAt && (
        <p className="mt-2 text-sm text-text-muted">Last updated: {new Date(data.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      )}
      <div
        className={legalContentClass}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-foreground">TovaPulse</Link>
          <Link href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</Link>
        </div>
      </header>
      <main className="px-4">
        <PageContent
          slug="terms-of-service"
          fallbackTitle="Terms of Service"
          fallbackBody={termsOfServiceFallback}
        />
      </main>
      <footer className="border-t border-brand-border py-8 text-center text-sm text-text-muted">
        <div className="mx-auto max-w-3xl px-4">
          <Link href="/privacy-policy" className="transition hover:text-foreground">Privacy Policy</Link>
          <span className="mx-3">&middot;</span>
          <Link href="/terms-of-service" className="transition hover:text-foreground">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
