export type PaymentPurpose = "subscription" | "appointment";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentProvider = "stripe";

export interface PaymentBaseType {
  id: string;
  clientId: string;
  paidFor: PaymentPurpose;
  referenceId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerRefId: string;
  createdAt: string;
}

export interface PaymentfetchPayload {
  page: number;
  limit: number;
  sortBy: "date" | "amount";
  order: "asc" | "desc";
  status: "pending" | "paid" | "failed" | "refunded" | "all";
  paidFor: "subscription" | "appointment" | "all";
}
