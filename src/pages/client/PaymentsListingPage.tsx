import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, ArrowRightCircle } from "lucide-react";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import { SelectComponent } from "@/components/SelectComponent";
import PaginationComponent from "@/components/pagination";
import { PaymentBaseType } from "@/types/types/PaymentType";
import { useFetchAllPayments } from "@/store/tanstack/queries";

type sortBy = "date" | "amount";
type sortOrder = "asc" | "desc";
type PaymentStatus = PaymentBaseType["status"] | "all";
type PaymentType = PaymentBaseType["paidFor"] | "all";
export default function PaymentsListingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<sortBy>("date");
  const [sortOrder, setSortOrder] = useState<sortOrder>("asc");
  const [status, setStatus] = useState<PaymentStatus>("all");
  const [PaymentType, setPaymentType] = useState<PaymentType>("all");

  const { data: paymentsData } = useFetchAllPayments({
    limit: itemsPerPage,
    order: sortOrder,
    page: currentPage,
    paidFor: PaymentType,
    sortBy: sortBy,
    status: status,
  });
  const payments = paymentsData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "failed":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "refunded":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className=" mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-widest font-bold border-primary/20 bg-primary/5 text-primary px-2 py-0.5"
                  >
                    Financial Records
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground mt-1 max-w-lg">
                  Audit and manage your transaction history across subscriptions
                  and appointments.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col-reverse sm:flex-row gap-3 items-center justify-between">
                <div className="w-full"></div>
                <SelectComponent
                  onSelect={(val) => setPaymentType(val as PaymentType)}
                  placeholder="Payment Type"
                  label="Payment Type"
                  values={["subscription", "appointment", "all"]}
                />
                <SelectComponent
                  onSelect={(val) => setStatus(val as PaymentStatus)}
                  placeholder="Status"
                  label="Status"
                  values={["paid", "pending", "failed", "refunded", "all"]}
                />
                <SelectComponent
                  onSelect={(val) => setSortBy(val as sortBy)}
                  placeholder="sortBy"
                  label="sortBy"
                  values={["date", "amount"]}
                />
                <SelectComponent
                  onSelect={(val) => setSortOrder(val as sortOrder)}
                  placeholder="sortOrder"
                  label="sortOrder"
                  values={["asc", "desc"]}
                />
                <SelectComponent
                  onSelect={(val) => setItemsPerPage(Number.parseInt(val))}
                  placeholder="Items Per Page"
                  label="Items Per Page"
                  values={["5", "10", "25", "50"]}
                />
              </div>

              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/20">
                    <TableRow className="border-b border-border/50 hover:bg-transparent">
                      <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground py-4 px-6">
                        Transaction ID
                      </TableHead>
                      <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground py-4">
                        Purpose
                      </TableHead>
                      <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground py-4">
                        Provider
                      </TableHead>
                      <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground py-4">
                        Amount
                      </TableHead>
                      <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground py-4">
                        Date
                      </TableHead>
                      <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground py-4">
                        Status
                      </TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <TableRow
                          key={payment.id}
                          className="border-b border-border/30 group hover:bg-secondary/10 transition-colors"
                        >
                          <TableCell className="font-mono text-[13px] py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="size-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                              <span className="text-foreground/90">
                                {payment.id?.slice(0, 14)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[13px]">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-secondary/50 text-[10px] capitalize font-medium"
                              >
                                {payment.paidFor}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-[13px] text-muted-foreground">
                            <div className="flex items-center gap-1.5 capitalize">
                              <CreditCard className="size-3" />
                              {payment.provider}
                            </div>
                          </TableCell>
                          <TableCell className="text-[13px] font-semibold tabular-nums">
                            {formatCurrency(payment.amount, payment.currency)}
                          </TableCell>
                          <TableCell className="text-[13px] text-muted-foreground tabular-nums">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="size-3" />
                              {new Date(payment.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 border ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-6">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Showing <span className="text-foreground font-bold">5</span>{" "}
                  of <span className="text-foreground font-bold">24</span>{" "}
                  transactions
                </p>
                <PaginationComponent
                  currentPage={currentPage}
                  handlePageChange={setCurrentPage}
                  totalItems={paymentsData?.totalCount || 0}
                  itemsPerPage={itemsPerPage}
                  totalPages={paymentsData?.totalPages || 0}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer className="border-t border-border/50 py-6 px-8 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors flex items-center gap-1.5 group">
              Documentation{" "}
              <ArrowRightCircle className="size-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              API Reference
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Audit Logs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary/60">LEXIS SYSTEMS</span>
            <span className="text-border">|</span>
            <span className="text-[9px]">v1.4.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
