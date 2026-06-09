'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Shield, Calendar, Mail, User, Activity, Clock } from 'lucide-react';
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
