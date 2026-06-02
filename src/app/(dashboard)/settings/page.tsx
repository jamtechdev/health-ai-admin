'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { toast } from 'sonner';
import { Save, Settings2, ShieldCheck, Smartphone, Bell, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/ui/page-shell';
import { useSettingsList, useUpsertSetting } from '@/hooks/api/use-settings';

type FieldType = 'text' | 'number' | 'boolean' | 'select' | 'textarea';
type SettingValue = string | number | boolean;

interface SettingField {
  key: string;
  label: string;
  description: string;
  type: FieldType;
  defaultValue: SettingValue;
  options?: string[];
}

interface SettingSection {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  fields: SettingField[];
}

const settingSections: SettingSection[] = [
  {
    title: 'General',
    description: 'Branding and default admin experience.',
    icon: Settings2,
    fields: [
      { key: 'app.name', label: 'App name', description: 'Shown across admin and app surfaces.', type: 'text', defaultValue: 'TovaPulse' },
      { key: 'app.theme', label: 'Default theme', description: 'Initial theme preference for supported clients.', type: 'select', options: ['system', 'dark', 'light'], defaultValue: 'system' },
      { key: 'app.supportEmail', label: 'Support email', description: 'Public support contact for users.', type: 'text', defaultValue: 'support@tovapulse.com' },
      { key: 'app.maintenanceMode', label: 'Maintenance mode', description: 'Use when you want clients to show maintenance messaging.', type: 'boolean', defaultValue: false },
    ],
  },
  {
    title: 'Security',
    description: 'Authentication and account access controls.',
    icon: ShieldCheck,
    fields: [
      { key: 'auth.allowRegistration', label: 'Allow app registration', description: 'Controls whether mobile users can self-register.', type: 'boolean', defaultValue: true },
      { key: 'auth.requireEmailVerification', label: 'Require email verification', description: 'Require verified email before full access.', type: 'boolean', defaultValue: false },
      { key: 'auth.sessionDays', label: 'Refresh session days', description: 'How long refresh sessions should stay valid.', type: 'number', defaultValue: 365 },
    ],
  },
  {
    title: 'Mobile App',
    description: 'Mobile release controls and user messaging.',
    icon: Smartphone,
    fields: [
      { key: 'mobile.minAppVersion', label: 'Minimum app version', description: 'Old app versions below this can be warned or blocked.', type: 'text', defaultValue: '1.0.0' },
      { key: 'mobile.forceUpdate', label: 'Force update', description: 'Ask mobile clients to block outdated versions.', type: 'boolean', defaultValue: false },
      { key: 'mobile.welcomeMessage', label: 'Welcome message', description: 'Short message shown in mobile onboarding/dashboard.', type: 'textarea', defaultValue: 'Welcome to TovaPulse.' },
    ],
  },
  {
    title: 'Notifications',
    description: 'Default notification channel switches.',
    icon: Bell,
    fields: [
      { key: 'notifications.emailEnabled', label: 'Email notifications', description: 'Allow transactional email notifications.', type: 'boolean', defaultValue: true },
      { key: 'notifications.pushEnabled', label: 'Push notifications', description: 'Allow mobile push notifications.', type: 'boolean', defaultValue: true },
      { key: 'notifications.dailyInsightReminder', label: 'Daily insight reminder', description: 'Send a reminder when new health insights are ready.', type: 'boolean', defaultValue: true },
    ],
  },
  {
    title: 'AI & Billing',
    description: 'Feature toggles for insights and subscription flows.',
    icon: Sparkles,
    fields: [
      { key: 'ai.insightsEnabled', label: 'AI insights', description: 'Enable AI/rule-based health insights.', type: 'boolean', defaultValue: true },
      { key: 'ai.model', label: 'AI model label', description: 'Displayed model/config label for operations.', type: 'text', defaultValue: 'gpt-4o-mini' },
      { key: 'billing.subscriptionsEnabled', label: 'Subscriptions', description: 'Enable subscription-related user flows.', type: 'boolean', defaultValue: false },
    ],
  },
];

const knownSettingKeys = new Set(settingSections.flatMap((section) => section.fields.map((field) => field.key)));

function stringifySettingValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value, null, 2);
}

