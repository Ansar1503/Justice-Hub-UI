import {
  PracticeAreaQuery,
  PracticeAreaResponse,
  PracticeAreaType,
} from "@/types/types/PracticeAreaType";
import {
  AddPracticeArea,
  deletePracticeArea,
  updatePracticeArea,
} from "@/utils/api/services/PracticeAreaServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAddPracticeAreasMutation() {
  const queryClient = useQueryClient();
  return useMutation<PracticeAreaType, Error, { name: string; specId: string }>(
    {
      mutationFn: AddPracticeArea,
      onError: (error: any) => {
        const message = error?.response?.data?.error;
        toast.error(message || "Error adding practice area  ");
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["practiceareas"],
          exact: false,
        });
      },
    }
  );
}
export function useEditPracticeAreaMutation(key: PracticeAreaQuery) {
  const queryClient = useQueryClient();

  return useMutation<
    PracticeAreaType,
    Error,
    { id: string; name: string; specId: string },
    { previousData?: PracticeAreaResponse }
  >({
    mutationFn: updatePracticeArea,

    onError: (error: any, _, context) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error editing mutation");
      if (context?.previousData) {
        queryClient.setQueryData(["practiceareas", key], context.previousData);
      }
    },

    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: ["practiceareas", key] });

      const previousData = queryClient.getQueryData<PracticeAreaResponse>([
        "practiceareas",
        key,
      ]);

      queryClient.setQueryData<PracticeAreaResponse>(
        ["practiceareas", key],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((area) =>
              area.id === variables.id
                ? {
                    ...area,
                    name: variables.name,
                    specializationId: variables.specId,
                  }
                : area
            ),
          };
        }
      );
      return { previousData };
    },

    onSettled: (data) => {
      queryClient.setQueryData<PracticeAreaResponse>(
        ["practiceareas", key],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((area) =>
              area.id === data?.id
                ? {
                    ...area,
                    name: data.name,
                    specializationId: data.specializationId,
                  }
                : area
            ),
          };
        }
      );
    },
  });
}

export function useDeletePracticeAreaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePracticeArea,
    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error Deleting mutation");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["practiceareas"],
        exact: false,
      });
    },
  });
}
