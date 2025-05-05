import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScheduleVisualizationProps {
  selectedDate: Date | undefined;
  refreshTrigger: boolean;
}


const mockAvailability = [
  // { date: new Date(), slots: ["09:00-10:00", "10:30-11:30", "13:00-14:00"] },
  // { date: addDays(new Date(), 1), slots: ["09:00-10:00", "10:30-11:30"] },
  // { date: addDays(new Date(), 2), slots: ["14:00-15:00", "15:30-16:30"] },
  // {
  //   date: addDays(new Date(), 3),
  //   slots: ["09:00-10:00", "13:00-14:00", "16:00-17:00"],
  // },
  // { date: addDays(new Date(), 4), slots: ["10:00-11:00", "11:30-12:30"] },
];

const mockBlockedDates = [
  // { date: addDays(new Date(), 5), reason: "Personal leave" },
  // { date: addDays(new Date(), 6), reason: "Holiday" },
];

export default function ScheduleVisualization({
  selectedDate,
  refreshTrigger,
}: ScheduleVisualizationProps) {
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [availability, setAvailability] = useState(mockAvailability);
  const [blockedDates, setBlockedDates] = useState(mockBlockedDates);

  useEffect(() => {
    // This would be an API call in a real application
    console.log("Fetching availability data...");

    // For demo purposes, we're just using the mock data
    // but in a real app you'd fetch this data based on the selected date
    setAvailability(mockAvailability);
    setBlockedDates(mockBlockedDates);
  }, [refreshTrigger, selectedDate]);

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
              blockedDates.some((blocked) => isSameDay(blocked.date, day))
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

            {blockedDates.some((blocked) => isSameDay(blocked.date, day)) ? (
              <div className="flex justify-center mt-4">
                <Badge
                  variant="destructive"
                  className="dark:bg-red-700 dark:text-white"
                >
                  Blocked
                </Badge>
              </div>
            ) : (
              <div className="space-y-1">
                {availability
                  .filter((avail) => isSameDay(avail.date, day))
                  .flatMap((avail) => avail.slots)
                  .map((slot, index) => (
                    <div
                      key={index}
                      className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 rounded px-1 py-0.5 text-center"
                    >
                      {slot}
                    </div>
                  ))}

                {availability.filter((avail) => isSameDay(avail.date, day))
                  .length === 0 && (
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
