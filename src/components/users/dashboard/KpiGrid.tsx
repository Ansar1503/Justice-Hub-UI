import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KPI = {
  label: string;
  value: string | number;
  emphasis?: "default" | "primary"; // primary for wallet, etc.
};

function KPIItem({ label, value, emphasis = "default" }: KPI) {
  return (
    <Card
      className={cn(
        "rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm",
        emphasis === "primary" && "bg-primary/5 border-primary/20"
      )}
      role="figure"
      aria-label={label}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-2 text-xl font-semibold leading-none",
          emphasis === "primary" && "text-primary"
        )}
      >
        {value}
      </div>
    </Card>
  );
}

type Props = {
  items?: KPI[];
};

export function KPIGrid({ items = [] }: Props) {
  return (
    <section aria-labelledby="kpi-heading" className="space-y-3">
      <h2 id="kpi-heading" className="sr-only">
        Summary KPIs
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {items.map((k, i) => (
          <KPIItem key={i} {...k} />
        ))}
      </div>
    </section>
  );
}
