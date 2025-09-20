import { CaseQueryResponseType, FetchCaseQueryType } from "@/types/types/Case";
import { FetchAllCasesByQuery } from "@/utils/api/services/CaseServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllCasesByRole(payload: FetchCaseQueryType) {
  return useQuery<CaseQueryResponseType>({
    queryKey: ["cases", payload],
    queryFn: () => FetchAllCasesByQuery(payload),
    enabled: Boolean(payload?.page && payload?.limit),
    staleTime: 1000 * 60,
  });
}
