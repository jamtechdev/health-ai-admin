'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Mail, Send } from 'lucide-react';
import { contactCards } from './landing-content';

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialContactForm: ContactFormState = {
  name: '',
  email: '',
  company: '',
  message: '',
};

export function LandingContactSection() {
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactForm);
  const [contactSent, setContactSent] = useState(false);

  function updateContactField(field: keyof ContactFormState, value: string) {
    setContactForm((current) => ({ ...current, [field]: value }));
    setContactSent(false);
  }

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(`TovaPulse contact request from ${contactForm.name}`);
    const body = encodeURIComponent(
      [
        `Name: ${contactForm.name}`,
        `Email: ${contactForm.email}`,
        `Company: ${contactForm.company || 'Not provided'}`,
        '',
        'Message:',
        contactForm.message,
      ].join('\n'),
    );

    window.location.href = `mailto:admin@tovapulse.com?subject=${subject}&body=${body}`;
    setContactSent(true);
  }

  return (
    <section id="contact" className="mt-24 scroll-mt-28">
      <div className="rounded-[32px] border border-brand-border bg-surface/70 p-8 backdrop-blur md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">
              Contact us
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Need access, support, or a platform walkthrough?
            </h2>
            <p className="mt-4 leading-relaxed text-text-secondary">
              Reach the TovaPulse operations team for onboarding, admin access, wearable
              integration support, and production health checks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:admin@tovapulse.com"
                className="inline-flex h-12 items-center justify-center rounded-button bg-brand-primary px-6 text-sm font-semibold text-text-primary shadow-[0_0_24px_var(--primary-glow)] transition hover:bg-brand-primary/90"
              >
                Email operations
                <Mail className="ml-2 h-4 w-4" />
              </a>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-button border border-brand-border bg-background/40 px-6 text-sm font-semibold text-text-secondary transition hover:border-brand-primary/40 hover:text-text-primary"
              >
                Admin portal
              </Link>
            </div>
          </div>

          <div className="rounded-card border border-brand-border bg-background/40 p-5 md:p-6">
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <ContactInput
                  id="contact-name"
                  label="Full name"
                  value={contactForm.name}
                  placeholder="Your name"
                  required
                  onChange={(value) => updateContactField('name', value)}
                />
                <ContactInput
                  id="contact-email"
                  label="Email address"
                  value={contactForm.email}
                  placeholder="you@company.com"
                  required
                  type="email"
                  onChange={(value) => updateContactField('email', value)}
                />
              </div>
              <ContactInput
                id="contact-company"
                label="Company or role"
                value={contactForm.company}
                placeholder="Clinic, health brand, operations team..."
                onChange={(value) => updateContactField('company', value)}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary" htmlFor="contact-message">
                  How can we help?
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(event) => updateContactField('message', event.target.value)}
                  className="w-full resize-none rounded-input border border-brand-border bg-surface-elevated px-3 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-disabled focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="Tell us about admin access, integrations, support, or a business inquiry."
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-button bg-brand-primary px-6 text-sm font-semibold text-text-primary shadow-[0_0_24px_var(--primary-glow)] transition hover:bg-brand-primary/90"
              >
                Send contact request
                <Send className="ml-2 h-4 w-4" />
              </button>
              {contactSent ? (
                <p className="rounded-input border border-brand-secondary/30 bg-brand-secondary-glow px-4 py-3 text-sm text-brand-secondary">
                  Your email app is ready with the message. Send it to contact the admin team.
                </p>
              ) : null}
            </form>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {contactCards.map((item) => (
                <div key={item.label} className="rounded-input border border-brand-border bg-surface/50 p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-button bg-brand-primary-glow text-brand-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ContactInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
};

function ContactInput({ id, label, value, placeholder, onChange, required, type = 'text' }: ContactInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-secondary" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-input border border-brand-border bg-surface-elevated px-3 text-sm text-text-primary outline-none transition placeholder:text-text-disabled focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20"
        placeholder={placeholder}
      />
    </div>
  );
}
