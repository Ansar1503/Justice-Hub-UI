"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "./utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendLawyerDashboard } from "@/types/types/LawyerTypes";

export function UpcomingSessions({
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
          <Skeleton className="h-4 w-44" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }
  const items = (data?.recentSessions ?? []).slice(0, 5);
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Sessions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No items</div>
        ) : null}
        {items.map((s) => (
          <div
            key={s.id}
            className="rounded-md border border-border p-3 flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <div className="font-medium capitalize">{s.status}</div>
              <div className="text-xs text-muted-foreground">
                {formatDate(s.start_time || s.createdAt, true)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {s.end_reason ?? ""}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
