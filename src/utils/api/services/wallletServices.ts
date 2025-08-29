import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { WalletRoutes } from "@/utils/constants/RouteConstants";
import { transactionType } from "@/components/Wallet/WalletTransactions";

export async function fetchWalletByUser() {
  const { token, user } = store.getState().Auth;
  const response = await axiosinstance.get(
    `${WalletRoutes.api}${user?.role}${WalletRoutes.base}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function fetchWalletTransactions(payload: {
  page: number;
  search: string;
  limit: number;
  type: transactionType;
  startDate?: Date;
  endDate?: Date;
}) {
  const { user, token } = store.getState().Auth;
  const response = await axiosinstance.get(
    WalletRoutes.api +
      user?.role +
      WalletRoutes.base +
      WalletRoutes.transactions +
      WalletRoutes.pageQuery +
      payload.page +
      WalletRoutes.limitQuery +
      payload.limit +
      WalletRoutes.searchQuery +
      payload.search +
      WalletRoutes.typeQuery +
      payload.type +
      WalletRoutes.startDateQuery +
      (payload.startDate || "") +
      WalletRoutes.endDateQuery +
      (payload.endDate || ""),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
