import {
  CompleteJobDocumentRequest,
  NotarySessionRequest,
  ParticipantDocsRequest,
  UpdateSessionRequest,
} from '@/service/shared/Request/notarySessions';
import { NotarySessionResponse } from '@/service/shared/Response/notarySession';
import { ParticipantDocsResponse } from '@/service/shared/Response/participantDocs';

import { API_ENDPOINTS } from '../api/apiEndpoints';
import { HttpClient } from '../api/httpClient';

export const notarySessionClient = {
  getSession: (variables: NotarySessionRequest) =>
    HttpClient.get<NotarySessionResponse>(
      `${API_ENDPOINTS.GET_NOTARY_SESSION}/${variables.sessionId}`,
      variables,
    ),
  getParticipantDocs: (variables: ParticipantDocsRequest) =>
    HttpClient.get<ParticipantDocsResponse>(
      `${API_ENDPOINTS.GET_PARTICIPANT_DOCS}/${variables.sessionId}`,
      variables,
    ),
  updateSessionStatus: (variables: UpdateSessionRequest) =>
    HttpClient.patch<any>(
      `${API_ENDPOINTS.UPDATE_SESSION_STATUS}/${variables.sessionId}`,
      variables,
    ),
  completeJobDocument: (variables: CompleteJobDocumentRequest) =>
    HttpClient.patch<any>(
      `${API_ENDPOINTS.COMPLETE_JOB_DOCUMENT}/${variables.job_id}`,
      variables,
    ),
};
