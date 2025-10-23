import { SubscriptionType } from "@/types/types/SubscriptionType";
import axiosinstance from "../axios/axios.instance";
import {
  CommonQueies,
  SubscriptionRoute,
} from "@/utils/constants/RouteConstants";
import { store } from "@/store/redux/store";

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

export async function FetchCurrentUserSubscription() {
  const response = await axiosinstance.get(
    CommonQueies.api +
      CommonQueies.client +
      SubscriptionRoute.base +
      SubscriptionRoute.user
  );
  return response.data;
}

export async function CancelSubscription() {
  const response = await axiosinstance.delete(
    CommonQueies.api +
      CommonQueies.client +
      SubscriptionRoute.base +
      SubscriptionRoute.user
  );
  return response.data;
}

export async function UpdateSubscriptionPlan(
  payload: Omit<SubscriptionType, "createdAt" | "updatedAt">
) {
  const response = await axiosinstance.patch(
    CommonQueies.api +
      CommonQueies.admin +
      SubscriptionRoute.base +
      CommonQueies.params +
      payload.id,
    payload
  );
  return response.data;
}

export async function ChangeActiveSubscriptionStatus(params: {
  id: string;
  status: boolean;
}) {
  const response = await axiosinstance.patch(
    CommonQueies.api +
      CommonQueies.admin +
      SubscriptionRoute.base +
      SubscriptionRoute.status +
      CommonQueies.params +
      params.id,
    params
  );
  return response.data;
}

export async function SubscribePlan(params: { planId: string }) {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    CommonQueies.api +
      user?.role +
      SubscriptionRoute.base +
      SubscriptionRoute.subscribe,
    params
  );
  return response.data;
}
