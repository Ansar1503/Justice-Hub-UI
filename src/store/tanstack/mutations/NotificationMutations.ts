import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationType } from "@/types/types/Notification";
import { store } from "@/store/redux/store";
import { updateNotificationStatus } from "@/utils/api/services/commonServices";

export function useUpdateReadNotification() {
  const queryClient = useQueryClient();
  const { user } = store.getState().Auth;
  const queryKey = ["notifications", user?.user_id];

  return useMutation<NotificationType, Error, { id: string; status: boolean }>({
    mutationFn: (payload) => updateNotificationStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // queryClient.setQueryData<InfiniteData<any>>(queryKey, (old) => {
      //   if (!old) return old;
      //   return {
      //     ...old,
      //     pages: old.pages.map((page) => ({
      //       ...page,
      //       data: page.data.map((n: NotificationType) =>
      //         n.id === updatedNotification.id
      //           ? { ...n, isRead: updatedNotification.isRead }
      //           : n
      //       ),
      //     })),
      //   };
      // });
    },
    onError: (err) => {
      console.error("Failed to update notification read status:", err);
    },
  });
}
