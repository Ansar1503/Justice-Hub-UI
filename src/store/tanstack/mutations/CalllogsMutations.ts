import {
  addCallLogs,
  endCallLogs,
} from "@/utils/api/services/CallLogsServices";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCalllogsMutation() {
  return useMutation<void, any, { sessionId: string; roomId: string }>({
    mutationFn: addCallLogs,
    onError: (err) => {
      const message = err.response?.data?.error || "failed addding log";
      toast.error(message);
    },
  });
}

export function useEndCallLogsMutation() {
  return useMutation<void, any, { sessionId: string; roomId: string }>({
    mutationFn: endCallLogs,
    onError: (err) => {
      const message = err.response?.data?.error || "failed addding log";
      toast.error(message);
    },
  });
}
