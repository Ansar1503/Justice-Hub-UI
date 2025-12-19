import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatTo12Hour } from "@/utils/utils";
import { slotSettings } from "@/types/types/SlotTypes";

interface TimeRange {
  start: string;
  end: string;
  availableSlots: number;
}

interface DateAvailability {
  date: string;
  isAvailable: boolean;
  timeRanges: TimeRange[];
}

interface EnhancedAvailabilityCalendarProps {
  scheduleSettings?: slotSettings;
  onMonthChange: (date: Date) => void;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  availabilityData: DateAvailability[];
  disabled?: (date: Date) => boolean;
  fromMonth?: Date;
  toMonth?: Date;
  className?: string;
}

export function EnhancedAvailabilityCalendar({
  selected,
  onSelect,
  availabilityData,
  disabled,
  fromMonth,
  className,
  onMonthChange,
  scheduleSettings,
}: EnhancedAvailabilityCalendarProps) {
  const availabilityMap = useMemo(() => {
    const map = new Map<string, DateAvailability>();
    if (availabilityData) {
      availabilityData.forEach((item) => {
        map.set(item.date, item);
      });
    }
    return map;
  }, [availabilityData]);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    fromMonth || new Date()
  );
  const limit = !isNaN(Number(scheduleSettings?.maxDaysInAdvance))
    ? Number(scheduleSettings?.maxDaysInAdvance)
    : 30;
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + limit);

  const isPrevDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() <= today.getMonth();

  const isNextDisabled = currentMonth >= maxDate;

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateToISO = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getAvailabilityForDate = (date: Date) => {
    const isoDate = formatDateToISO(date);
    return availabilityMap.get(isoDate);
  };

  const isDateDisabled = (date: Date) => {
    if (disabled) return disabled(date);
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selected) return false;
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    setCurrentMonth(newMonth);
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
    setCurrentMonth(newMonth);
    onMonthChange(newMonth);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <TooltipProvider>
      <div className={cn("w-full p-4 bg-card rounded-lg border", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">{monthName}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              className="h-8 w-8 p-0 bg-transparent disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              disabled={isNextDisabled}
              className="h-8 w-8 p-0 bg-transparent disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-muted-foreground">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Selected</span>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);
            const availability = getAvailabilityForDate(date);
            const isAvailable = availability?.isAvailable && !isDisabled;

            return (
              <Tooltip key={date.toISOString()}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSelect(isSelected ? undefined : date)}
                    disabled={isDisabled}
                    className={cn(
                      "aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-sm font-medium transition-all relative",
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                        : isAvailable
                        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-foreground hover:border-emerald-400 dark:hover:border-emerald-600 cursor-pointer"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-muted-foreground cursor-not-allowed opacity-50",
                      isDisabled && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    <span>{date.getDate()}</span>
                    {isAvailable && (
                      <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                </TooltipTrigger>
                {availability && (
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {availability.isAvailable ? (
                        <div className="space-y-1">
                          {availability.timeRanges.map((range, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatTo12Hour(range.start)} -{" "}
                                {formatTo12Hour(range.end)}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                ({range.availableSlots} slots)
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          <span>Not available</span>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
