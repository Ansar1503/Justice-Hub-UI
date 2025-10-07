import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import {
  CommissionRoutes,
  CommonQueies,
} from "@/utils/constants/RouteConstants";

export async function FetchCommissionSettings() {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.get(
    CommonQueies.api +
      user?.role +
      CommissionRoutes.base +
      CommissionRoutes.settings
  );
  return response.data;
}
