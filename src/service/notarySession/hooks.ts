import { useMutation, useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/service/api/apiEndpoints';
import { notarySessionClient } from '@/service/notarySession/client';
import {
  CompleteJobDocumentRequest,
  NotarySessionRequest,
  ParticipantDocsRequest,
  UpdateSessionRequest,
  UserSessionRequest,
} from '@/service/shared/Request/notarySessions';

export function useUserSessionQuery(variables: UserSessionRequest) {
  return useQuery({
    queryKey: [API_ENDPOINTS.GET_USER_SESSION],
    queryFn: () => notarySessionClient.getUserSession(variables),
  });
}

export function useNotarySessionQuery(variables: NotarySessionRequest) {
  return useQuery({
    queryKey: [API_ENDPOINTS.GET_NOTARY_SESSION],
    queryFn: () => notarySessionClient.getSession(variables),
  });
}

export function usePartcipantDocsQuery(variables: ParticipantDocsRequest) {
  return useQuery({
    queryKey: [API_ENDPOINTS.GET_PARTICIPANT_DOCS],
    queryFn: () => notarySessionClient.getParticipantDocs(variables),
  });
}

export function useUpdateSessionMutation() {
  return useMutation<any, Error, UpdateSessionRequest>({
    mutationFn: notarySessionClient.updateSessionStatus,
  });
}

export function useCompleteJobDocumentMutation() {
  return useMutation<any, Error, CompleteJobDocumentRequest>({
    mutationFn: notarySessionClient.completeJobDocument,
  });
}
