"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";

type Row = { id: string; type: string; status: string; reportedBy: string };

export function RecentDisputesList({ rows }: { rows?: Row[] }) {
  const data = rows ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="text-pretty">Recent Disputes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.length === 0 ? (
            <div className="text-muted-foreground">
              No disputes at this time
            </div>
          ) : (
            <ul className="space-y-3">
              {data.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-pretty">{d.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {d.reportedBy}
                    </div>
                  </div>
                  <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
