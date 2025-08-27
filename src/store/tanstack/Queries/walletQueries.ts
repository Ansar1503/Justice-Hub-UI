import { store } from "@/store/redux/store";
import { WalletType } from "@/types/types/WalletType";
import { fetchWalletByUser } from "@/utils/api/services/wallletServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchWalletByUser() {
  const { user } = store.getState().Auth;
  return useQuery<WalletType, Error>({
    queryKey: ["wallet", user?.role],
    queryFn: () => fetchWalletByUser(),
    enabled: !!user?.user_id,
    staleTime: 300000,
    retry: 1,
  });
}
