"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { SubscriptionType } from "@/types/types/SubscriptionType"

type PlanDetailsDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: SubscriptionType | null
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function PlanDetailsDrawer({ open, onOpenChange, plan }: PlanDetailsDrawerProps) {
  if (!plan) return null

  const createdDate = new Date(plan.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{plan.name}</SheetTitle>
          <SheetDescription>Plan details and configuration</SheetDescription>
        </SheetHeader>

        <div className="mt-6 grid gap-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Plan ID</div>
                  <div className="font-mono text-sm">{plan.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="text-lg font-semibold">{inr.format(plan.price)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Interval</div>
                  <div className="text-lg font-semibold capitalize">{plan.interval}</div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Free Plan</div>
                <Badge variant={plan.isFree ? "default" : "secondary"}>{plan.isFree ? "Yes" : "No"}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">{plan.description || "No description"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-sm">{createdDate}</div>
              </div>
            </CardContent>
          </Card>

          {/* Stripe Integration */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Stripe Integration</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Product ID</div>
                <div className="font-mono text-sm">{plan.stripeProductId || "Not configured"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Price ID</div>
                <div className="font-mono text-sm">{plan.stripePriceId || "Not configured"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-sm font-medium">Bookings per Month</div>
                  <div className="font-mono text-sm">{plan.benefits.bookingsPerMonth}</div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-sm font-medium">Followup Bookings per Case</div>
                  <div className="font-mono text-sm">{plan.benefits.followupBookingsPerCase}</div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-sm font-medium">Chat Access</div>
                  <Badge variant="outline">{plan.benefits.chatAccess ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-sm font-medium">Discount (%)</div>
                  <div className="font-mono text-sm">{plan.benefits.discountPercent}</div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-sm font-medium">Document Upload Limit</div>
                  <div className="font-mono text-sm">{plan.benefits.documentUploadLimit}</div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-sm font-medium">Expiry Alert</div>
                  <Badge variant="outline">{plan.benefits.expiryAlert ? "Yes" : "No"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Auto Renew</div>
                  <Badge variant="outline">{plan.benefits.autoRenew ? "Yes" : "No"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
