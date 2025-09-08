import {
  CaseTypeFetchQuery,
  CaseTypeResponseWithPagination,
} from "@/types/types/CaseType";
import { fetchAllCaseTypes } from "@/utils/api/services/CaseTypeServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllCaseTypes(payload: CaseTypeFetchQuery) {
  return useQuery<CaseTypeResponseWithPagination>({
    queryKey: ["casetype", payload],
    queryFn: () => fetchAllCaseTypes(payload),
    staleTime: 1000 * 60,
    enabled: Boolean(payload?.page && payload?.limit),
    refetchInterval: false,
  });
}
