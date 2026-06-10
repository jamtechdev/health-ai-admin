export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  readAt: string | null;
  createdAt: string;
  User?: {
    id: string;
    email: string;
    name: string;
  };
}
