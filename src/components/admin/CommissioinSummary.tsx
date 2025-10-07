export function SummaryTile({
  label,
  adminPercent,
  adminAmount,
  lawyerAmount,
}: {
  label: string;
  adminPercent: number;
  adminAmount: number;
  lawyerAmount: number;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-2 text-sm font-medium text-foreground">{label}</div>
      <div className="text-sm text-muted-foreground">Booking amount: ₹1000</div>
      <div className="mt-3 flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Admin</span>
          <span className="text-foreground">
            ₹{adminAmount} ({adminPercent}%)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground">Lawyer</span>
          <span className="text-foreground">
            ₹{lawyerAmount} ({100 - adminPercent}%)
          </span>
        </div>
      </div>
    </div>
  );
}
