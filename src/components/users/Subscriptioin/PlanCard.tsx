import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    badge: string | null;
    features: string[];
    buttonText: string;
    highlighted?: boolean;
  };
  isCurrentPlan: boolean;
  onSubscribe: () => void;
}

export default function PlanCard({
  plan,
  isCurrentPlan,
  onSubscribe,
}: PlanCardProps) {
  return (
    <Card
      className={`relative flex flex-col transition-all duration-300 ${
        isCurrentPlan
          ? "border-teal-500/50 bg-card ring-2 ring-teal-500/20"
          : plan.highlighted
          ? "border-teal-500/30 bg-card ring-1 ring-teal-500/10"
          : "border-border bg-card"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-teal-500 text-white">Recommended</Badge>
        </div>
      )}

      <CardHeader className={plan.highlighted ? "pt-8" : ""}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription className="mt-1">
              {plan.description}
            </CardDescription>
          </div>
          {plan.badge && (
            <Badge
              variant="secondary"
              className={
                plan.badge === "Popular"
                  ? "bg-teal-500/20 text-teal-400"
                  : "bg-muted text-muted-foreground"
              }
            >
              {plan.badge}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{plan.price}</span>
            <span className="text-muted-foreground">{plan.period}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <ul className="space-y-3 flex-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 flex-shrink-0 text-teal-500 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-2">
          {isCurrentPlan ? (
            <Button disabled className="w-full">
              Current Plan
            </Button>
          ) : (
            <Button
              onClick={onSubscribe}
              className={
                plan.highlighted
                  ? "w-full bg-teal-500 hover:bg-teal-600 text-white"
                  : "w-full"
              }
            >
              {plan.buttonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
