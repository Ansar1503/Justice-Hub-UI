import { clsx, type ClassValue } from "clsx";
import { StylesConfig } from "react-select";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};
export interface OptionType<T = unknown> {
  value: string;
  label: string;
  data?: T;
}

export const getCustomStyles = <T>(
  theme: "light" | "dark"
): StylesConfig<OptionType<T>, false> => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#1c1c1c" : "#fff",
    borderColor: state.isFocused ? "#6366f1" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
    borderRadius: "0.75rem",
    padding: "2px 6px",
    minHeight: "42px",
    "&:hover": {
      borderColor: theme === "dark" ? "#a3a3a3" : "#9ca3af",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#27272a" : "#fff",
    borderRadius: "0.5rem",
    boxShadow:
      theme === "dark"
        ? "0 4px 10px rgba(0,0,0,0.5)"
        : "0 4px 10px rgba(0,0,0,0.1)",
    marginTop: 4,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#6366f1"
      : state.isFocused
      ? theme === "dark"
        ? "#3f3f46"
        : "#f3f4f6"
      : "transparent",
    color: state.isSelected ? "#fff" : theme === "dark" ? "#e4e4e7" : "#111827",
    borderRadius: "0.375rem",
    padding: "8px 12px",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: theme === "dark" ? "#f9fafb" : "#111827",
  }),
  placeholder: (base) => ({
    ...base,
    color: theme === "dark" ? "#9ca3af" : "#6b7280",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: theme === "dark" ? "#9ca3af" : "#6b7280",
    "&:hover": {
      color: "#6366f1",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
});

export function formatTo12Hour(time: string): string {
  if (!time) return time;
  const [hoursStr, minutes] = time.split(":");
  const hours = parseInt(hoursStr, 10);
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = ((hours + 11) % 12) + 1;
  return `${formattedHours}:${minutes} ${suffix}`;
}
