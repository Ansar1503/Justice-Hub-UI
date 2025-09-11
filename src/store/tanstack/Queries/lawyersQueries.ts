import { lawyerProfessionalDetailsResponse } from "@/types/types/LawyerProfessionalDetailsType";
import { LawyerVerificationType } from "@/types/types/LawyerVerificationType";
import { fetchLawyersProfessionalDetails, FetchLawyersVerificationDetails } from "@/utils/api/services/LawyerServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchLawyersProfessionalDetails(userId: string | undefined) {
  return useQuery<lawyerProfessionalDetailsResponse>({
    queryKey: ["lawyer", "profession", userId],
    queryFn: () => fetchLawyersProfessionalDetails(userId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !userId ? false : true,
  });
}

export function useFetchLawyersVerificationDetails(userId: string | undefined){
  return useQuery<LawyerVerificationType>({
    queryKey:["lawyer","verification",userId],
    queryFn:()=>FetchLawyersVerificationDetails(userId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !userId ? false : true,
  })
};
