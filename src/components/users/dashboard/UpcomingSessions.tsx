import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";

export type SessionListItem = {
  id?: string;
  caseId?: string;
  status?: string;
  start_time?: string;
  end_time?: string | null;
  lawyer_id?: string;
};

type Props = {
  sessions?: SessionListItem[];
};

function fmtDT(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

export function UpcomingSessions({ sessions = [] }: Props) {
  return (
    <section aria-labelledby="upcoming-sessions-heading" className="space-y-2">
      <h2
        id="upcoming-sessions-heading"
        className="text-sm font-medium text-muted-foreground"
      >
        Upcoming Sessions
      </h2>
      <Card className="divide-y">
        {sessions.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No upcoming sessions.
          </div>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id ?? Math.random()}
              className="flex items-start justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <div className="text-pretty text-sm font-medium">
                  Case {s.caseId?.slice(0, 10) ?? "—"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Starts {fmtDT(s.start_time)}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <StatusBadge status={s.status ?? "unknown"} />
                <div className="text-xs text-muted-foreground">
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </section>
  );
}
