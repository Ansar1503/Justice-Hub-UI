import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { PlanBenefits, SubscriptionIntervalType, SubscriptionType } from "@/types/types/SubscriptionType"

type PlanFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPlan?: SubscriptionType | null
  onAdd: (plan: Omit<SubscriptionType, "id" | "createdAt" | "updatedAt">) => void
  onEdit: (plan: Omit<SubscriptionType, "createdAt" | "updatedAt">) => void
}

const basicBenefits: PlanBenefits = {
  bookingsPerMonth: 3,
  followupBookingsPerCase: 3,
  chatAccess: false,
  discountPercent: 0,
  documentUploadLimit: 10,
  expiryAlert: false,
  autoRenew: false,
}

const monthlyBenefits: PlanBenefits = {
  bookingsPerMonth: "unlimited",
  followupBookingsPerCase: "unlimited",
  chatAccess: true,
  discountPercent: 10,
  documentUploadLimit: 30,
  expiryAlert: true,
  autoRenew: true,
}

const yearlyBenefits: PlanBenefits = {
  bookingsPerMonth: "unlimited",
  followupBookingsPerCase: "unlimited",
  chatAccess: true,
  discountPercent: 10,
  documentUploadLimit: 30,
  expiryAlert: true,
  autoRenew: true,
}

export function PlanForm({ open, onOpenChange, initialPlan, onAdd, onEdit }: PlanFormProps) {
  const isEdit = !!initialPlan
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [interval, setInterval] = useState<SubscriptionIntervalType>("monthly")
  const [isFree, setIsFree] = useState<boolean>(false)
  const [stripeProductId, setStripeProductId] = useState("")
  const [stripePriceId, setStripePriceId] = useState("")
  const [isActive, setIsActive] = useState<boolean>(true)
  const [benefits, setBenefits] = useState<PlanBenefits>(monthlyBenefits)
  const [errors, setErrors] = useState<Record<string, string>>({})


  useEffect(() => {
    if (!open) return

    if (initialPlan) {
      setName(initialPlan.name ?? "")
      setDescription(initialPlan.description ?? "")
      setPrice(initialPlan.price ?? 0)
      setInterval(initialPlan.interval ?? "monthly")
      setIsFree(initialPlan.isFree ?? false)
      setStripeProductId(initialPlan.stripeProductId ?? "")
      setStripePriceId(initialPlan.stripePriceId ?? "")
      setIsActive(initialPlan.isActive ?? true)
      setBenefits(
        initialPlan.benefits && Object.keys(initialPlan.benefits).length > 0 ? initialPlan.benefits : monthlyBenefits,
      )
    } else {
      setName("")
      setDescription("")
      setPrice(0)
      setInterval("monthly")
      setIsFree(false)
      setStripeProductId("")
      setStripePriceId("")
      setIsActive(true)
      setBenefits(monthlyBenefits)
    }
  }, [open, initialPlan])

  const handleFreeToggle = (checked: boolean) => {
    setIsFree(checked)
    if (checked) {
      setPrice(0)
      setInterval("none")
      setName("Basic")
      setDescription("Free basic plan for limited access.")
      setBenefits(basicBenefits)
    } else {
      setInterval("monthly")
      setPrice(499)
      setName("Monthly Plan")
      setDescription("Access premium features with a monthly plan.")
      setBenefits(monthlyBenefits)
    }
  }

  const handleIntervalChange = (v: SubscriptionIntervalType) => {
    setInterval(v)
    if (v === "monthly") {
      setPrice(499)
      setBenefits(monthlyBenefits)
      setName("Monthly Plan")
    } else if (v === "yearly") {
      setPrice(4999)
      setBenefits(yearlyBenefits)
      setName("Yearly Plan")
    } else if (v === "none" && isFree) {
      setPrice(0)
      setBenefits(basicBenefits)
      setName("Basic")
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Plan name is required."
    if (!description.trim()) newErrors.description = "Please add a description."
    if (!isFree && (isNaN(price) || price <= 0)) newErrors.price = "Price must be greater than 0."
    if (!interval) newErrors.interval = "Select a billing interval."
    if (benefits.discountPercent < 0 || benefits.discountPercent > 100)
      newErrors.discountPercent = "Discount must be between 0 and 100."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onAdd({
      name: name.trim(),
      description: description.trim(),
      price: isFree ? 0 : Number(price),
      interval,
      isFree,
      stripeProductId: stripeProductId.trim() || undefined,
      stripePriceId: stripePriceId.trim() || undefined,
      isActive,
      benefits,
    })
    onOpenChange(false)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !initialPlan?.id) return
    onEdit({
      id: initialPlan.id,
      name: name.trim(),
      description: description.trim(),
      price: isFree ? 0 : Number(price),
      interval,
      isFree,
      stripeProductId: stripeProductId.trim() || undefined,
      stripePriceId: stripePriceId.trim() || undefined,
      isActive,
      benefits,
    })
    onOpenChange(false)
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

        <div className="overflow-y-auto flex-1">
          <form onSubmit={isEdit ? handleEditSubmit : handleAddSubmit} className="grid gap-6 px-6 pb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Plan Name */}
                <div className="grid gap-2">
                  <Label>Plan Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                {/* Description */}
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={cn("min-h-24", errors.description && "border-red-500")}
                  />
                  {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                </div>

                {/* Price, Interval, Free Plan */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      disabled={isFree}
                    />
                    {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label>Billing Interval</Label>
                    <Select
                      value={interval}
                      onValueChange={(v) => handleIntervalChange(v as SubscriptionIntervalType)}
                      disabled={isFree}
                    >
                      <SelectTrigger>
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
                    <Label>Free Plan</Label>
                    <Switch checked={isFree} onCheckedChange={handleFreeToggle} />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    const value = benefits[field.key as keyof PlanBenefits]

                    return (
                      <div key={field.key} className="grid gap-2">
                        <Label>{field.label}</Label>
                        <Input
                          value={value === "unlimited" ? "unlimited" : (value?.toString() ?? "")}
                          onChange={(e) => {
                            const val = e.target.value.trim()
                            setBenefits({
                              ...benefits,
                              [field.key]: val.toLowerCase() === "unlimited" ? "unlimited" : Number(val),
                            })
                          }}
                        />
                        <p className="text-xs text-muted-foreground">Enter a number or type "unlimited"</p>
                      </div>
                    )
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
                        <Badge variant={benefits[field.key as keyof PlanBenefits] ? "default" : "secondary"}>
                          {benefits[field.key as keyof PlanBenefits] ? "Yes" : "No"}
                        </Badge>
                      </Label>
                      <Switch
                        checked={!!benefits[field.key as keyof PlanBenefits]}
                        onCheckedChange={(checked) => setBenefits({ ...benefits, [field.key]: checked })}
                      />
                    </div>
                  ))}

                  {/* Discount */}
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
                    />
                  </div>
                </div>

                <Separator />

                {/* Summary */}
                <div className="grid gap-3">
                  <div className="text-sm font-semibold">Summary</div>
                  <div className="space-y-2 rounded-lg bg-muted/30 p-3 text-sm">
                    {Object.entries(benefits).map(([key, val]) => (
                      <div key={key} className="flex justify-between capitalize">
                        <span>{key.replace(/([A-Z])/g, " $1")}</span>
                        <span>{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* === Footer === */}
        <div className="flex justify-end gap-2 border-t pt-4 px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={isEdit ? handleEditSubmit : handleAddSubmit}>
            {isEdit ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
