export interface UploadRecord {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url?: string;
  createdAt: string;
}
