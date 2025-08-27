import { NotificationType } from "@/types/types/Notification";
import {
  fetchChatMessages,
  fetchChatsForClientApi,
  fetchReviews,
} from "@/utils/api/services/clientServices";
import { fetchAllNotifications } from "@/utils/api/services/commonServices";
import { useInfiniteQuery } from "@tanstack/react-query";
import { store } from "../redux/store";

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

export function useInfiniteFetchReviews(user_id: string) {
  return useInfiniteQuery({
    queryKey: ["review", user_id],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchReviews(pageParam, user_id),
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
    enabled: user_id ? true : false,
  });
}

export function useInfiniteFetchAllNotifications(enabled: boolean) {
  const { user } = store.getState().Auth;
  return useInfiniteQuery<
    { data: NotificationType; nextCursor?: number },
    Error
  >({
    queryKey: ["notifications", user?.user_id],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchAllNotifications(pageParam),
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
    enabled: user?.user_id && enabled ? true : false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retryDelay: 30000,
  });
}
