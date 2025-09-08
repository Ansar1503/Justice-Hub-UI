import {
  PracticeAreaQuery,
  PracticeAreaResponse,
} from "@/types/types/PracticeAreaType";
import { FetchAllPracticeAreas } from "@/utils/api/services/PracticeAreaServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchAllPracticeAreaQuery(query: PracticeAreaQuery) {
  return useQuery<PracticeAreaResponse>({
    queryKey: ["practiceareas", query],
    queryFn: () => FetchAllPracticeAreas(query),
    staleTime: 1000 * 60,
    enabled: Boolean(query?.page && query?.limit),
  });
}
