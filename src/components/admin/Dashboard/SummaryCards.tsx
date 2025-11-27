import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Users,
  Percent,
  FolderOpenDot,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { CurrencyRupeeIcon } from "@heroicons/react/24/outline";

type Summary = {
  totalUsers?: number;
  totalLawyers?: number;
  totalClients?: number;
  totalRevenue?: number;
  totalCommission?: number;
  totalLawyerPayouts?: number;
  totalBookingAmountCollected?: number;
  commissionGrowthPercent?: number;
  subscriptionRevenue?: number;
  subscriptionGrowthPercent?: number;
  activeSubscriptions?: number;
  expiredSubscriptions?: number;
  newSubscriptions?: number;
  activeCases?: number;
};


export function SummaryCards({ summary }: { summary?: Summary }) {
  const items = [
    {
      label: "Total Revenue",
      value: summary?.totalRevenue,
      icon: CurrencyRupeeIcon,
      format: "currency" as const,
    },
    {
      label: "Commission Revenue",
      value: summary?.totalCommission,
      icon: Percent,
      format: "currency" as const,
    },
    {
      label: "Subscription Revenue",
      value: summary?.subscriptionRevenue,
      icon: CurrencyRupeeIcon,
      format: "currency" as const,
    },
    {
      label: "Total Booking Amount",
      value: summary?.totalBookingAmountCollected,
      icon: CurrencyRupeeIcon,
      format: "currency" as const,
    },
    {
      label: "Lawyer Payouts",
      value: summary?.totalLawyerPayouts,
      icon: CurrencyRupeeIcon,
      format: "currency" as const,
    },
    {
      label: "Active Subscriptions",
      value: summary?.activeSubscriptions,
      icon: Users,
      format: "number" as const,
    },
    {
      label: "New Subscriptions",
      value: summary?.newSubscriptions,
      icon: Users,
      format: "number" as const,
    },
    {
      label: "Expired Subscriptions",
      value: summary?.expiredSubscriptions,
      icon: Users,
      format: "number" as const,
    },
    {
      label: "Active Cases",
      value: summary?.activeCases,
      icon: FolderOpenDot,
      format: "number" as const,
    },
  ];


  const formatValue = (val?: number, type?: "currency" | "number") => {
    if (val == null) return "—";
    if (type === "currency")
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val);
    return new Intl.NumberFormat().format(val);
  };

  const growth = (summary?.subscriptionGrowthPercent ?? 0) + (summary?.commissionGrowthPercent ?? 0);
  const growthClasses = growth >= 0 ? "text-green-600" : "text-destructive";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((it, idx) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 * idx }}
        >
          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground text-pretty">
                {it.label}
              </CardTitle>
              <it.icon className="h-5 w-5 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatValue(it.value, it.format)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground text-pretty">
              Growth
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-semibold", growthClasses)}>
              {growth >= 0 ? "+" : ""}
              {new Intl.NumberFormat(undefined, {
                maximumFractionDigits: 1,
              }).format(growth)}
              %
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
