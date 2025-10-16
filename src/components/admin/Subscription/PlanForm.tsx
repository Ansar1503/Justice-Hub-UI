import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  PlanBenefits,
  SubscriptionIntervalType,
  SubscriptionType,
} from "@/types/types/SubscriptionType";

type PlanFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan?: SubscriptionType | null;
  onSubmit: (plan: SubscriptionType) => void;
};

function newId(prefix = "id") {
  return `${prefix}_${Math.random()
    .toString(36)
    .slice(2, 8)}_${Date.now().toString(36)}`;
}

const defaultBenefits: PlanBenefits = {
  bookingsPerMonth: 5,
  followupBookingsPerCase: 2,
  chatAccess: true,
  discountPercent: 10,
  documentUploadLimit: 20,
  expiryAlert: true,
  autoRenew: true,
};

export function PlanForm({
  open,
  onOpenChange,
  initialPlan,
  onSubmit,
}: PlanFormProps) {
  const isEdit = !!initialPlan;
  const [name, setName] = useState(initialPlan?.name ?? "");
  const [description, setDescription] = useState(
    initialPlan?.description ?? ""
  );
  const [price, setPrice] = useState<number>(initialPlan?.price ?? 0);
  const [interval, setInterval] = useState<SubscriptionIntervalType>(
    initialPlan?.interval ?? "monthly"
  );
  const [isFree, setIsFree] = useState<boolean>(initialPlan?.isFree ?? false);
  const [stripeProductId, setStripeProductId] = useState(
    initialPlan?.stripeProductId ?? ""
  );
  const [stripePriceId, setStripePriceId] = useState(
    initialPlan?.stripePriceId ?? ""
  );
  const [isActive, setIsActive] = useState<boolean>(
    initialPlan?.isActive ?? true
  );
  const [benefits, setBenefits] = useState<PlanBenefits>(
    initialPlan?.benefits ?? defaultBenefits
  );

  useEffect(() => {
    if (open) {
      setName(initialPlan?.name ?? "");
      setDescription(initialPlan?.description ?? "");
      setPrice(initialPlan?.price ?? 0);
      setInterval(initialPlan?.interval ?? "monthly");
      setIsFree(initialPlan?.isFree ?? false);
      setStripeProductId(initialPlan?.stripeProductId ?? "");
      setStripePriceId(initialPlan?.stripePriceId ?? "");
      setIsActive(initialPlan?.isActive ?? true);
      setBenefits(initialPlan?.benefits ?? defaultBenefits);
    }
  }, [open, initialPlan?.id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const plan: SubscriptionType = {
      id: initialPlan?.id ?? newId("plan"),
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price) || 0,
      interval,
      isFree,
      stripeProductId: stripeProductId.trim() || undefined,
      stripePriceId: stripePriceId.trim() || undefined,
      isActive,
      benefits,
      createdAt: initialPlan?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    onSubmit(plan);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEdit ? "Edit Plan" : "Add New Plan"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? "Update the plan details and benefits."
              : "Create a new subscription plan with pricing and benefits."}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6">
          <form onSubmit={handleSubmit} className="grid gap-6 pb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">General</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    placeholder="e.g., Basic, Pro, Enterprise"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="plan-description">Description</Label>
                  <Textarea
                    id="plan-description"
                    placeholder="Short description of the plan..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      value={Number(price)}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Billing Interval</Label>
                    <Select
                      value={interval}
                      onValueChange={(v) =>
                        setInterval(v as SubscriptionIntervalType)
                      }
                    >
                      <SelectTrigger aria-label="Billing Interval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      Free Plan
                      <Badge
                        variant="outline"
                        className={cn(
                          "ml-2",
                          isFree ? "text-blue-700" : "text-muted-foreground"
                        )}
                      >
                        {isFree ? "Free" : "Paid"}
                      </Badge>
                    </Label>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={isFree}
                        onCheckedChange={setIsFree}
                        aria-label="Free Plan"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      Active
                      <Badge
                        variant="outline"
                        className={cn(
                          "ml-2",
                          isActive ? "text-green-700" : "text-muted-foreground"
                        )}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Label>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={isActive}
                        onCheckedChange={setIsActive}
                        aria-label="Plan Active"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="stripe-product-id">
                      Stripe Product ID (optional)
                    </Label>
                    <Input
                      id="stripe-product-id"
                      placeholder="prod_..."
                      value={stripeProductId}
                      onChange={(e) => setStripeProductId(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stripe-price-id">
                      Stripe Price ID (optional)
                    </Label>
                    <Input
                      id="stripe-price-id"
                      placeholder="price_..."
                      value={stripePriceId}
                      onChange={(e) => setStripePriceId(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Plan Benefits</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bookings-per-month">
                      Bookings per Month
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="bookings-per-month"
                        type="number"
                        min={0}
                        value={
                          benefits.bookingsPerMonth === "unlimited"
                            ? ""
                            : benefits.bookingsPerMonth
                        }
                        onChange={(e) =>
                          setBenefits({
                            ...benefits,
                            bookingsPerMonth:
                              e.target.value === ""
                                ? "unlimited"
                                : Number(e.target.value),
                          })
                        }
                        placeholder="Enter number or leave empty for unlimited"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setBenefits({
                            ...benefits,
                            bookingsPerMonth: "unlimited",
                          })
                        }
                        className="whitespace-nowrap"
                      >
                        Unlimited
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="followup-bookings">
                      Followup Bookings per Case
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="followup-bookings"
                        type="number"
                        min={0}
                        value={
                          benefits.followupBookingsPerCase === "unlimited"
                            ? ""
                            : benefits.followupBookingsPerCase
                        }
                        onChange={(e) =>
                          setBenefits({
                            ...benefits,
                            followupBookingsPerCase:
                              e.target.value === ""
                                ? "unlimited"
                                : Number(e.target.value),
                          })
                        }
                        placeholder="Enter number or leave empty for unlimited"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setBenefits({
                            ...benefits,
                            followupBookingsPerCase: "unlimited",
                          })
                        }
                        className="whitespace-nowrap"
                      >
                        Unlimited
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      Chat Access
                      <Badge
                        variant={benefits.chatAccess ? "default" : "secondary"}
                      >
                        {benefits.chatAccess ? "Yes" : "No"}
                      </Badge>
                    </Label>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={benefits.chatAccess}
                        onCheckedChange={(checked) =>
                          setBenefits({ ...benefits, chatAccess: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="discount-percent">Discount (%)</Label>
                    <Input
                      id="discount-percent"
                      type="number"
                      min={0}
                      max={100}
                      value={benefits.discountPercent}
                      onChange={(e) =>
                        setBenefits({
                          ...benefits,
                          discountPercent: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="document-upload">
                      Document Upload Limit
                    </Label>
                    <Input
                      id="document-upload"
                      type="number"
                      min={0}
                      value={benefits.documentUploadLimit}
                      onChange={(e) =>
                        setBenefits({
                          ...benefits,
                          documentUploadLimit: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      Expiry Alert
                      <Badge
                        variant={benefits.expiryAlert ? "default" : "secondary"}
                      >
                        {benefits.expiryAlert ? "Yes" : "No"}
                      </Badge>
                    </Label>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={benefits.expiryAlert}
                        onCheckedChange={(checked) =>
                          setBenefits({ ...benefits, expiryAlert: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      Auto Renew
                      <Badge
                        variant={benefits.autoRenew ? "default" : "secondary"}
                      >
                        {benefits.autoRenew ? "Yes" : "No"}
                      </Badge>
                    </Label>
                    <div className="flex h-10 items-center">
                      <Switch
                        checked={benefits.autoRenew}
                        onCheckedChange={(checked) =>
                          setBenefits({ ...benefits, autoRenew: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3">
                  <div className="text-sm font-semibold">Preview</div>
                  <div className="space-y-2 rounded-lg bg-muted/30 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">
                        Bookings per month
                      </span>
                      <span className="font-medium text-foreground">
                        {benefits.bookingsPerMonth}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">
                        Followup bookings per case
                      </span>
                      <span className="font-medium text-foreground">
                        {benefits.followupBookingsPerCase}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">Chat access</span>
                      <span className="font-medium text-foreground">
                        {benefits.chatAccess ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">Discount (%)</span>
                      <span className="font-medium text-foreground">
                        {benefits.discountPercent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">
                        Document upload limit
                      </span>
                      <span className="font-medium text-foreground">
                        {benefits.documentUploadLimit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">Expiry alert</span>
                      <span className="font-medium text-foreground">
                        {benefits.expiryAlert ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/80">Auto renew</span>
                      <span className="font-medium text-foreground">
                        {benefits.autoRenew ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-4 px-6 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
