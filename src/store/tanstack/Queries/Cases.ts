import {
  AggregatedCasesData,
  CaseQueryResponseType,
  FetchCaseQueryType,
} from "@/types/types/Case";
import {
  FetchAllCasesByQuery,
  FetchCaseDetails,
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
