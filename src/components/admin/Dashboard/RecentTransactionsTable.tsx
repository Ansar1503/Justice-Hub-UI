"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";

type Row = { id: string; amount: number; status: string; date: string };

export function RecentTransactionsTable({ rows }: { rows?: Row[] }) {
  const data = rows ?? [];
  console.log(data);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="text-pretty">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-muted-foreground">No recent transactions</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id?.slice(0, 8)}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        }).format(r.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">{r.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
