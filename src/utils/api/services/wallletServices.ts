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
