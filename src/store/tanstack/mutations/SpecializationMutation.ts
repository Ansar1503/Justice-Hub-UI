import {
  FetchSpecializationRequestPayloadType,
  SpecializationsType,
} from "@/types/types/SpecializationType";
import {
  AddorUpdateSpecialization,
  DeleteSpecialization,
} from "@/utils/api/services/adminServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSpecializationMutation(
  setCurrentPage: (vl: number) => void,
  key: FetchSpecializationRequestPayloadType,
  id: string | null
) {
  const queryClient = useQueryClient();
  return useMutation<SpecializationsType, Error, { name: string }>({
    mutationFn: ({ name }) => AddorUpdateSpecialization(name, id),

    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error saving specialization");
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["specialization"] });

      const cached = queryClient.getQueryData<{
        data: SpecializationsType[];
        totalCount: number;
        totalPage: number;
      }>(["specialization", key]);

      if (cached) {
        const { totalPage } = cached;
        if (!id && totalPage > key.page) {
          setCurrentPage(totalPage);
        }
      }
    },
  });
}

export function useDeleteSpecialization(
  setCurrentPage: (vl: number) => void,
  key: FetchSpecializationRequestPayloadType
) {
  const queryClient = useQueryClient();

  return useMutation<SpecializationsType, Error, string>({
    mutationFn: (id) => DeleteSpecialization(id),

    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message || "Error deleting specialization");
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["specialization"] });
      await queryClient.invalidateQueries({ queryKey: ["practiceareas"] });

      const cached = queryClient.getQueryData<{
        data: SpecializationsType[];
        totalCount: number;
        totalPage: number;
      }>(["specialization", key]);

      if (cached) {
        const { totalPage } = cached;

        if (key.page > totalPage) {
          setCurrentPage(totalPage > 0 ? totalPage : 1);
        }
      }
    },
  });
}
