import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useFetchClientDashboardData } from "@/store/tanstack/queries";
import { KPIGrid } from "@/components/users/dashboard/KpiGrid";
import { NextAppointmentCard } from "@/components/users/dashboard/NextAppointmentCard";
import { RecentCases } from "@/components/users/dashboard/RecentCases";
import { UpcomingSessions } from "@/components/users/dashboard/UpcomingSessions";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";

function currency(n?: number) {
  const v = n ?? 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(v);
  } catch {
    return `$${v.toFixed(2)}`;
  }
}

export default function DashboardPage() {
  const { data, isPending } = useFetchClientDashboardData();
  console.log("data", data);
  const kpis = [
    { label: "Total Cases", value: data?.totalCases ?? 0 },
    { label: "Active Cases", value: data?.activeCases ?? 0 },
    { label: "Completed Cases", value: data?.completedCases ?? 0 },
    { label: "Total Appointments", value: data?.totalAppointments ?? 0 },
    { label: "Upcoming Appointments", value: data?.upcomingAppointments ?? 0 },
    { label: "Pending Payments", value: data?.pendingPayments ?? 0 },
    {
      label: "Wallet Balance",
      value: currency(data?.walletBalance),
      emphasis: "primary" as const,
    },
  ];

  function KPICardSkeleton() {
    return (
      <Card className="p-4" role="figure" aria-label="Loading KPI">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-6 w-16" />
      </Card>
    );
  }
  function SectionTitleSkeleton({ label }: { label: string }) {
    return (
      <div className="flex items-center justify-between">
        <span className="sr-only">{label}</span>
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  if (isPending) {
    return (
      <main
        className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6"
        aria-busy="true"
        aria-live="polite"
      >
        {/* Header */}
        <header className="space-y-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </header>

        {/* KPI Grid */}
        <section aria-labelledby="kpi-skeleton-heading" className="space-y-3">
          <h2 id="kpi-skeleton-heading" className="sr-only">
            Summary KPIs loading
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <KPICardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Next Appointment */}
        <section
          aria-labelledby="next-appointment-skeleton-heading"
          className="space-y-2"
        >
          <h2 id="next-appointment-skeleton-heading" className="sr-only">
            Next Appointment loading
          </h2>
          <Skeleton className="h-4 w-36" />
          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          </Card>
        </section>

        {/* Lists */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Cases */}
          <section
            aria-labelledby="recent-cases-skeleton-heading"
            className="space-y-2"
          >
            <SectionTitleSkeleton label="Recent Cases loading" />
            <Card className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 p-4"
                >
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              ))}
            </Card>
          </section>

          {/* Upcoming Sessions */}
          <section
            aria-labelledby="upcoming-sessions-skeleton-heading"
            className="space-y-2"
          >
            <SectionTitleSkeleton label="Upcoming Sessions loading" />
            <Card className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-4 p-4"
                >
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </Card>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-[#FFF2F2] dark:bg-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Your Legal Portal
            </h1>
            <p className="text-muted-foreground">
              Stay updated on your case progress and communicate with your legal
              team.
            </p>
          </div>

          <KPIGrid items={kpis} />
          <NextAppointmentCard
            appointment={
              data?.nextAppointment
                ? {
                    id: data.nextAppointment.id ?? "",
                    date: data.nextAppointment.date
                      ? data.nextAppointment.date.toString()
                      : "",
                    time: data.nextAppointment.time ?? "",
                    lawyerId: data.nextAppointment.lawyerId ?? "",
                    lawyerName: data.nextAppointment.lawyerName ?? "",
                    type: data.nextAppointment.type ?? "",
                    status: data.nextAppointment.status ?? "",
                  }
                : null
            }
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentCases
              cases={
                data?.cases?.slice(0, 5)?.map((c) => ({
                  id: c.id ?? "",
                  title: c.title ?? "",
                  status: c.status ?? "",
                  createdAt: c.createdAt ? c.createdAt.toString() : "",
                  summary: c.summary ?? "",
                })) ?? []
              }
            />
            <UpcomingSessions
              sessions={
                data?.sessions?.slice(0, 5)?.map((s) => ({
                  id: s.id ?? "",
                  caseId: s.caseId,
                  status: s.status,
                  start_time: s.start_time ?? "",
                  end_time: s.end_time ? s.end_time : null,
                  lawyer_id: s.lawyer_id,
                })) ?? []
              }
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
