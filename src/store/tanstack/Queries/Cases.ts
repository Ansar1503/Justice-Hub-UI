import { appointmentOutputDto } from "@/types/types/AppointmentsType";
import {
  AggregatedCasesData,
  CaseQueryResponseType,
  FetchCaseQueryType,
} from "@/types/types/Case";
import {
  CaseDocumentsResponseWithPagination,
  FetchCasesDocumentsByCaseQueryType,
} from "@/types/types/CaseDocument";
import { SessionDataType } from "@/types/types/sessionType";
import { FethcAllCaseDocumentsByCase } from "@/utils/api/services/CaseDocumentServices";
import {
  FetchAllCasesByQuery,
  FetchCaseAppointments,
  FetchCaseDetails,
  FetchCaseSessions,
} from "@/utils/api/services/CaseServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllCasesByRole(payload: FetchCaseQueryType) {
  return useQuery<CaseQueryResponseType>({
    queryKey: ["cases", payload],
    queryFn: () => FetchAllCasesByQuery(payload),
    enabled: Boolean(payload?.page && payload?.limit),
    staleTime: 1000 * 60,
  });
}

export function useFetchCaseDetails(id: string | undefined) {
  return useQuery<AggregatedCasesData>({
    queryKey: ["case", id],
    queryFn: () => FetchCaseDetails(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}

export function useFetchCaseAppointments(id: string | undefined) {
  return useQuery<appointmentOutputDto[] | []>({
    queryKey: ["cases", "appointments", id],
    queryFn: () => FetchCaseAppointments(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}

export function useFetchCaseSessions(id: string | undefined) {
  return useQuery<SessionDataType[] | []>({
    queryKey: ["cases", "sessions", id],
    queryFn: () => FetchCaseSessions(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}

export function useFetchCaseDocuments(
  query: FetchCasesDocumentsByCaseQueryType
) {
  return useQuery<CaseDocumentsResponseWithPagination>({
    queryKey: ["cases", "documents", query],
    queryFn: () => FethcAllCaseDocumentsByCase(query),
    enabled: Boolean(query.caseId),
    staleTime: 1000 * 60,
    retry: 1,
  });
}
