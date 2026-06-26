'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Users, Lock, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useRole } from '@/hooks/api/use-roles';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export default function RoleViewPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const { data: role, isLoading } = useRole(roleId);
  const isDelayedLoading = useDelayedLoading(isLoading);

  if (isDelayedLoading) {
    return <VitalsLoader label="Loading role details" />;
  }

  if (!role) {
    return (
      <PageShell title="Role not found" description="This role record could not be loaded.">
        <Button variant="outline" onClick={() => router.push('/roles')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roles
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Access Control"
      title={role.name}
      description={`Role Slug: ${role.slug}`}
      actions={
        <Button variant="outline" onClick={() => router.push('/roles')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Role Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-brand-primary" />
                Role Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-brand-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-brand-primary" />
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-text-muted block">Role Name</span>
                  <span className="text-lg font-bold">{role.name}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Identifier (Slug)</span>
                  <code className="text-sm font-mono bg-surface-secondary px-2 py-1 rounded">{role.slug}</code>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">User Count</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-brand-secondary" />
                    <span className="font-semibold text-xl">{role.userCount || 0}</span>
                    <span className="text-sm text-text-muted">active users</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary leading-relaxed bg-surface-secondary/50 p-4 rounded-lg border border-brand-border/50 italic">
                {role.description || "No description provided for this role."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Permissions List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-brand-border/50 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-brand-tertiary" />
                Assigned Permissions
              </CardTitle>
              <p className="text-sm text-text-muted mt-1">
                This role grants the following capabilities across the platform.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {(role as any).permissions?.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(role as any).permissions.map((permission: any) => (
                    <div 
                      key={permission.id} 
                      className="flex items-start gap-3 p-3 rounded-xl border border-brand-border/50 bg-surface-elevated/50 transition-colors hover:bg-surface-elevated"
                    >
                      <CheckCircle2 className="h-5 w-5 text-brand-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{permission.name}</p>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{permission.slug}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Lock className="h-12 w-12 text-text-muted/30 mb-4" />
                  <p className="text-text-muted italic">No permissions explicitly assigned to this role.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
