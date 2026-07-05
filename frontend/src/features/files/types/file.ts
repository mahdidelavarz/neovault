export interface UploadedFile {
  id: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
