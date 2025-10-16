"use client";

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
import type {
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

// Default benefit sets
const basicBenefits: PlanBenefits = {
  bookingsPerMonth: 2,
  followupBookingsPerCase: 1,
  chatAccess: false,
  discountPercent: 0,
  documentUploadLimit: 3,
  expiryAlert: false,
  autoRenew: false,
};

const monthlyBenefits: PlanBenefits = {
  bookingsPerMonth: 10,
  followupBookingsPerCase: 3,
  chatAccess: true,
  discountPercent: 10,
  documentUploadLimit: 20,
  expiryAlert: true,
  autoRenew: true,
};

const yearlyBenefits: PlanBenefits = {
  bookingsPerMonth: "unlimited",
  followupBookingsPerCase: "unlimited",
  chatAccess: true,
  discountPercent: 25,
  documentUploadLimit: 100,
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
    initialPlan?.benefits ?? monthlyBenefits
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setBenefits(initialPlan?.benefits ?? monthlyBenefits);
      setErrors({});
    }
  }, [open, initialPlan?.id]);

  // Handle Free Plan
  const handleFreeToggle = (checked: boolean) => {
    setIsFree(checked);
    if (checked) {
      setPrice(0);
      setInterval("none");
      setName("Basic");
      setDescription("Free basic plan for limited access.");
      setBenefits(basicBenefits);
    } else {
      setInterval("monthly");
      setPrice(499);
      setName("Monthly Plan");
      setDescription("Access premium features with a monthly plan.");
      setBenefits(monthlyBenefits);
    }
  };

  // Handle Interval Change
  const handleIntervalChange = (v: SubscriptionIntervalType) => {
    setInterval(v);
    if (v === "monthly") {
      setPrice(499);
      setBenefits(monthlyBenefits);
      setName("Monthly Plan");
    } else if (v === "yearly") {
      setPrice(4999);
      setBenefits(yearlyBenefits);
      setName("Yearly Plan");
    } else if (v === "none" && isFree) {
      setPrice(0);
      setBenefits(basicBenefits);
      setName("Basic");
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Plan name is required.";
    if (!description.trim())
      newErrors.description = "Please add a description.";
    if (!isFree && (isNaN(price) || price <= 0))
      newErrors.price = "Price must be greater than 0.";
    if (!interval) newErrors.interval = "Select a billing interval.";
    if (benefits.discountPercent < 0 || benefits.discountPercent > 100)
      newErrors.discountPercent = "Discount must be between 0 and 100.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    const plan: SubscriptionType = {
      id: initialPlan?.id ?? newId("plan"),
      name: name.trim(),
      description: description.trim(),
      price: isFree ? 0 : Number(price),
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
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Plan" : "Add New Plan"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? "Update the plan details and benefits."
              : "Create a new subscription plan with pricing and benefits."}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6">
          <form onSubmit={handleSubmit} className="grid gap-6 pb-6">
            {/* === GENERAL === */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Plan Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={cn(
                      "min-h-24",
                      errors.description && "border-red-500"
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">{errors.description}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      disabled={isFree}
                      className={cn(
                        errors.price && "border-red-500",
                        isFree && "opacity-60"
                      )}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs">{errors.price}</p>
                    )}
                    {isFree && (
                      <p className="text-xs text-gray-500 italic">
                        Free Plan (₹0)
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Billing Interval</Label>
                    <Select
                      value={interval}
                      onValueChange={(v) =>
                        handleIntervalChange(v as SubscriptionIntervalType)
                      }
                      disabled={isFree}
                    >
                      <SelectTrigger
                        className={cn(errors.interval && "border-red-500")}
                      >
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.interval && (
                      <p className="text-red-500 text-xs">{errors.interval}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Free Plan</Label>
                    <Switch
                      checked={isFree}
                      onCheckedChange={handleFreeToggle}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* === BENEFITS === */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Plan Benefits</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Editable Benefits */}
                <div className="grid gap-4">
                  {[
                    { key: "bookingsPerMonth", label: "Bookings per Month" },
                    {
                      key: "followupBookingsPerCase",
                      label: "Followup Bookings per Case",
                    },
                    {
                      key: "documentUploadLimit",
                      label: "Document Upload Limit",
                    },
                  ].map((field) => {
                    const value = benefits[field.key as keyof PlanBenefits];
                    const numericValue =
                      value === "unlimited" || typeof value === "boolean"
                        ? ""
                        : (value as number | string);

                    return (
                      <div key={field.key} className="grid gap-2">
                        <Label>{field.label}</Label>
                        <Input
                          type="number"
                          min={0}
                          value={numericValue}
                          onChange={(e) =>
                            setBenefits({
                              ...benefits,
                              [field.key]:
                                e.target.value === ""
                                  ? "unlimited"
                                  : Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    );
                  })}

                  {/* Switch-based benefits */}
                  {[
                    { key: "chatAccess", label: "Chat Access" },
                    { key: "expiryAlert", label: "Expiry Alert" },
                    { key: "autoRenew", label: "Auto Renew" },
                  ].map((field) => (
                    <div key={field.key} className="grid gap-2">
                      <Label className="flex items-center gap-2">
                        {field.label}
                        <Badge
                          variant={
                            benefits[field.key as keyof PlanBenefits]
                              ? "default"
                              : "secondary"
                          }
                        >
                          {benefits[field.key as keyof PlanBenefits]
                            ? "Yes"
                            : "No"}
                        </Badge>
                      </Label>
                      <Switch
                        checked={!!benefits[field.key as keyof PlanBenefits]}
                        onCheckedChange={(checked) =>
                          setBenefits({ ...benefits, [field.key]: checked })
                        }
                      />
                    </div>
                  ))}

                  <div className="grid gap-2">
                    <Label>Discount (%)</Label>
                    <Input
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
                      className={errors.discountPercent ? "border-red-500" : ""}
                    />
                    {errors.discountPercent && (
                      <p className="text-red-500 text-xs">
                        {errors.discountPercent}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* ✅ Summary */}
                <div className="grid gap-3">
                  <div className="text-sm font-semibold">Summary</div>
                  <div className="space-y-2 rounded-lg bg-muted/30 p-3 text-sm">
                    <div className="flex justify-between">
                      <span>Bookings / month</span>
                      <span>{benefits.bookingsPerMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Followups / case</span>
                      <span>{benefits.followupBookingsPerCase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chat access</span>
                      <span>{benefits.chatAccess ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>{benefits.discountPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Document limit</span>
                      <span>{benefits.documentUploadLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expiry alert</span>
                      <span>{benefits.expiryAlert ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto renew</span>
                      <span>{benefits.autoRenew ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4 px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
