import { fetchClientData } from "@/services/clientServices";
import { fetchUserByRole } from "@/services/UserServices";
import { useQuery } from "@tanstack/react-query";


export function useFetchClientData(){
    return useQuery({
        queryKey:["user"],
        queryFn:fetchClientData,
        staleTime:1000 * 60 * 10,
    })
}

export function useFetchUsersByRole(role:"client" | "lawyer" | "all"){
    return useQuery({
        queryKey:["user",role],
        queryFn:()=>fetchUserByRole(role),
        staleTime:1000 * 60 * 10, 
    })
}