import { transformSubscriptionToPlanCard } from "@/utils/SubscriptionTransformer";
import PlanCard from "./PlanCard";
import type { SubscriptionType } from "@/types/types/SubscriptionType";

interface PlanGridProps {
  currentPlan: string;
  plans: SubscriptionType[];
  onSubscribe: (planId: string) => void;
}

export default function PlanGrid({
  currentPlan,
  plans,
  onSubscribe,
}: PlanGridProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Available Plans</h2>
        <p className="mt-2 text-muted-foreground">
          Choose the perfect plan for your needs
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((subscription) => {
          const planCard = transformSubscriptionToPlanCard(
            subscription,
            currentPlan === subscription.id
          );
          return (
            <PlanCard
              key={subscription.id}
              plan={planCard}
              isCurrentPlan={currentPlan === subscription.id}
              onSubscribe={() => onSubscribe(subscription.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
