"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Props = {
  status?: string
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  const normalized = (status || "").toLowerCase()

  const variantClass =
    normalized === "completed"
      ? "bg-primary text-primary-foreground"
      : normalized === "failed"
        ? "bg-destructive text-destructive-foreground"
        : "bg-secondary text-secondary-foreground"

  const label =
    normalized === "in_review"
      ? "In Review"
      : normalized
        ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
        : "Unknown"

  return <Badge className={cn(variantClass, "rounded-md", className)}>{label}</Badge>
}
