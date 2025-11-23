import { Casetype, UpdateCaseDetailsType } from "@/types/types/Case";
import { CaseDocumentType } from "@/types/types/CaseDocument";
import {
  DeleteCaseDocument,
  UploadCaseDocument,
} from "@/utils/api/services/CaseDocumentServices";
import { UpdateCaseDetails } from "@/utils/api/services/CaseServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadCaseDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation<CaseDocumentType, any, FormData>({
    mutationFn: UploadCaseDocument,
    onError: (error) => {
      const message = error?.response?.data?.error;
      //   console.log("error ", error);
      toast.error(message || "Error uploading case document");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cases", "documents"] });
    },
  });
}

export function useDeleteCaseDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation<unknown, any, string>({
    mutationFn: DeleteCaseDocument,
    onError: (err) => {
      const message = err?.response?.data?.error;
      toast.error(message || "Error deleting case document");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cases", "documents"] });
    },
  });
}


export function useUpdateCaseDetailsMutation() {
  const queryClient = useQueryClient();
  return useMutation<Casetype, any, UpdateCaseDetailsType>({
    mutationFn: UpdateCaseDetails,
    onError: (err) => {
      const message = err?.response?.data?.error;
      toast.error(message || "Error updating case details");
    },
    onSettled: (data) => {
      queryClient.setQueryData(["case", data?.id], (old: Casetype) => {
        if (!old) return old
        return {
          ...old,
          title: data?.title,
          estimatedValue: data?.estimatedValue,
          summary: data?.summary,
          nextHearing: data?.nextHearing,
          status: data?.status,
        }
      })
    },
  });
}