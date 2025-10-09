"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency, formatDate } from "./utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendLawyerDashboard } from "@/types/types/LawyerTypes";

export function RecentTransactions({
  data,
  loading,
}: {
  data?: FrontendLawyerDashboard;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const balance = data?.walletBalance ?? 0;
  const items = (data?.recentTransactions ?? []).slice(0, 5);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Wallet & Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div className="text-sm text-muted-foreground">Wallet Balance</div>
          <div className="text-lg font-semibold">{currency(balance)}</div>
        </div>

        <div className="text-sm font-medium">Recent Transactions</div>
        <div className="space-y-2 max-h-80 overflow-auto pr-1">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No items</div>
          ) : null}
          {items.map((t) => {
            const isCredit = t.type === "credit";
            return (
              <div
                key={t.id}
                className="rounded-md border border-border p-3 grid grid-cols-[1fr_auto] items-center gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="px-2 py-0 h-6 capitalize"
                    >
                      {t.category ?? t.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {t.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(t.createdAt, true)}
                  </div>
                  <div className="text-sm">{t.description ?? "—"}</div>
                </div>
                <div
                  className={`text-right font-semibold ${
                    isCredit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCredit ? "+" : "-"}
                  {currency(t.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
