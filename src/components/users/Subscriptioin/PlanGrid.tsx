import { transformSubscriptionToPlanCard } from "@/utils/SubscriptionTransformer";
import PlanCard from "./PlanCard";
import type {
  SubscriptionType,
  UserSubscriptionType,
} from "@/types/types/SubscriptionType";

interface PlanGridProps {
  currentPlan: string;
  plans: SubscriptionType[];
  onSubscribe: (planId: string) => void;
  userSubscription: UserSubscriptionType | null;
}

export default function PlanGrid({
  currentPlan,
  plans,
  userSubscription,
  onSubscribe,
}: PlanGridProps) {
  const today = new Date();
  const currentPlanData = plans.find((p) => p.id === currentPlan);
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
          let isDowngradeBlocked = false;
          if (userSubscription && currentPlanData) {
            const isDowngrade =
              subscription.price < currentPlanData.price || subscription.isFree;
            if (isDowngrade && userSubscription.endDate) {
              const endDate = new Date(userSubscription.endDate);
              isDowngradeBlocked = today < endDate;
            }
          }
          return (
            <PlanCard
              key={subscription.id}
              plan={planCard}
              isCurrentPlan={currentPlan === subscription.id}
              onSubscribe={() => onSubscribe(subscription.id)}
              isDowngradeBlocked={isDowngradeBlocked}
            />
          );
        })}
      </div>
    </div>
  );
}
