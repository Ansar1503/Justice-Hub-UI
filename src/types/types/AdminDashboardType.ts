export interface FrontendDashboardSummary {
  totalUsers: number;
  totalLawyers: number;
  totalClients: number;
  totalRevenue: number;
  totalCommission: number;
  totalLawyerPayouts: number;
  totalBookingAmountCollected: number;
  commissionGrowthPercent: number;
  subscriptionRevenue: number;
  subscriptionGrowthPercent: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  newSubscriptions: number;
  activeCases: number;
}


export interface FrontendDashboardTrendItem {
  date: string;
  commissionRevenue: number;
  subscriptionRevenue: number;
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
