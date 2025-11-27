import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts"
import { motion } from "framer-motion"

type Trend = {
  date: string;
  commissionRevenue: number;
  subscriptionRevenue: number;
  cases: number;
}

export function TrendsChart({ trends }: { trends?: Trend[] }) {
  const data = trends ?? []
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle className="text-pretty">Revenue & Case Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">No trend data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" name="Date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis yAxisId="left" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === "commissionRevenue") return [`₹${value}`, "Commission"];
                    if (name === "subscriptionRevenue") return [`₹${value}`, "Subscription"];
                    return [value, name]
                  }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="commissionRevenue"
                  name="Commission Revenue"
                  stroke="hsl(var(--primary))"
                  fill="url(#revFill)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cases"
                  stroke="hsl(var(--foreground))"
                  dot={false}
                  strokeWidth={2}
                  name="cases"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="subscriptionRevenue"
                  stroke="hsl(var(--secondary))"
                  fill="url(#revFill2)"
                  strokeWidth={2}
                  name="Subscription Revenue"
                />

                <linearGradient id="revFill2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.05} />
                </linearGradient>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
