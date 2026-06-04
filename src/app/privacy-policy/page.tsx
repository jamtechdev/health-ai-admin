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
  'mt-8 max-w-none space-y-4 text-text-secondary [&_a]:text-brand-tertiary [&_a]:underline [&_h1]:hidden [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:text-text-secondary [&_li]:leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:text-text-secondary [&_p]:leading-relaxed [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_.updated]:text-sm [&_.updated]:text-text-muted';

const privacyPolicyFallback = `
<p class="updated">Last updated: June 2026</p>
<p>Your privacy is important to us. This policy describes how we collect, use, and protect your personal information.</p>
<h2>Information We Collect</h2>
<p>We collect information you provide directly, such as your name, email address, and health metrics data from connected wearable devices.</p>
<h2>How We Use Your Information</h2>
<p>We use your data to provide personalised health insights, improve our services, and communicate with you about your account.</p>
<h2>Data Sharing</h2>
<p>We do not sell your personal data. We may share anonymised or aggregated data for research and service improvement.</p>
<h2>Contact</h2>
<p>If you have questions, please contact us at support@tovapulse.com.</p>
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

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-brand-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold text-foreground">TovaPulse</Link>
          <Link href="/dashboard" className="text-sm text-text-muted transition hover:text-foreground">Dashboard</Link>
        </div>
      </header>
      <main className="px-4">
        <PageContent
          slug="privacy-policy"
          fallbackTitle="Privacy Policy"
          fallbackBody={privacyPolicyFallback}
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
