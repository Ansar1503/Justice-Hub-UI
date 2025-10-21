"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { SubscriptionType } from "@/types/types/SubscriptionType";

interface SubscriptionHeaderProps {
  currentPlan: SubscriptionType | null;
  renewalDate: string;
  onCancel: () => void;
}

export default function SubscriptionHeader({
  currentPlan,
  renewalDate,
  onCancel,
}: SubscriptionHeaderProps) {
  const planPrice = currentPlan
    ? currentPlan.isFree
      ? "₹0"
      : `₹${currentPlan.price}`
    : "₹0";

  const calculateExpirationStatus = () => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const daysLeft = Math.ceil(
      (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) {
      return {
        status: "expired",
        daysLeft: Math.abs(daysLeft),
        message: "Your subscription has expired",
      };
    } else if (daysLeft <= 7) {
      return {
        status: "expiring-soon",
        daysLeft,
        message: `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
      };
    } else {
      return {
        status: "active",
        daysLeft,
        message: `${daysLeft} days remaining`,
      };
    }
  };

  const expirationStatus = calculateExpirationStatus();

  const getStatusBadge = () => {
    switch (expirationStatus.status) {
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400">Expired</Badge>;
      case "expiring-soon":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400">
            Expiring Soon
          </Badge>
        );
      default:
        return <Badge className="bg-teal-500/20 text-teal-400">Active</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (expirationStatus.status) {
      case "expired":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "expiring-soon":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-teal-500" />;
    }
  };

  return (
    <Card className="mb-12 border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl">Your Subscription</CardTitle>
            <CardDescription className="mt-2">
              Manage your current plan and billing
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Current Plan
            </p>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <p className="text-lg font-semibold">
                {currentPlan?.name || "No Plan"}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {currentPlan?.interval === "yearly" ? "Annual" : "Monthly"} Price
            </p>
            <p className="text-lg font-semibold">{planPrice}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Renewal Date
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-lg font-semibold">
                {new Date(renewalDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-6 rounded-lg border p-4 ${
            expirationStatus.status === "expired"
              ? "border-red-500/30 bg-red-500/10"
              : expirationStatus.status === "expiring-soon"
              ? "border-yellow-500/30 bg-yellow-500/10"
              : "border-teal-500/30 bg-teal-500/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p
                  className={`font-semibold ${
                    expirationStatus.status === "expired"
                      ? "text-red-400"
                      : expirationStatus.status === "expiring-soon"
                      ? "text-yellow-400"
                      : "text-teal-400"
                  }`}
                >
                  {expirationStatus.message}
                </p>
              </div>
            </div>
            {expirationStatus.status === "expired" && (
              <Button
                size="sm"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Renew Now
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {getStatusBadge()}
          <Button
            variant="outline"
            onClick={onCancel}
            className="ml-auto bg-transparent"
          >
            Cancel Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
