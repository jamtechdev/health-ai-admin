export type ContactStatus = 'pending' | 'replied' | 'closed';

export interface ContactRequestRecord {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  company: string | null;
  message: string;
  status: ContactStatus;
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactDashboardSummary {
  pendingCount: number;
  repliedCount: number;
  closedCount: number;
  totalCount: number;
  recentContacts: ContactRequestRecord[];
}
