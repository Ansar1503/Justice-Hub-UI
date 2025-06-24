import { fetchChatsForClientApi } from "@/utils/api/services/clientServices";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteFetchChatforClient(search: string) {
  return useInfiniteQuery({
    queryKey: ["client", "chatsessions", search],
    queryFn: ({ pageParam = 1 }) => fetchChatsForClientApi(pageParam, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
  });
}

export function useInfiniteFetchChatforLawyer() {
  return useInfiniteQuery({
    queryKey: ["user", "chatMessages"],
    queryFn: ({ pageParam = 1 }) => fetchChatMessages(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
  });
}
