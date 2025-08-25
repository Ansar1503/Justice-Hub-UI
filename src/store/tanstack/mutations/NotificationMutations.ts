import { NotificationType } from "@/types/types/Notification";
import { updateNotificationStatus } from "@/utils/api/services/commonServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function UpdateReadNotification() {
  const queryClient = useQueryClient();
  return useMutation<NotificationType, Error, { id: string; status: boolean }>({
    mutationFn: (payload) => updateNotificationStatus(payload),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
}
