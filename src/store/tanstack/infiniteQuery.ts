import { NotificationType } from "@/types/types/Notification";
import {
  fetchChatMessages,
  fetchChatsForClientApi,
  fetchReviews,
} from "@/utils/api/services/clientServices";
import {
  FetchBlogsByClient,
  fetchAllNotifications,
} from "@/utils/api/services/commonServices";
import { useInfiniteQuery } from "@tanstack/react-query";
import { store } from "../redux/store";
import {
  FetchBlogsByClientType,
  infiniteFetchBlogsByClient,
} from "@/types/types/BlogType";

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

export function useInfiniteFetchBlogsForClients(
  payload: FetchBlogsByClientType
) {
  const { user } = store.getState().Auth;
  return useInfiniteQuery<infiniteFetchBlogsByClient, any>({
    queryKey: ["blogs", payload],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => FetchBlogsByClient(pageParam, payload),
    getNextPageParam: (lastPage: any) => lastPage?.nextCursor ?? undefined,
    enabled: Boolean(user?.user_id),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retryDelay: 30000,
  });
}
