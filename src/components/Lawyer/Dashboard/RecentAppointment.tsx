"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency, formatDate } from "./utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendLawyerDashboard } from "@/types/types/LawyerTypes";

export function RecentAppointments({
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
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }
  const items = (data?.recentAppointments ?? []).slice(0, 5);
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No items</div>
        ) : null}
        {items.map((a) => (
          <div
            key={a.id}
            className="rounded-md border border-border p-3 grid grid-cols-3 gap-2 items-center"
          >
            <div>
              <div className="font-medium">{a.type}</div>
              <div className="text-xs text-muted-foreground">
                {formatDate(a.date, true)}
              </div>
            </div>
            <div className="text-sm">{a.status}</div>
            <div className="text-right font-medium">{currency(a.amount)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
