import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { CalendarX } from "lucide-react";

type Props = {
  appointment?: {
    id?: string;
    date?: string;
    time?: string;
    lawyerId?: string;
    lawyerName?: string;
    type?: string;
    status?: string;
  } | null;
};

function formatDate(d?: string) {
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(d)
    );
  } catch {
    return d;
  }
}

export function NextAppointmentCard({ appointment }: Props) {
  const a = appointment ?? null;
  return (
    <section aria-labelledby="next-appointment-heading">
      <h2
        id="next-appointment-heading"
        className="mb-2 text-sm font-medium text-muted-foreground"
      >
        Next Appointment
      </h2>
      <Card className="p-4">
        {!a ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <CalendarX className="w-6 h-6 mb-2 opacity-60" />
            <p className="text-sm">No upcoming appointments</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-4 sm:items-center">
            <div>
              <div className="text-xs text-muted-foreground">With</div>
              <div className="font-medium text-foreground">
                {a.lawyerName ?? "—"}
              </div>
              <div className="text-xs text-muted-foreground">
                {a.type ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="font-medium">{formatDate(a.date)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Time</div>
              <div className="font-medium">{a.time ?? "—"}</div>
            </div>
            <div className="sm:text-right">
              <StatusBadge status={a.status ?? "unknown"} />
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
