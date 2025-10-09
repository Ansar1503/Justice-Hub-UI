"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "./utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendLawyerDashboard } from "@/types/types/LawyerTypes";
import { useNavigate } from "react-router-dom";

export function NextAppointmentCard({
  data,
  loading,
}: {
  data?: FrontendLawyerDashboard;
  loading?: boolean;
}) {
  const navigate = useNavigate();
  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-28" />
        </CardContent>
      </Card>
    );
  }

  const a = data?.nextAppointment;
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Next Appointment</CardTitle>
        <CardDescription>
          Stay prepared for your upcoming session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-lg font-medium">{a?.clientName ?? "—"}</div>
        <div className="text-sm text-muted-foreground">
          {formatDate(a?.date, true)} · {a?.time ?? "—"}
        </div>
        <div className="text-sm">
          Type: <span className="font-medium">{a?.type ?? "—"}</span>
        </div>
        <Badge
          variant="secondary"
          aria-label={`Status ${a?.status ?? "unknown"}`}
        >
          {a?.status ?? "—"}
        </Badge>
      </CardContent>
      <CardFooter>
        <Button
          variant="default"
          size="sm"
          aria-label="View appointment details"
          onClick={() => {
            navigate(`/lawyer/appointments`);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
