import { ISessionStatus } from '@/types/app';

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
};

export type CompleteJobDocumentRequest = {
  doc_base64: string;
  job_id: number;
  job_doc_id: number;
  status: ISessionStatus.NOTARIZATION_COMPLETED;
  docId: number;
};
