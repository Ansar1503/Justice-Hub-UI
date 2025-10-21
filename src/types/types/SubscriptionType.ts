export type PlanBenefits = {
  bookingsPerMonth: number | "unlimited";
  followupBookingsPerCase: number | "unlimited";
  chatAccess: boolean;
  discountPercent: number;
  documentUploadLimit: number;
  expiryAlert: boolean;
  autoRenew: boolean;
};
export type SubscriptionIntervalType = "none" | "monthly" | "yearly";

export type SubscriptionType = {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: SubscriptionIntervalType;
  stripeProductId?: string;
  stripePriceId?: string;
  isFree: boolean;
  isActive: boolean;
  benefits: PlanBenefits;
  createdAt: Date;
  updatedAt: Date;
};

export type PlanCardData = {
  id: string
  name: string
  price: string
  period: string
  description: string
  badge: string | null
  features: string[]
  buttonText: string
  highlighted?: boolean
}
