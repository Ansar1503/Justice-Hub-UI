"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"

type Row = { name: string; casesHandled: number; earnings: number }

export function TopLawyersTable({ rows }: { rows?: Row[] }) {
  const data = rows ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="text-pretty">Top Lawyers</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-muted-foreground">No top lawyers to display</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Cases</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-right">{new Intl.NumberFormat().format(r.casesHandled)}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(r.earnings)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
