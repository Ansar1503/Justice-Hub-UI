import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFetchAvailableSlotsByWeek } from "@/store/tanstack/queries";

interface ScheduleVisualizationProps {
  selectedDate: Date | undefined;
  refreshTrigger: boolean;
}

export default function ScheduleVisualization({
  selectedDate,
  refreshTrigger,
}: ScheduleVisualizationProps) {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const { data, refetch } = useFetchAvailableSlotsByWeek(weekStart);
  const BlockedDates = data?.data?.blocks;
  const AvailableSlots = data?.data?.slots;
  useEffect(() => {
    refetch();
  }, [refreshTrigger,weekStart]);

  const nextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const prevWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevWeek}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium dark:text-white">
          {format(weekStart, "MMM d")} -{" "}
          {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={nextWeek}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={`border rounded-md p-2 min-h-[120px] dark:border-gray-700 ${
              selectedDate && isSameDay(day, selectedDate)
                ? "border-emerald-500 dark:border-emerald-500"
                : ""
            } ${
              BlockedDates &&
              BlockedDates.some((blocked: any) => isSameDay(blocked.date, day))
                ? "bg-gray-100 dark:bg-gray-800"
                : "dark:bg-gray-700"
            }`}
          >
            <div className="text-center mb-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format(day, "EEE")}
              </div>
              <div className="font-medium dark:text-white">
                {format(day, "d")}
              </div>
            </div>

            {BlockedDates &&
            BlockedDates.some((blocked: any) =>
              isSameDay(new Date(blocked.date), day)
            ) ? (
              <div className="flex flex-col items-center mt-4">
                <Badge
                  variant="destructive"
                  className="dark:bg-red-700 dark:text-white"
                >
                  Blocked
                </Badge>
                {BlockedDates.find((b: any) => isSameDay(new Date(b.date), day))
                  ?.reason && (
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {
                      BlockedDates.find((b: any) =>
                        isSameDay(new Date(b.date), day)
                      )?.reason
                    }
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {AvailableSlots &&
                  AvailableSlots.filter((avail: any) =>
                    isSameDay(new Date(avail.date), day)
                  )
                    .flatMap((avail: any) => avail.timeSlots)
                    .map((slot: any, index: number) => (
                      <div
                        key={index}
                        className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 rounded px-1 py-0.5 text-center"
                      >
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}

                {AvailableSlots &&
                  AvailableSlots.filter((avail: any) =>
                    isSameDay(avail.date, day)
                  ).length === 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                      No slots
                    </div>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
