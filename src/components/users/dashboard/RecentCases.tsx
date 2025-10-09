import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";

export type RecentCase = {
  id?: string;
  title?: string;
  status?: string;
  createdAt?: string;
  _id?: string;
  _title?: string;
  _status?: string;
  _createdAt?: string;
  _summary?: string;
};

type Props = {
  cases?: RecentCase[];
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

function norm(c: RecentCase) {
  return {
    id: c.id ?? c._id ?? Math.random().toString(36).slice(2),
    title: c.title ?? c._title ?? "Untitled case",
    status: c.status ?? c._status ?? "unknown",
    createdAt: c.createdAt ?? c._createdAt,
    summary: c._summary,
  };
}

export function RecentCases({ cases = [] }: Props) {
  const list = cases.map(norm);
  return (
    <section aria-labelledby="recent-cases-heading" className="space-y-2">
      <h2
        id="recent-cases-heading"
        className="text-sm font-medium text-muted-foreground"
      >
        Recent Cases
      </h2>
      <Card className="divide-y">
        {list.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No recent cases.
          </div>
        ) : (
          list.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <div className="text-pretty text-sm font-medium text-foreground">
                  {c.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Created {formatDate(c.createdAt)}
                </div>
                {c.summary ? (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {c.summary}
                  </p>
                ) : null}
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))
        )}
      </Card>
    </section>
  );
}
