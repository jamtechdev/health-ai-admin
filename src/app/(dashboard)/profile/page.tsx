'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { getApiErrorMessage } from '@/lib/api/response';

const profileSchema = z.object({ name: z.string().min(2) });
const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name ?? '' } });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const onProfile = async (data: { name: string }) => {
    try {
      await authService.updateProfile(data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update profile'));
    }
  };

  const onPassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      await authService.changePassword(data);
      toast.success('Password changed');
      passwordForm.reset();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to change password'));
    }
  };

  return (
    <PageShell
      eyebrow="Account"
      title="Profile"
      description={user?.email ?? 'Manage your admin profile and password.'}
      className="mx-auto max-w-3xl"
    >
      <Card>
        <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfile)} className="space-y-4">
            <Input {...profileForm.register('name')} placeholder="Name" />
            <Button type="submit" className="w-full sm:w-auto">Save</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPassword)} className="space-y-4">
            <Input type="password" placeholder="Current password" {...passwordForm.register('currentPassword')} />
            <Input type="password" placeholder="New password" {...passwordForm.register('newPassword')} />
            <Button type="submit" className="w-full sm:w-auto">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
