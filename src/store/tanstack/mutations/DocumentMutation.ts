import { SessionDocument } from "@/types/types/sessionType";
import {
  removeDocumentFile,
  uploadDocuments,
} from "@/utils/api/services/clientServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useDocumentUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    SessionDocument,
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
      toast.success("Document uploaded successfully");
      console.log("uopload document data", data);
      queryClient.setQueryData(
        ["session", "documents", data?.session_id],
        () => {
          return data;
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

export function useRemoveFile(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation<SessionDocument, Error, string>({
    mutationFn: (id) => removeDocumentFile(id, sessionId),
    onSuccess: (data) => {
      toast.success("Document removed successfully!");
      // console.log("data after remove", data);
      queryClient.setQueryData(["session", "documents", sessionId], () => {
        return data;
      });
    },
    onError: (error: any) => {
      const message =
        error.response.data?.message ||
        "Something went wrong please try again later!";
      error.message = message;
      toast.error(message);
    },
  });
}
