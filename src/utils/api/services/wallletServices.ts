import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { WalletRoutes } from "@/utils/constants/RouteConstants";

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

export async function fetchWalletTransactions(payload: { page: number }) {
  const { user, token } = store.getState().Auth;
  const response = await axiosinstance.get(
    WalletRoutes.api +
      user?.role +
      WalletRoutes.base +
      WalletRoutes.transactions +
      WalletRoutes.pageQuery +
      payload.page,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
