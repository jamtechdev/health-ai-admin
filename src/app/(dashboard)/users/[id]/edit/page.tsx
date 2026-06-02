'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useUpdateUser } from '@/hooks/api/use-users';
import { api } from '@/lib/api/client';
import type { UpdateUserPayload } from '@/types/user';
import type { RoleRecord } from '@/types/role';
import type { UploadRecord } from '@/types/upload';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading: userLoading } = useUser(userId);
  const updateUser = useUpdateUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [avatar, setAvatar] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<RoleRecord[]>([]);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setStatus(user.status);
      setAvatar(user.avatar ?? '');
      setAvatarPreview(user.avatar ?? '');
      setSelectedRoleIds(user.roles?.map((r) => r.id) ?? []);
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/v1/roles?limit=100')
      .then((res) => res.json())
      .then((json) => setAllRoles(json.data?.items ?? []))
      .catch(() => {});
  }, []);

  if (userLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-secondary" />
        <div className="h-64 animate-pulse rounded-card bg-surface-secondary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">User not found</h2>
        <Button variant="outline" onClick={() => router.push('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
      </div>
    );
  }

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    setError('');
    try {
      const payload: UpdateUserPayload = {
        name,
        email,
        status,
        roleIds: selectedRoleIds,
        avatar: avatar.trim() || null,
      };
      if (password.trim()) payload.password = password;
      await updateUser.mutateAsync({ id: userId, payload });
      toast.success('User updated successfully');
      router.push('/users');
    } catch {
      setError('Failed to update user');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/users')} className="text-text-muted hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Edit User</h2>
          <p className="text-text-muted">{user.email}</p>
        </div>
      </div>

      <div className="rounded-card border border-brand-border bg-surface p-6 shadow-soft">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-surface-secondary">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" onError={() => setAvatarPreview('')} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-text-muted">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-text-secondary">Avatar</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-4 w-4" />
                  {uploading ? 'Uploading…' : 'Upload Image'}
                </Button>
                {avatar && (
                  <button
                    type="button"
                    className="text-xs text-brand-critical hover:underline"
                    onClick={() => {
                      setAvatar('');
                      setAvatarPreview('');
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const form = new FormData();
                    form.append('file', file);
                    const { data } = await api.post<{ data: UploadRecord }>('/uploads', form);
                    const url = data.data.url ?? '';
                    setAvatar(url);
                    setAvatarPreview(url);
                  } catch {
                    toast.error('Failed to upload image');
                  } finally {
                    setUploading(false);
                    if (fileRef.current) fileRef.current.value = '';
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Password <span className="text-text-muted">(leave empty to keep current)</span>
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-10 w-full rounded-input border border-brand-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Roles</label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-input border border-brand-border bg-surface-elevated p-2">
              {allRoles.map((role) => (
                <label
                  key={role.id}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-surface-secondary"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="h-4 w-4 rounded border-brand-border accent-brand-primary"
                  />
                  <span>{role.name}</span>
                  <span className="ml-auto text-xs text-text-muted">{role.slug}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-brand-critical">{error}</p>}

          <div className="flex justify-end gap-3 border-t border-brand-border pt-4">
            <Button variant="outline" onClick={() => router.push('/users')}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateUser.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
