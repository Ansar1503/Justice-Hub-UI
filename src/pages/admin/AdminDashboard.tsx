"use client";
import { useState, useMemo } from "react";
import RangeSelector from "@/components/admin/Dashboard/RangeSelector";
import dayjs from "dayjs";
import { useAdminDashboard } from "@/store/tanstack/queries";
import { AdminLayout } from "./layout/admin.layout";
import { Skeleton } from "@/components/ui/skeleton";
import { FrontendAdminDashboard } from "@/types/types/AdminDashboardType";
import { SummaryCards } from "@/components/admin/Dashboard/SummaryCards";
import { TrendsChart } from "@/components/admin/Dashboard/TrendsCharts";
import { TopLawyersTable } from "@/components/admin/Dashboard/TopLawyerTable";
import { RecentTransactionsTable } from "@/components/admin/Dashboard/RecentTransactionsTable";
import { RecentDisputesList } from "@/components/admin/Dashboard/RecentDisputes";

export default function AdminDashboard() {
  const [range, setRange] = useState<"7d" | "30d" | "this-year" | "custom">(
    "30d"
  );

  const { startDate, endDate } = useMemo(() => {
    const now = dayjs();
    if (range === "7d")
      return {
        startDate: now.subtract(7, "day").format("YYYY-MM-DD"),
        endDate: now.format("YYYY-MM-DD"),
      };
    if (range === "30d")
      return {
        startDate: now.subtract(30, "day").format("YYYY-MM-DD"),
        endDate: now.format("YYYY-MM-DD"),
      };
    if (range === "this-year")
      return {
        startDate: now.startOf("year").format("YYYY-MM-DD"),
        endDate: now.format("YYYY-MM-DD"),
      };
    return { startDate: "", endDate: "" };
  }, [range]);

  const { data, isLoading, error } = useAdminDashboard(startDate, endDate);

  return (
    <AdminLayout>
      <main className="min-h-dvh bg-muted/30">
        <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <Header />
          <div className="flex justify-end mb-4">
            <RangeSelector value={range} onChange={setRange} />
          </div>
          {error ? (
            <div className="text-destructive">Failed to load dashboard.</div>
          ) : isLoading ? (
            <Skeleton />
          ) : (
            <DashboardContent data={data} />
          )}
        </section>
      </main>
    </AdminLayout>
  );
}

function Header() {
  return (
    <header className="mb-6 md:mb-8">
      <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
        Admin Dashboard
      </h1>
      <p className="text-muted-foreground">
        Overview of your legal platform performance and activity.
      </p>
    </header>
  );
}

function DashboardContent({ data }: { data?: FrontendAdminDashboard }) {
  return (
    <div className="space-y-6">
      <SummaryCards summary={data?.summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendsChart trends={data?.trends} />
        </div>
        <div className="lg:col-span-1">
          <TopLawyersTable rows={data?.topLawyers} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactionsTable rows={data?.recentTransactions} />
        </div>
        <div className="lg:col-span-1">
          <RecentDisputesList rows={data?.recentDisputes} />
        </div>
      </div>
    </div>
  );
}
