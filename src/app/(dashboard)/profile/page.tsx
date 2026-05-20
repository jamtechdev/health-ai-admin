'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-slate-500">{user?.email}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfile)} className="space-y-4">
            <Input {...profileForm.register('name')} placeholder="Name" />
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPassword)} className="space-y-4">
            <Input type="password" placeholder="Current password" {...passwordForm.register('currentPassword')} />
            <Input type="password" placeholder="New password" {...passwordForm.register('newPassword')} />
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
