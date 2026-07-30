'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Shield, Calendar, User, Activity, Clock, CreditCard, BadgeCheck, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useUser } from '@/hooks/api/use-users';
import { useCheckUserSubscription, useGrantPro } from '@/hooks/api/use-subscriptions';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';
import type { GrantProPayload } from '@/types/subscription';

type GrantMode = 'unlimited' | 'duration' | 'until';

const DURATION_PRESETS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: '1 year', days: 365 },
] as const;

function GrantProModal({
  open,
  onClose,
  userName,
  isPending,
  onGrant,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  isPending: boolean;
  onGrant: (payload: GrantProPayload) => void;
}) {
  const [mode, setMode] = useState<GrantMode>('unlimited');
  const [durationDays, setDurationDays] = useState(30);
  const [customDays, setCustomDays] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  if (!open) return null;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().slice(0, 10);

  const handleSubmit = () => {
    if (mode === 'unlimited') {
      onGrant({ unlimited: true });
      return;
    }
    if (mode === 'duration') {
      const days = customDays.trim() ? Number(customDays) : durationDays;
      if (!Number.isFinite(days) || days < 1) {
        toast.error('Enter a valid number of days');
        return;
      }
      onGrant({ durationDays: Math.floor(days) });
      return;
    }
    if (!expiryDate) {
      toast.error('Pick an expiry date');
      return;
    }
    onGrant({ expiryDate: new Date(`${expiryDate}T23:59:59`).toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-card border border-brand-border bg-surface p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Grant Pro
        </h3>
        <p className="mt-1.5 text-sm text-text-muted">
          Give <span className="font-medium text-foreground">{userName}</span> premium access.
          Any current active subscription will be replaced.
        </p>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'unlimited', label: 'Unlimited' },
                { id: 'duration', label: 'Duration' },
                { id: 'until', label: 'Until date' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMode(opt.id)}
                className={`rounded-button border px-2 py-2 text-sm font-medium transition-colors ${
                  mode === opt.id
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-brand-border text-text-muted hover:bg-surface-secondary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {mode === 'unlimited' && (
            <p className="text-sm text-text-muted rounded-lg bg-surface-secondary/50 p-3">
              Lifetime Pro — no expiry date. Remains active until revoked or replaced.
            </p>
          )}

          {mode === 'duration' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((p) => (
                  <button
                    key={p.days}
                    type="button"
                    onClick={() => {
                      setDurationDays(p.days);
                      setCustomDays('');
                    }}
                    className={`rounded-button border px-3 py-1.5 text-xs font-medium transition-colors ${
                      !customDays && durationDays === p.days
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-brand-border text-text-muted hover:bg-surface-secondary'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted mb-1.5 block">Custom days</label>
                <Input
                  type="number"
                  min={1}
                  max={3650}
                  placeholder="e.g. 14"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                />
              </div>
            </div>
          )}

          {mode === 'until' && (
            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 block">Expires on</label>
              <Input
                type="date"
                min={minDateStr}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Granting…' : 'Grant Pro'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: user, isLoading } = useUser(userId);
  const isDelayedLoading = useDelayedLoading(isLoading);

  const storeCheck = useCheckUserSubscription();
  const storeResult = storeCheck.data;
  const grantPro = useGrantPro();
  const [grantOpen, setGrantOpen] = useState(false);

  const handleStoreCheck = () => {
    storeCheck.mutate(userId, {
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to check subscription with the store';
        toast.error(message);
      },
    });
  };

  const handleGrantPro = (payload: GrantProPayload) => {
    grantPro.mutate(
      { userId, payload },
      {
        onSuccess: (sub) => {
          toast.success(
            sub.expiryDate
              ? `Pro granted until ${new Date(sub.expiryDate).toLocaleDateString()}`
              : 'Lifetime Pro granted',
          );
          setGrantOpen(false);
        },
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Failed to grant Pro';
          toast.error(message);
        },
      },
    );
  };

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading user profile" />;
  }

  if (!user) {
    return (
      <PageShell title="User not found" description="This user record could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="People"
      title={user.name}
      description={user.email}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => router.push(`/users/${userId}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-brand-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-32 w-32 rounded-full object-cover border-4 border-brand-primary/10 shadow-soft" />
              ) : (
                <div className="h-32 w-32 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-4xl font-bold border-4 border-brand-primary/10 shadow-soft">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                <span className="text-sm text-text-muted">Full Name</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                <span className="text-sm text-text-muted">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                <span className="text-sm text-text-muted">Status</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.status === 'ACTIVE'
                    ? 'bg-brand-secondary/15 text-brand-secondary'
                    : 'bg-surface-secondary text-text-muted'
                }`}>
                  {user.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-text-muted">Member Since</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles & Activity Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  Subscription
                  {user.activeSubscription && <BadgeCheck className="h-5 w-5 text-blue-500" />}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setGrantOpen(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Grant Pro
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStoreCheck}
                    disabled={storeCheck.isPending}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${storeCheck.isPending ? 'animate-spin' : ''}`} />
                    {storeCheck.isPending ? 'Checking store…' : 'Check with store'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {storeResult && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Live store status
                    </p>
                    {storeResult.store?.source && (
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-600">
                        {storeResult.store.source === 'app_store' ? 'Apple App Store' : 'Google Play'}
                        {storeResult.store.environment ? ` · ${storeResult.store.environment}` : ''}
                      </span>
                    )}
                  </div>

                  {storeResult.storeError ? (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-amber-700">{storeResult.storeError}</span>
                    </div>
                  ) : !storeResult.hasStorePurchase ? (
                    <div className="rounded-lg border border-brand-border/50 bg-surface-secondary/40 p-3 text-sm text-text-muted italic">
                      No store-backed (Apple/Google) purchase found for this user.
                    </div>
                  ) : storeResult.store ? (
                    <div className={`rounded-lg border p-3 ${
                      storeResult.store.status.is_subscribed
                        ? 'border-brand-secondary/30 bg-brand-secondary/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        {storeResult.store.status.is_subscribed ? (
                          <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-semibold">
                          {storeResult.store.status.is_subscribed
                            ? 'Active on store'
                            : storeResult.store.status.is_expired
                              ? 'Expired on store'
                              : 'Not subscribed'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex justify-between col-span-2 sm:col-span-1">
                          <span className="text-text-muted">Product</span>
                          <span className="font-medium truncate ml-2" title={storeResult.store.status.productId ?? ''}>
                            {storeResult.store.status.productId ?? '—'}
                          </span>
                        </div>
                        <div className="flex justify-between col-span-2 sm:col-span-1">
                          <span className="text-text-muted">Plan</span>
                          <span className="font-medium">{storeResult.store.status.subscription?.plan_name ?? '—'}</span>
                        </div>
                        <div className="flex justify-between col-span-2 sm:col-span-1">
                          <span className="text-text-muted">Expires</span>
                          <span className="font-medium">
                            {storeResult.store.status.subscription?.expires_date
                              ? new Date(storeResult.store.status.subscription.expires_date).toLocaleString()
                              : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between col-span-2 sm:col-span-1">
                          <span className="text-text-muted">Days left</span>
                          <span className="font-medium">{storeResult.store.status.subscription?.days_remaining ?? 0}</span>
                        </div>
                        <div className="flex justify-between col-span-2 sm:col-span-1">
                          <span className="text-text-muted">Auto renew</span>
                          <span className="font-medium">{storeResult.store.status.subscription?.auto_renew ? 'Yes' : 'No'}</span>
                        </div>
                        {storeResult.store.subscriptionState && (
                          <div className="flex justify-between col-span-2 sm:col-span-1">
                            <span className="text-text-muted">State</span>
                            <span className="font-medium text-xs">{storeResult.store.subscriptionState}</span>
                          </div>
                        )}
                        {storeResult.store.status.subscription?.original_transaction_id && (
                          <div className="flex justify-between col-span-2">
                            <span className="text-text-muted">Transaction</span>
                            <span className="font-mono text-xs truncate ml-2">
                              {storeResult.store.status.subscription.original_transaction_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {user.activeSubscription ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                    <span className="text-sm text-text-muted">Plan</span>
                    <span className="font-semibold text-blue-600">{user.activeSubscription.Plan?.name ?? user.activeSubscription.planName ?? '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                    <span className="text-sm text-text-muted">Type</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.activeSubscription.Plan?.planType === 'premium' ? 'bg-blue-500/15 text-blue-600' : 'bg-surface-secondary text-text-muted'
                    }`}>{user.activeSubscription.Plan?.planType ?? '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                    <span className="text-sm text-text-muted">Status</span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-brand-secondary/15 text-brand-secondary">{user.activeSubscription.status.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                    <span className="text-sm text-text-muted">Platform</span>
                    <span className="font-medium capitalize">{user.activeSubscription.platform ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                    <span className="text-sm text-text-muted">Start Date</span>
                    <span className="font-medium">{new Date(user.activeSubscription.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                    <span className="text-sm text-text-muted">Expiry Date</span>
                    <span className={`font-medium ${
                      user.activeSubscription.expiryDate && new Date(user.activeSubscription.expiryDate) < new Date() ? 'text-red-500' : ''
                    }`}>
                      {user.activeSubscription.expiryDate ? new Date(user.activeSubscription.expiryDate).toLocaleDateString() : 'Lifetime'}
                    </span>
                  </div>
                  {user.activeSubscription.purchaseDate && (
                    <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                      <span className="text-sm text-text-muted">Purchase Date</span>
                      <span className="font-medium">{new Date(user.activeSubscription.purchaseDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-brand-border/50">
                    <span className="text-sm text-text-muted">Auto Renew</span>
                    <span className="font-medium">{user.activeSubscription.autoRenew ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-text-muted">Trial</span>
                    <span className="font-medium">{user.activeSubscription.isTrial ? 'Yes' : 'No'}</span>
                  </div>
                  {user.activeSubscription.Plan?.price !== undefined && (
                    <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <span className="text-xs text-blue-600 font-medium block mb-1">Plan Price</span>
                      <span className="text-lg font-bold">${user.activeSubscription.Plan.price}</span>
                      {user.activeSubscription.Plan.durationDays && (
                        <span className="text-xs text-text-muted ml-1">/ {user.activeSubscription.Plan.durationDays} days</span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-text-muted italic text-sm">No active subscription.</div>
              )}
              {(user as any).subscriptionHistory?.filter((s: any) => s.status !== 'active').length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">History</p>
                  <div className="space-y-2">
                    {(user as any).subscriptionHistory
                      .filter((s: any) => s.status !== 'active')
                      .map((s: any) => (
                        <div key={s.id} className="flex justify-between items-center text-sm py-1.5 border-b border-brand-border/30">
                          <span className="text-text-muted">{s.Plan?.name ?? s.planName ?? '—'}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted">{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : '—'}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                              s.status === 'expired' ? 'bg-surface-secondary text-text-muted'
                              : s.status === 'cancelled' ? 'bg-amber-500/15 text-amber-600'
                              : 'bg-brand-critical/15 text-brand-critical'
                            }`}>{s.status}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-tertiary" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.roles?.length ? user.roles.map((role) => (
                  <div key={role.id} className="rounded-card border border-brand-border bg-surface-elevated p-3">
                    <p className="font-semibold text-brand-primary">{role.name}</p>
                    <p className="text-xs text-text-muted mt-1">{(role as any).description || 'No description'}</p>
                  </div>
                )) : (
                  <p className="text-sm text-text-muted italic">No roles assigned.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-brand-secondary" />
                Health Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.profile ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-surface-secondary/50 border border-brand-border/30">
                    <span className="text-xs text-text-muted block mb-1">Age</span>
                    <span className="text-xl font-bold">{user.profile.age || '—'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-secondary/50 border border-brand-border/30">
                    <span className="text-xs text-text-muted block mb-1">Gender</span>
                    <span className="text-xl font-bold capitalize">{user.profile.gender || '—'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-secondary/50 border border-brand-border/30">
                    <span className="text-xs text-text-muted block mb-1">Weight</span>
                    <span className="text-xl font-bold">{user.profile.weightKg ? `${user.profile.weightKg}kg` : '—'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-secondary/50 border border-brand-border/30">
                    <span className="text-xs text-text-muted block mb-1">Height</span>
                    <span className="text-xl font-bold">{user.profile.heightCm ? `${user.profile.heightCm}cm` : '—'}</span>
                  </div>
                  <div className="col-span-2 p-3 rounded-lg bg-brand-primary/5 border border-brand-primary/20">
                    <span className="text-xs text-brand-primary font-medium block mb-1">Primary Goal</span>
                    <span className="text-base font-semibold">{user.profile.primaryGoal || 'Not set'}</span>
                  </div>
                  <div className="col-span-2 p-3 rounded-lg bg-brand-secondary/5 border border-brand-secondary/20">
                    <span className="text-xs text-brand-secondary font-medium block mb-1">Activity Level</span>
                    <span className="text-base font-semibold capitalize">{user.profile.activityLevel?.replace(/_/g, ' ') || 'Not set'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-text-muted italic">
                  No health profile data available for this user.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-text-muted" />
                Account Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-xs text-text-muted">{new Date(user.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-brand-tertiary/10 flex items-center justify-center text-brand-tertiary">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last Activity</p>
                  <p className="text-xs text-text-muted">{(user as any).lastActiveAt ? new Date((user as any).lastActiveAt).toLocaleString() : 'Never'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GrantProModal
        open={grantOpen}
        onClose={() => setGrantOpen(false)}
        userName={user.name}
        isPending={grantPro.isPending}
        onGrant={handleGrantPro}
      />
    </PageShell>
  );
}
