import { ResponseType } from "@/types/types/LoginResponseTypes";
import { uploadDocuments } from "@/utils/api/services/clientServices";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useDocumentUpdateMutation() {
  return useMutation<
    ResponseType,
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
