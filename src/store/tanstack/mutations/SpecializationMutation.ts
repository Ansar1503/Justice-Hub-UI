import {
  FetchSpecializationRequestPayloadType,
  SpecializationsResponseTypeWithPagination,
  SpecializationsType,
} from "@/types/types/SpecializationType";
import {
  AddorUpdateSpecialization,
  DeleteSpecialization,
} from "@/utils/api/services/adminServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSpecializationMutation(
  setCurrentPage: (val: number) => void,
  key: FetchSpecializationRequestPayloadType,
  id: string | null
) {
  const queryClient = useQueryClient();
  return useMutation<SpecializationsType, Error, { name: string }>({
    mutationFn: ({ name }) => AddorUpdateSpecialization(name, id),
    onSuccess: (newData) => {
      queryClient.setQueryData(
        ["specialization", key],
        (old: SpecializationsResponseTypeWithPagination) => {
          if (!old) return old;
          const exists = old.data.some((sp) => sp.id === newData.id);
          if (exists) {
            return {
              ...old,
              data: old.data.map((sp) =>
                sp.id === newData.id
                  ? { ...sp, name: newData.name, updatedAt: newData.updatedAt }
                  : sp
              ),
            };
          } else {
            const newTotalCount = old.totalCount + 1;
            const newCurrentPage = Math.ceil(newTotalCount / key.limit);
            if (newCurrentPage !== old.currentPage) {
              queryClient.setQueryData(
                ["specialization", { ...key, page: newCurrentPage }],
                () => {
                  return {
                    currentPage: newCurrentPage,
                    totalPage: newCurrentPage,
                    totalCount: newTotalCount,
                    data: [newData],
                  };
                }
              );
              setCurrentPage(newCurrentPage);
            } else {
              return {
                ...old,
                totalCount: newTotalCount,
                data: [...old.data, newData],
              };
            }
          }
        }
      );
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message);
    },
  });
}

export function useDeleteSpecialization(
  setCurrentPage: (val: number) => void,
  key: FetchSpecializationRequestPayloadType
) {
  const queryClient = useQueryClient();
  return useMutation<SpecializationsType, Error, string>({
    mutationFn: (id) => DeleteSpecialization(id),
    onSuccess: (deletedData) => {
      queryClient.setQueryData(
        ["specialization", key],
        (old: SpecializationsResponseTypeWithPagination | undefined) => {
          if (!old) return old;
          const newTotalCount = old.totalCount - 1;
          const newCurrentPage = Math.ceil(newTotalCount / key.limit);
          if (newCurrentPage === old.currentPage) {
            return {
              ...old,
              data: old.data.filter((sp) => sp.id !== deletedData.id),
              totalCount: newTotalCount,
            };
          } else {
            setCurrentPage(newCurrentPage);
            queryClient.removeQueries({ queryKey: ["specialization", key] });
          }
        }
      );
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message);
    },
  });
}
