import { SubscriptionType } from "@/types/types/SubscriptionType";
import axiosinstance from "../axios/axios.instance";
import {
  CommonQueies,
  SubscriptionRoute,
} from "@/utils/constants/RouteConstants";

export async function AddSubscriptionPlan(
  payload: Omit<SubscriptionType, "id" | "createdAt" | "updatedAt">
) {
  const response = await axiosinstance.post(
    CommonQueies.api + CommonQueies.admin + SubscriptionRoute.base,
    payload
  );
  return response.data;
}

export async function FetchAllSubscriptionPlans() {
  const response = await axiosinstance.get(
    CommonQueies.api + CommonQueies.admin + SubscriptionRoute.base
  );
  return response.data;
}