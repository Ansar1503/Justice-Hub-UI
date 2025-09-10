import {
  PracticeAreaQuery,
  PracticeAreaResponse,
  PracticeAreaType,
} from "@/types/types/PracticeAreaType";
import {
  FetchAllPracticeAreas,
  fetchPracticeAreasbySpecIds,
} from "@/utils/api/services/PracticeAreaServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllPracticeAreaQuery(query: PracticeAreaQuery) {
  return useQuery<PracticeAreaResponse>({
    queryKey: ["practiceareas", query],
    queryFn: () => FetchAllPracticeAreas(query),
    staleTime: 1000 * 60,
    enabled: Boolean(query?.page && query?.limit),
  });
}

export function useFetchPracticeAreaBySpecIds(query: string[] | []) {
  return useQuery<PracticeAreaType[] | []>({
    queryKey: ["practiceareas", query],
    queryFn: () => fetchPracticeAreasbySpecIds(query),
    staleTime: 1000 * 60,
    enabled: Boolean(query.length),
  });
}
