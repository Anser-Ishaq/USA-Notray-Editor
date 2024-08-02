import { ISessionStatus } from '@/types/app';

export type UserSessionRequest = {
  sessionId: number;
};

export type NotarySessionRequest = {
  sessionId: number;
};

export type ParticipantDocsRequest = {
  sessionId: number;
};

export type UpdateSessionRequest = {
  sessionId: number;
  status: ISessionStatus;
  jobId: number;
  metadata?: string;
};

export type CompleteJobDocumentRequest = {
  doc_base64: string;
  job_id: number;
  job_doc_id: number;
  status: string;
  docId: number;
};
