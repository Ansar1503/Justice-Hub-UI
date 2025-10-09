"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { currency } from "./utils";
import {
//   ArrowDownRight,
//   ArrowUpRight,
  Briefcase,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Wallet,
} from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, BarChart, Bar } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendLawyerDashboard } from "@/types/types/LawyerTypes";

export function KPIGrid({
  data,
  loading,
}: {
  data?: FrontendLawyerDashboard;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const k = data;
  const earnings = k?.totalEarnings ?? 0;
  const caseGrowth = k?.caseGrowthPercent ?? 0;
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const earningsSeries = months.map((m, idx) => ({
    name: m,
    val: Math.round(earnings * (0.35 + idx * 0.08)),
  }));
  const caseSeries = months.map((m, idx) => ({
    name: m,
    val: Math.max(0, Math.round(10 + idx * (5 + caseGrowth / 10))),
  }));

  const items = [
    { label: "Total Cases", value: k?.totalCases ?? 0, icon: Briefcase },
    { label: "Active Cases", value: k?.activeCases ?? 0, icon: Clock3 },
    { label: "Closed Cases", value: k?.closedCases ?? 0, icon: CheckCircle2 },
    {
      label: "Appointments",
      value: k?.totalAppointments ?? 0,
      icon: CalendarCheck2,
    },
    {
      label: "Upcoming",
      value: k?.upcomingAppointments ?? 0,
      icon: CalendarClock,
    },
    { label: "Sessions", value: k?.totalSessions ?? 0, icon: Wallet },
    // { label: "Wallet", value: currency(k?.walletBalance), icon: Wallet },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map(({ label, value, icon: Icon }, i) => (
        <Card key={label} className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{label}</span>
              <Icon className="size-4" aria-hidden="true" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between gap-2">
            <div className="text-2xl font-semibold">
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            {i === 0 ? (
              <div className="w-24 h-12">
                <ChartContainer
                  config={{
                    val: { label: "Cases", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-12 w-24"
                >
                  <BarChart data={caseSeries}>
                    <Bar
                      dataKey="val"
                      fill="var(--color-val)"
                      radius={[4, 4, 0, 0]}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <XAxis dataKey="name" hide />
                  </BarChart>
                </ChartContainer>
              </div>
            ) : null}
            {i === 6 ? (
              <div className="w-24 h-12">
                <ChartContainer
                  config={{
                    val: { label: "Earnings", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-12 w-24"
                >
                  <LineChart data={earningsSeries}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <Line
                      type="monotone"
                      dataKey="val"
                      stroke="var(--color-val)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <XAxis dataKey="name" hide />
                  </LineChart>
                </ChartContainer>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}

      {/* Growth cards */}
      {/* <Card className="md:col-span-2 border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Earnings Growth
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(k?.earningsGrowthPercent ?? 0) >= 0 ? (
              <ArrowUpRight className="size-4 text-green-600" />
            ) : (
              <ArrowDownRight className="size-4 text-red-600" />
            )}
            <span className="text-2xl font-semibold">
              {(k?.earningsGrowthPercent ?? 0).toFixed(0)}%
            </span>
          </div>
          <div className="w-36 h-14">
            <ChartContainer
              config={{
                val: { label: "Earnings", color: "hsl(var(--chart-1))" },
              }}
              className="h-14 w-36"
            >
              <LineChart data={earningsSeries}>
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="var(--color-val)"
                  strokeWidth={2}
                  dot={false}
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <XAxis dataKey="name" hide />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card> */}

      {/* <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Case Growth
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(k?.caseGrowthPercent ?? 0) >= 0 ? (
              <ArrowUpRight className="size-4 text-green-600" />
            ) : (
              <ArrowDownRight className="size-4 text-red-600" />
            )}
            <span className="text-2xl font-semibold">
              {(k?.caseGrowthPercent ?? 0).toFixed(0)}%
            </span>
          </div>
          <div className="w-24 h-12">
            <ChartContainer
              config={{
                val: { label: "Cases", color: "hsl(var(--chart-2))" },
              }}
              className="h-12 w-24"
            >
              <BarChart data={caseSeries}>
                <Bar
                  dataKey="val"
                  fill="var(--color-val)"
                  radius={[4, 4, 0, 0]}
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <XAxis dataKey="name" hide />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
