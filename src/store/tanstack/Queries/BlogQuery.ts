import { store } from "@/store/redux/store";
import {
  FetchBlogsByLawyerQueryType,
  FetchBlogsByLawyerResponse,
} from "@/types/types/BlogType";
import { FetchBlogsByLawyer } from "@/utils/api/services/BlogService";
import { useQuery } from "@tanstack/react-query";

export function useFetchBlogsByLawyer(query: FetchBlogsByLawyerQueryType) {
  const { user } = store.getState().Auth;
  return useQuery<FetchBlogsByLawyerResponse>({
    queryFn: () => FetchBlogsByLawyer(query),
    queryKey: ["lawyer", "blogs",query],
    enabled: Boolean(user?.role === "lawyer" && user.user_id),
    staleTime: 1000 * 60,
  });
}
