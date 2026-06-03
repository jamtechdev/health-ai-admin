export interface AccountDeletionRequestRecord {
  id: string;
  userId: string;
  reason: string | null;
  action: 'soft_delete' | 'user_request';
  status: 'pending' | 'reverted' | 'permanent_deleted';
  deletedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    status: string;
    deletedAt: string | null;
  } | null;
}
