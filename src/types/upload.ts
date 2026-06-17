export interface UploadRecord {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url?: string;
  domain?: string;
  createdAt: string;
}
