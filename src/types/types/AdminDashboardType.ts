export interface FrontendDashboardSummary {
  totalUsers: number;
  totalLawyers: number;
  totalClients: number;
  totalRevenue: number;
  commissionPaid: number;
  activeCases: number;
  disputesOpen: number;
  growthPercent: number;
}

export interface FrontendDashboardTrendItem {
  date: string;
  revenue: number;
  cases: number;
}

export interface FrontendTopLawyer {
  name: string;
  casesHandled: number;
  earnings: number;
}

export interface FrontendTransaction {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  date: string;
}

export interface FrontendDispute {
  id: string;
  type: string;
  status: "pending" | "resolved" | "rejected";
  reportedBy: string;
}

export interface FrontendAdminDashboard {
  summary?: Partial<FrontendDashboardSummary>;
  trends?: FrontendDashboardTrendItem[];
  topLawyers?: FrontendTopLawyer[];
  recentTransactions?: FrontendTransaction[];
  recentDisputes?: FrontendDispute[];
}
export type RangeValue = "7d" | "30d" | "this-year" | "custom";
