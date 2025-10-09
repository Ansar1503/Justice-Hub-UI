import { cn } from "@/lib/utils";

type Props = {
  status?: string;
  className?: string;
};

function tone(status: string) {
  const s = status.toLowerCase();
  if (["completed", "closed", "resolved"].some((k) => s.includes(k))) {
    return { base: "primary", dot: "bg-primary" };
  }
  if (["cancel", "declined", "failed"].some((k) => s.includes(k))) {
    return { base: "destructive", dot: "bg-destructive" };
  }
  if (
    ["pending", "await", "in-progress", "in progress"].some((k) =>
      s.includes(k)
    )
  ) {
    return { base: "muted", dot: "bg-muted-foreground" };
  }
  // default → scheduled/open/active/upcoming/etc.
  return { base: "accent", dot: "bg-accent-foreground" };
}

export function StatusBadge({ status, className }: Props) {
  const statusSafe = status || "Unknown";
  const t = tone(statusSafe);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-medium",
        t.base === "primary" && "bg-primary/10 text-primary border-primary/20",
        t.base === "destructive" &&
          "bg-destructive/10 text-destructive border-destructive/20",
        t.base === "muted" && "bg-muted text-muted-foreground border-border",
        t.base === "accent" && "bg-accent text-accent-foreground border-border",
        className
      )}
      aria-label={`Status: ${statusSafe}`}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", t.dot)}
        aria-hidden="true"
      />
      {statusSafe}
    </span>
  );
}
