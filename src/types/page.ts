export interface PageRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
