import { ResponseType } from "@/types/types/LoginResponseTypes";
import { SessionDocument } from "@/types/types/sessionType";
import { uploadDocuments } from "@/utils/api/services/clientServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useDocumentUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseType & { data: SessionDocument },
    Error,
    { payload: FormData; setProgress?: (value: number) => void }
  >({
    mutationFn: ({
      payload,
      setProgress,
    }: {
      payload: FormData;
      setProgress?: (value: number) => void;
    }) => uploadDocuments(payload, setProgress),
    onSuccess: (data) => {
      toast.success(data.message || "Document uploaded successfully");
      queryClient.setQueryData(
        ["session", "documents", data?.data?.session_id],
        (old: ResponseType & { data: SessionDocument }) => {
          return {
            ...old,
            data: data.data,
          };
        }
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Document Upload Failed! Try again later.";
      error.message = message;
      toast.error(message);
    },
  });
}
