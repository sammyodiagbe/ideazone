import type { GenerationSettings, SectionKey } from './workspace';

export interface GenerateRequest {
  rawIdea: string;
  settings: GenerationSettings;
  context?: Record<SectionKey, unknown>;
  action?: 'generate' | 'regenerate' | 'simplify' | 'add-depth';
}

export interface GenerateResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StreamChunk {
  type: 'content' | 'done' | 'error';
  content?: string;
  data?: unknown;
  error?: string;
}
