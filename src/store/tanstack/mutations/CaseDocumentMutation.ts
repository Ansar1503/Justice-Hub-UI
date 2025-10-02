import { CaseDocumentType } from "@/types/types/CaseDocument";
import { UploadCaseDocument } from "@/utils/api/services/CaseDocumentServices";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadCaseDocumentMutation() {
  return useMutation<CaseDocumentType, any, FormData>({
    mutationFn: UploadCaseDocument,
    onError: (error) => {
      const message = error?.response?.data?.error;
    //   console.log("error ", error);
      toast.error(message || "Error uploading case document");
    },
    onSettled: (data) => {
      console.log("data uploaded", data);
    },
  });
}
