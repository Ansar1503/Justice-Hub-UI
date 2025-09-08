import {
  CaseTypeFetchQuery,
  CaseTypeResponseWithPagination,
  CaseTypestype,
} from "@/types/types/CaseType";
import {
  AddCaseType,
  DeleteCasetype,
  UpdateCasetype,
} from "@/utils/api/services/CaseTypeServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAddCaseTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation<CaseTypestype, Error, { name: string; pid: string }>({
    mutationFn: AddCaseType,
    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error adding casetype");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["casetype"],
        exact: false,
      });
    },
  });
}

export function useUpdateCasetypeMutation(key: CaseTypeFetchQuery) {
  const queryClient = useQueryClient();
  return useMutation<
    CaseTypestype,
    Error,
    { name: string; pid: string; id: string },
    { previousData?: CaseTypeResponseWithPagination }
  >({
    mutationFn: UpdateCasetype,
    onError: (error: any, _, context) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error editing casetype");
      if (context?.previousData) {
        queryClient.setQueryData(["casetype", key], context.previousData);
      }
    },
    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: ["casetype", key] });

      const previousData =
        queryClient.getQueryData<CaseTypeResponseWithPagination>([
          "casetype",
          key,
        ]);

      queryClient.setQueryData<CaseTypeResponseWithPagination>(
        ["casetype", key],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((area) =>
              area.id === variables.id
                ? {
                    ...area,
                    name: variables.name,
                    practiceareaId: variables.pid,
                  }
                : area
            ),
          };
        }
      );
      return { previousData };
    },
    onSettled: (data) => {
      queryClient.setQueryData<CaseTypeResponseWithPagination>(
        ["casetype", key],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((area) =>
              area.id === data?.id
                ? {
                    ...area,
                    name: data.name,
                    practiceareaId: data.practiceareaId,
                  }
                : area
            ),
          };
        }
      );
    },
  });
}

export function useDeleteCasetypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteCasetype,
    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error Deleting casetype");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["casetype"],
        exact: false,
      });
    },
  });
}
