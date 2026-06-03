'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/ui/page-shell';
import { VitalsLoader } from '@/components/ui/vitals-loader';
import { useUser, useUpdateUser } from '@/hooks/api/use-users';
import { api } from '@/lib/api/client';
import { API_BASE_URL } from '@/constants/api';
import type { UpdateUserPayload, UserRecord } from '@/types/user';
import type { RoleRecord } from '@/types/role';
import type { UploadRecord } from '@/types/upload';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading: userLoading } = useUser(userId);

  if (userLoading) {
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

  return <EditUserForm key={user.id} user={user} userId={userId} />;
}

function EditUserForm({ user, userId }: { user: UserRecord; userId: string }) {
  const router = useRouter();
  const updateUser = useUpdateUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(user.status);
  const [avatar, setAvatar] = useState(user.avatar ?? '');

  const p = user.profile ?? {};
  const [age, setAge] = useState<number | null>(p.age ?? null);
  const [gender, setGender] = useState<string | null>(p.gender ?? null);
  const [weightKg, setWeightKg] = useState<number | null>(p.weightKg ?? null);
  const [heightCm, setHeightCm] = useState<number | null>(p.heightCm ?? null);
  const [targetWeightKg, setTargetWeightKg] = useState<number | null>(p.targetWeightKg ?? null);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(p.primaryGoal ?? null);
  const [activityLevel, setActivityLevel] = useState<string | null>(p.activityLevel ?? null);
  const [sleepGoal, setSleepGoal] = useState<number | null>(p.sleepGoal ?? null);

  const [selectedRoleIds] = useState<string[]>(user.roles?.map((r) => r.id) ?? []);
  const [allRoles, setAllRoles] = useState<RoleRecord[]>([]);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user.avatar ?? '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const fullUrl = (path: string) => (path.startsWith('/') ? `${API_BASE_URL}${path}` : path);

  useEffect(() => {
    api.get('/roles?limit=100')
      .then((res) => setAllRoles(res.data.data?.items ?? []))
      .catch(() => {});
  }, []);

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
        avatar: avatar.trim() || null,
        age: age ?? null,
        gender: gender ?? null,
        weightKg: weightKg ?? null,
        heightCm: heightCm ?? null,
        targetWeightKg: targetWeightKg ?? null,
        primaryGoal: primaryGoal ?? null,
        activityLevel: activityLevel ?? null,
        sleepGoal: sleepGoal ?? null,
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
    <PageShell
      eyebrow="People"
      title="Edit User"
      description={user.email}
      className="mx-auto max-w-3xl"
      actions={
        <Button variant="outline" onClick={() => router.push('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      }
    >

      <div className="rounded-card border border-brand-border/80 bg-surface/85 p-4 shadow-soft sm:p-6">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-surface-secondary">
              {avatarPreview ? (
                <Image
                  src={fullUrl(avatarPreview)}
                  alt="Avatar"
                  width={64}
                  height={64}
                  unoptimized
                  className="h-full w-full object-cover"
                  onError={() => setAvatarPreview('')}
                />
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
                  } catch (err) {
                    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload image';
                    toast.error(msg);
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

          <div className="border-t border-brand-border pt-4">
            <h3 className="mb-3 text-sm font-semibold text-text-secondary">Health Profile</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Age</label>
                <Input type="number" value={age ?? ''} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Gender</label>
                <select
                  value={gender ?? ''}
                  onChange={(e) => setGender(e.target.value || null)}
                  className="flex h-10 w-full rounded-input border border-brand-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
                >
                  <option value="">Not set</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Weight (kg)</label>
                <Input type="number" step="0.1" value={weightKg ?? ''} onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Height (cm)</label>
                <Input type="number" step="0.1" value={heightCm ?? ''} onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Target Weight (kg)</label>
                <Input type="number" step="0.1" value={targetWeightKg ?? ''} onChange={(e) => setTargetWeightKg(e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Sleep Goal (hours)</label>
                <Input type="number" step="0.5" value={sleepGoal ?? ''} onChange={(e) => setSleepGoal(e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-text-secondary">Primary Goal</label>
                <Input value={primaryGoal ?? ''} onChange={(e) => setPrimaryGoal(e.target.value || null)} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-text-secondary">Activity Level</label>
                <select
                  value={activityLevel ?? ''}
                  onChange={(e) => setActivityLevel(e.target.value || null)}
                  className="flex h-10 w-full rounded-input border border-brand-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
                >
                  <option value="">Not set</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                  <option value="extremely_active">Extremely Active</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Roles</label>
            <div className="flex flex-wrap gap-2">
              {selectedRoleIds.length === 0 ? (
                <span className="text-sm text-text-muted">No roles assigned</span>
              ) : (
                allRoles
                  .filter((r) => selectedRoleIds.includes(r.id))
                  .map((role) => (
                    <span
                      key={role.id}
                      className="rounded-full bg-brand-secondary/15 px-3 py-1 text-xs font-medium text-brand-secondary"
                    >
                      {role.name}
                    </span>
                  ))
              )}
            </div>
          </div>

          {error && <p className="text-sm text-brand-critical">{error}</p>}

          <div className="flex flex-col justify-end gap-3 border-t border-brand-border pt-4 sm:flex-row">
            <Button variant="outline" onClick={() => router.push('/users')}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateUser.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateUser.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
