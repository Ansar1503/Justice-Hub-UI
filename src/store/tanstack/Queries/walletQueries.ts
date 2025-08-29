import { transactionType } from "@/components/Wallet/WalletTransactions";
import { store } from "@/store/redux/store";
import { WalletTransactions } from "@/types/types/WalletTransactions";
import { WalletType } from "@/types/types/WalletType";
import {
  fetchWalletByUser,
  fetchWalletTransactions,
} from "@/utils/api/services/wallletServices";
import { useQuery } from "@tanstack/react-query";

export function useFetchWalletByUser() {
  const { user } = store.getState().Auth;
  return useQuery<WalletType, Error>({
    queryKey: ["wallet", user?.user_id],
    queryFn: () => fetchWalletByUser(),
    enabled: !!user?.user_id,
    retry: 1,
  });
}

export function useFetchWalletTransactions(payload: {
  page: number;
  search: string;
  limit: number;
  type: transactionType;
  startDate?: Date;
  endDate?: Date;
}) {
  const { user } = store.getState().Auth;
  return useQuery<
    { data: WalletTransactions[] | []; page: number; totalPages: number },
    Error
  >({
    queryKey: ["wallet", "transactions", user?.user_id],
    queryFn: () => fetchWalletTransactions(payload),
    enabled: !!user?.user_id,
    retry: 1,
  });
}
