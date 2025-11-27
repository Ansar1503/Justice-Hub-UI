"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeValue } from "@/types/types/AdminDashboardType";

type Props = {
  value: RangeValue;
  onChange: (v: RangeValue) => void;
};

export default function RangeSelector({ value, onChange }: Props) {
  return (
    <div className="w-full max-w-[220px]">
      <label className="sr-only" htmlFor="range">
        Date range
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as RangeValue)}>
        <SelectTrigger id="range" aria-label="Select date range">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
