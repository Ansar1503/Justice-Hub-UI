import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationComponent from "../pagination";
import { useFetchWalletTransactions } from "@/store/tanstack/Queries/walletQueries";
import { useState } from "react";
import { SelectComponent } from "../SelectComponent";
import SearchComponent from "../SearchComponent";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type transactionType = "credit" | "debit" | "All";

export function TransactionTable() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState<transactionType>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { data: transactionData } = useFetchWalletTransactions({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    type: type,
    startDate,
    endDate,
  });
  const transactions = transactionData?.data || [];
  const totalPages = transactionData?.totalPages || 1;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string | Date) => {
    if (!dateString) return "";
    let date: Date;
    if (typeof dateString === "string") {
      date = new Date(dateString);
    } else {
      date = dateString;
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const transactionTypes: transactionType[] = ["All", "credit", "debit"];

  const formatShort = (d?: Date) =>
    d
      ? d.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : undefined;

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Recent Transactions
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 pb-4">
          <div className="flex flex-wrap items-end gap-3">
            <SearchComponent
              className="min-w-[220px] flex-1"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search description..."
            />

            {/* Type */}
            <SelectComponent
              className="bg-white/5"
              onSelect={(val) => {
                if (transactionTypes.includes(val as any)) {
                  setType(val as transactionType);
                }
              }}
              label="Type"
              placeholder="All"
              values={transactionTypes}
            />

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Start Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatShort(startDate) : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    disabled={(date) => date > new Date()}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">End Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatShort(endDate) : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    disabled={(date) => date > new Date()}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Items per page */}
            <SelectComponent
              onSelect={(val) => {
                const num = Number.parseInt(val);
                if (!isNaN(num)) setItemsPerPage(num);
              }}
              label="Items per page"
              placeholder="Items"
              values={["5", "10", "20", "50"]}
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm font-medium">
                      {formatDateTime(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "credit"
                            ? "default"
                            : "secondary"
                        }
                        className={`flex w-fit items-center gap-1 ${
                          transaction.type === "credit"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3" />
                        )}
                        {transaction.type === "credit" ? "Credit" : "Debit"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        transaction.type === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.description}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t p-6 pt-4">
          <PaginationComponent
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={transactions.length}
            totalPages={totalPages}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionTable;
