import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { SubscriptionType } from "@/types/types/SubscriptionType";
import { PlanDetailsDrawer } from "./PlanDetailsDrawer";

type PlanTableProps = {
  plans: SubscriptionType[] | [];
  onEdit: (plan: SubscriptionType) => void;
  onDeactivate: (id: string) => void;
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function PlanTable({ plans, onEdit, onDeactivate }: PlanTableProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | null>(
    null
  );

  function handleViewDetails(plan: SubscriptionType) {
    setSelectedPlan(plan);
    setDetailsOpen(true);
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Free</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const createdDate = new Date(plan.createdAt).toLocaleDateString(
                "en-IN",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );
              return (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{inr.format(plan.price)}</TableCell>
                  <TableCell className="capitalize">{plan.interval}</TableCell>
                  <TableCell>
                    <Badge variant={plan.isFree ? "default" : "secondary"}>
                      {plan.isFree ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {createdDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(plan)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(plan)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeactivate(plan.id)}
                        disabled={!plan.isActive}
                        aria-disabled={!plan.isActive}
                      >
                        {plan.isActive ? "Deactivate" : "Inactive"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {plans.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No plans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PlanDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        plan={selectedPlan}
      />
    </>
  );
}
