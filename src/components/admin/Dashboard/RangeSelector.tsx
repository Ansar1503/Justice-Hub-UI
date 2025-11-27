"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeValue } from "@/types/types/AdminDashboardType";
import { Input } from "@/components/ui/input";

type Props = {
  value: RangeValue;
  onChange: (v: RangeValue) => void;
  customStart: string;
  customEnd: string;
  onCustomChange: (field: "start" | "end", value: string) => void;
  error?: string;
};

export default function RangeSelector({
  value,
  onChange,
  customStart,
  customEnd,
  onCustomChange,
  error,
}: Props) {
  return (
    <div className="w-full max-w-[350px] space-y-3">
      <label className="sr-only" htmlFor="range">
        Date range
      </label>

      {/* Range Dropdown */}
      <Select value={value} onValueChange={(v) => onChange(v as RangeValue)}>
        <SelectTrigger id="range" aria-label="Select date range">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      {value === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">From</label>
            <Input
              type="date"
              value={customStart}
              onChange={(e) => onCustomChange("start", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">To</label>
            <Input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomChange("end", e.target.value)}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
