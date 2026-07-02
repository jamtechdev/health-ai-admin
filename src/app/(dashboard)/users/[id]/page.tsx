'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Shield, Calendar, User, Activity, Clock, CreditCard, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useUser } from '@/hooks/api/use-users';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: user, isLoading } = useUser(userId);
  const isDelayedLoading = useDelayedLoading(isLoading);

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
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                Subscription
                {user.activeSubscription && <BadgeCheck className="h-5 w-5 text-blue-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
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
    </PageShell>
  );
}
