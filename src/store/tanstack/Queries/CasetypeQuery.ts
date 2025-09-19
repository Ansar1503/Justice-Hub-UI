import {
  CaseTypeFetchQuery,
  CaseTypeResponseWithPagination,
  CaseTypestype,
} from "@/types/types/CaseType";
import {
  fetchAllCaseTypes,
  FetchCasetypeByPractice,
} from "@/utils/api/services/CaseTypeServices";
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

export function useFechCaseTypeByPractice(payload: string[] | undefined) {
  return useQuery<CaseTypestype[] | []>({
    queryKey: ["casetype", payload],
    queryFn: () => FetchCasetypeByPractice(payload),
    enabled: payload && payload.length != 0,
    staleTime: 1000 * 60,
  });
}
