import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import type { SubscriptionType } from "@/types/types/SubscriptionType";

interface PlanComparisonProps {
  plans: SubscriptionType[];
}

export function PlanComparison({ plans }: PlanComparisonProps) {
  const allFeatures = [
    { key: "bookingsPerMonth", label: "Bookings per Month" },
    { key: "followupBookingsPerCase", label: "Followup Bookings per Case" },
    { key: "chatAccess", label: "Chat Access", type: "boolean" },
    { key: "documentUploadLimit", label: "Document Upload Limit" },
    { key: "discountPercent", label: "Discount Percentage" },
    { key: "expiryAlert", label: "Expiry Alert", type: "boolean" },
    { key: "autoRenew", label: "Auto Renew", type: "boolean" },
  ];

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card p-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-1/3 text-foreground font-semibold">
                Feature
              </TableHead>
              {plans.map((plan) => (
                <TableHead
                  key={plan.id}
                  className="text-center text-foreground font-semibold"
                >
                  <div className="font-bold">{plan.name}</div>
                  {plan.isFree ? (
                    <Badge variant="secondary" className="mt-2">
                      Free
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-2">
                      ₹{plan.price}/{plan.interval}
                    </Badge>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allFeatures.map((feature) => (
              <TableRow key={feature.key} className="border-border">
                <TableCell className="font-medium text-foreground">
                  {feature.label}
                </TableCell>
                {plans.map((plan) => {
                  const value =
                    plan.benefits[feature.key as keyof typeof plan.benefits];
                  const isBoolean = feature.type === "boolean";

                  return (
                    <TableCell key={plan.id} className="text-center">
                      {isBoolean ? (
                        value ? (
                          <Check className="w-5 h-5 text-accent mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-foreground font-medium">
                          {value === "unlimited" ? "∞" : value}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
