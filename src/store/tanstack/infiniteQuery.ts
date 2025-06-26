import {
  fetchChatMessages,
  fetchChatsForClientApi,
} from "@/utils/api/services/clientServices";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteFetchChatforClient(search: string) {
  return useInfiniteQuery({
    queryKey: ["client", "chatsessions"],
    queryFn: ({ pageParam = 1 }) => fetchChatsForClientApi(pageParam, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
  });
}

export function useInfiniteFetchMessages(sessionId: string) {
  return useInfiniteQuery({
    queryKey: ["user", "chatMessages", sessionId],
    queryFn: ({ pageParam = 1 }) => fetchChatMessages(pageParam, sessionId),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
    enabled: sessionId ? true : false,
  });
}
