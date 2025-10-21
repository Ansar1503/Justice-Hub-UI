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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SubscriptionType } from "@/types/types/SubscriptionType";

type PlanTableProps = {
  plans: SubscriptionType[] | [];
  onEdit: (plan: SubscriptionType) => void;
  onDeactivate: (id: string) => void;
  onViewDetails: (plan: SubscriptionType) => void;
  onActivate: (id: string) => void;
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function PlanTable({
  plans,
  onEdit,
  onDeactivate,
  onViewDetails,
  onActivate,
}: PlanTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Benefits</TableHead>
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
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Bookings:</span>
                      <span className="font-medium">
                        {plan.benefits.bookingsPerMonth}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Chat:</span>
                      <Badge
                        variant={
                          plan.benefits.chatAccess ? "default" : "secondary"
                        }
                        className="text-xs px-1 py-0"
                      >
                        {plan.benefits.chatAccess ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Docs:</span>
                      <span className="font-medium">
                        {plan.benefits.documentUploadLimit}
                      </span>
                    </div>
                  </div>
                </TableCell>

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
                      onClick={() => onViewDetails(plan)}
                    >
                      View Details
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant={plan.isActive ? "destructive" : "default"}
                        >
                          {plan.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-semibold">
                            {plan.isActive
                              ? "Deactivate Subscription Plan"
                              : "Activate Subscription Plan"}
                          </AlertDialogTitle>

                          <AlertDialogDescription className="text-sm text-muted-foreground">
                            {plan.isActive
                              ? `Are you sure you want to deactivate the "${plan.name}" plan? Users will no longer be able to subscribe to this plan.`
                              : `Are you sure you want to activate the "${plan.name}" plan? It will become available for users to subscribe.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className={
                              plan.isActive
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }
                            onClick={() =>
                              plan.isActive
                                ? onDeactivate(plan.id)
                                : onActivate(plan.id)
                            }
                          >
                            {plan.isActive ? "Deactivate" : "Activate"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {plans.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                No plans found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
