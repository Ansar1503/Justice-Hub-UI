import { cn } from "@/lib/utils";

interface CaseStatusBadgeProps {
  status: "open" | "onhold" | "closed";
  className?: string;
}

export function CaseStatusBadge({ status, className }: CaseStatusBadgeProps) {
  const variants = {
    open: "bg-accent/10 text-accent-foreground border-accent/20",
    onhold: "bg-yellow-100 text-yellow-800 border-yellow-200",
    closed: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[status],
        className
      )}
    >
      {status}
    </span>
  );
}