export default function SettingsPage() {
  const { data, isLoading } = useSettingsList();
  const upsertSetting = useUpsertSetting();
  const [values, setValues] = useState<Record<string, SettingValue>>({});

  useEffect(() => {
    const byKey = new Map((data ?? []).map((setting) => [setting.key, setting.value]));
    const nextValues: Record<string, SettingValue> = {};

    for (const section of settingSections) {
      for (const field of section.fields) {
        const value = byKey.get(field.key);
        nextValues[field.key] =
          typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
            ? value
            : field.defaultValue;
      }
    }

    setValues(nextValues);
  }, [data]);

  const customSettings = useMemo(
    () => (data ?? []).filter((setting) => !knownSettingKeys.has(setting.key)),
    [data],
  );

  const setFieldValue = (key: string, value: SettingValue) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const saveFields = async (fields: SettingField[], successMessage: string) => {
    try {
      await Promise.all(
        fields.map((field) =>
          upsertSetting.mutateAsync({
            key: field.key,
            value: values[field.key] ?? field.defaultValue,
          }),
        ),
      );
      toast.success(successMessage);
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const renderField = (field: SettingField) => {
    const value = values[field.key] ?? field.defaultValue;

    return (
      <div key={field.key} className="rounded-2xl border border-brand-border/70 bg-background/35 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <label className="text-sm font-semibold text-foreground">{field.label}</label>
            <p className="mt-1 text-xs leading-5 text-text-muted">{field.description}</p>
            <p className="mt-1 truncate text-[11px] text-text-disabled">{field.key}</p>
          </div>
          {field.type === 'boolean' ? (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-border bg-surface px-3 py-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-primary"
                checked={Boolean(value)}
                onChange={(event) => setFieldValue(field.key, event.target.checked)}
              />
              {value ? 'On' : 'Off'}
            </label>
          ) : null}
        </div>

        {field.type === 'text' && (
          <Input
            className="mt-3"
            value={String(value)}
            onChange={(event) => setFieldValue(field.key, event.target.value)}
          />
        )}

        {field.type === 'number' && (
          <Input
            className="mt-3"
            type="number"
            value={String(value)}
            onChange={(event) => setFieldValue(field.key, Number(event.target.value))}
          />
        )}

        {field.type === 'select' && (
          <select
            className="mt-3 flex h-10 w-full rounded-input border border-brand-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
            value={String(value)}
            onChange={(event) => setFieldValue(field.key, event.target.value)}
          >
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {field.type === 'textarea' && (
          <textarea
            className="mt-3 min-h-24 w-full rounded-input border border-brand-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
            value={String(value)}
            onChange={(event) => setFieldValue(field.key, event.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <PageShell
      eyebrow="Configuration"
      title="Settings"
      description="Global application configuration for admin and mobile clients."
      actions={
        <Button
          disabled={isLoading || upsertSetting.isPending}
          onClick={() =>
            saveFields(
              settingSections.flatMap((section) => section.fields),
              'All settings saved',
            )
          }
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          Save all
        </Button>
      }
    >

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="h-56 animate-pulse bg-surface-secondary/60" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            {settingSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.title} className="min-w-0">
                  <CardHeader className="gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-border bg-brand-primary/10 text-brand-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <CardTitle className="text-base">{section.title}</CardTitle>
                          <p className="mt-1 text-sm leading-6 text-text-muted">{section.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={upsertSetting.isPending}
                        onClick={() => saveFields(section.fields, `${section.title} settings saved`)}
                      >
                        Save
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">{section.fields.map(renderField)}</CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-border bg-surface-secondary">
                  <SlidersHorizontal className="h-5 w-5 text-brand-primary" />
                </span>
                <div>
                  <CardTitle className="text-base">Additional Settings</CardTitle>
                  <p className="mt-1 text-sm text-text-muted">Existing custom settings stored in the backend.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {customSettings.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {customSettings.map((setting) => (
                    <div key={setting.id} className="min-w-0 rounded-2xl border border-brand-border/70 bg-background/35 p-4">
                      <p className="truncate text-sm font-semibold">{setting.key}</p>
                      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-text-secondary">
                        {stringifySettingValue(setting.value)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No additional custom settings yet.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </PageShell>
  );
}
