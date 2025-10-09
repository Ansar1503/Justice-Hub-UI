"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "./utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendLawyerDashboard } from "@/types/types/LawyerTypes";

export function RecentCases({
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
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }
  const items = (data?.recentCases ?? []).slice(0, 5);
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Recent Cases</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No items</div>
        ) : null}
        {items.map((c) => (
          <div
            key={c.id}
            className="rounded-md border border-border p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-muted-foreground">
                {c.summary ?? "—"}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDate(c.createdAt)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
