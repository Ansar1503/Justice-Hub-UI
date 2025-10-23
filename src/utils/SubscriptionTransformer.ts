import type {
  PlanCardData,
  SubscriptionType,
} from "@/types/types/SubscriptionType";

export function transformSubscriptionToPlanCard(
  subscription: SubscriptionType,
  isCurrentPlan: boolean
): PlanCardData {
  const features: string[] = [];

  if (subscription.benefits.bookingsPerMonth === "unlimited") {
    features.push("Unlimited bookings per month");
  } else {
    features.push(
      `Up to ${subscription.benefits.bookingsPerMonth} bookings per month`
    );
  }

  if (subscription.benefits.followupBookingsPerCase === "unlimited") {
    features.push("Unlimited followup bookings per case");
  } else {
    features.push(
      `Up to ${subscription.benefits.followupBookingsPerCase} followup bookings per case`
    );
  }

  if (subscription.benefits.chatAccess) {
    features.push("Chat access");
  }

  features.push(
    `${subscription.benefits.discountPercent}% discount on services`
  );
  features.push(
    `${subscription.benefits.documentUploadLimit} MB document upload limit`
  );

  if (subscription.benefits.expiryAlert) {
    features.push("Expiry alerts");
  }

  if (subscription.benefits.autoRenew) {
    features.push("Auto-renewal");
  }

  const periodLabel = subscription.interval === "yearly" ? "/year" : "/month";
  const priceDisplay = subscription.isFree ? "₹0" : `₹${subscription.price}`;

  return {
    id: subscription.id,
    name: subscription.name,
    price: priceDisplay,
    period: periodLabel,
    description: subscription.description || "Perfect plan for your needs",
    badge: subscription.isFree ? "Free" : null,
    features,
    buttonText: isCurrentPlan ? "Current Plan" : "Subscribe",
    highlighted:isCurrentPlan,
    isFree: subscription.isFree,
  };
}

export function getPlanDisplayName(
  planId: string,
  plans: SubscriptionType[]
): string {
  const plan = plans.find((p) => p.id === planId);
  return plan?.name || "Unknown Plan";
}

export function getPlanPrice(
  planId: string,
  plans: SubscriptionType[]
): string {
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return "₹0";
  return plan.isFree ? "₹0" : `₹${plan.price}`;
}
