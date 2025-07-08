import {
  fetchChatMessages,
  fetchChatsForClientApi,
} from "@/utils/api/services/clientServices";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteFetchChatforClient(search: string) {
  return useInfiniteQuery({
    queryKey: ["client", "chatsessions"],
    queryFn: ({ pageParam }) => fetchChatsForClientApi(pageParam, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
  });
}

export function useInfiniteFetchMessages(sessionId: string) {
  return useInfiniteQuery({
    queryKey: ["user", "chatMessages", sessionId],
    queryFn: ({ pageParam }) => fetchChatMessages(pageParam, sessionId),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
    select: (data) => ({
      pageParams: [...data.pageParams].reverse(),
      pages: [...data.pages].reverse(),
    }),
    enabled: sessionId ? true : false,
  });
}
