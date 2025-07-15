export interface Frame {
  id: string;
  dataUrl: string;
  timestamp: number;
  similarity?: number;
}

export interface ProcessingProgress {
  stage: string;
  progress: number;
  total: number;
}