import { ProfessionalDetailsFormData } from "@/components/Lawyer/ProfessionalDetailsComponent";
import { store } from "@/store/redux/store";
import { lawyerProfessionalDetailsResponse } from "@/types/types/LawyerProfessionalDetailsType";
import { addLawyerProfessionalDetails } from "@/utils/api/services/LawyerServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export function useProfessionalDetailsUpdateMutation() {
  const queryClient = useQueryClient();
  const { user } = store.getState().Auth;
  return useMutation<
    lawyerProfessionalDetailsResponse,
    Error,
    ProfessionalDetailsFormData
  >({
    mutationFn: addLawyerProfessionalDetails,
    onError: (error: any) => {
      const message = error?.response?.data?.error;
      toast.error(message || "update failed");
    },
    onSuccess() {
      toast.success("lawyer Details updated successfully");
    },
    async onMutate(variables) {
      await queryClient.cancelQueries({
        queryKey: ["lawyer", "profession", user?.user_id],
      });

      const previousData =
        queryClient.getQueryData<lawyerProfessionalDetailsResponse>([
          "lawyer",
          "profession",
          user?.user_id,
        ]);

      queryClient.setQueryData<lawyerProfessionalDetailsResponse>(
        ["lawyer", "profession", user?.user_id],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            consultationFee: variables.consultationFee,
            description: variables.description,
            experience: variables.experience,
            specialisations: variables.specialisations,
            practiceAreas: variables.practiceAreas,
          };
        }
      );
      return { previousData };
    },
    onSettled: (data) => {
      queryClient.setQueryData<lawyerProfessionalDetailsResponse>(
        ["lawyer", "profession", user?.user_id],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            ...data,
          };
        }
      );
    },
  });
}
