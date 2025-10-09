"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendLawyerDashboard } from "@/types/types/LawyerTypes";

export function RecentReviews({
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
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }
  const items = (data?.recentReviews ?? []).slice(0, 5);
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No items</div>
        ) : null}
        {items.map((r) => (
          <div
            key={r.id}
            className="rounded-md border border-border p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{r.heading ?? "—"}</div>
              <div className="text-sm text-muted-foreground">
                {r.review ?? ""}
              </div>
            </div>
            <div className="text-sm" aria-label={`Rating ${r.rating} out of 5`}>
              {r.rating}/5
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
