import type React from "react";
import { useFetchLawyerDashboardData } from "@/store/tanstack/queries";
import { KPIGrid } from "./KpiGrid";
import { NextAppointmentCard } from "./NextAppointment";
import { RecentCases } from "./RecentCases";
import { RecentAppointments } from "./RecentAppointment";
import { UpcomingSessions } from "./UpcomingSessions";
import { RecentReviews } from "./RecentReviews";
// import { RecentTransactions } from "./RecentTransactions";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-pretty text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function LawyerDashboardPage() {
  const { data, isPending } = useFetchLawyerDashboardData();
  const d = data;

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      {/* Header */}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* KPI Grid */}
          <Section title="">
            <KPIGrid data={d} loading={isPending} />
          </Section>

          {/* Next Appointment */}
          <Section title="Next Appointment">
            <NextAppointmentCard data={d} loading={isPending} />
          </Section>

          {/* Two-column grid for Recent Cases & Appointments */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Section title="Recent Cases">
              <RecentCases data={d} loading={isPending} />
            </Section>
            <Section title="Recent Appointments">
              <RecentAppointments data={d} loading={isPending} />
            </Section>
          </div>

          {/* Sessions */}
          <Section title="Sessions">
            <UpcomingSessions data={d} loading={isPending} />
          </Section>

          {/* Reviews */}
          <Section title="Reviews">
            <RecentReviews data={d} loading={isPending} />
          </Section>
        </main>

        {/* Right rail: Wallet & Transactions */}
        {/* <aside className="w-full md:w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-800 overflow-y-auto p-4 md:p-6 space-y-6">
          <Section title="Wallet & Transactions">
            <RecentTransactions data={d} loading={isPending} />
          </Section>
        </aside> */}
      </div>

      {/* Footer */}
      {/* <footer className="p-4 text-center text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} Your Firm. All rights reserved.
      </footer> */}
    </div>
  );
}
