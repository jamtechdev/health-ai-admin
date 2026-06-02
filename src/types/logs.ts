export interface ActivityLog {
  id: string;
  module: string;
  description: string;
  createdAt: string;
  user?: { name: string; email: string };
  userAgent?: string | null;
  ip?: string | null;
  metadata?: { userAgent?: string | null; ip?: string | null };
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  createdAt: string;
  actor?: { name: string; email: string };
}
