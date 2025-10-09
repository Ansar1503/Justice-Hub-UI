export function currency(value: number | undefined, currencyCode = "INR") {
  const n = typeof value === "number" ? value : 0;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string | undefined, withTime?: boolean) {
  if (!iso) return "—";
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
  if (!withTime) return date;
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${date} • ${time}`;
}
