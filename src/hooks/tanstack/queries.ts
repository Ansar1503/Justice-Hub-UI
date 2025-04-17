import { fetchClientData } from "@/services/clientServices";
import { useQuery } from "@tanstack/react-query";


export function useFetchClientData(){
    return useQuery({
        queryKey:["client"],
        queryFn:fetchClientData
    })
}
