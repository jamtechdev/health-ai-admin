import type { User } from '@/store/auth.store';

const ADMIN_ROLE_SLUGS = new Set(['super-admin', 'admin']);

export function canAccessAdminPanel(user: User): boolean {
  return user.roles.some((role) => ADMIN_ROLE_SLUGS.has(role));
}
