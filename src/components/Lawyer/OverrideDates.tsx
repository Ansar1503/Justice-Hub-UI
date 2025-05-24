"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addDays,
  isBefore,
  isAfter,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { slotSettings } from "@/types/types/SlotTypes";
import { useQueryClient } from "@tanstack/react-query";

interface OverrideDate {
  _id: string;
  date: Date;
  isUnavailable: boolean;
  timeRanges?: { start: string; end: string }[];
}

interface OverrideDatesProps {
  onUpdate: () => void;
}

export default function OverrideDates({ onUpdate }: OverrideDatesProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [timeRanges, setTimeRanges] = useState<
    { start: string; end: string }[]
  >([{ start: "09:00", end: "17:00" }]);
  const [overrideDates, setOverrideDates] = useState<OverrideDate[]>([]);
  const [slotSettings, setSlotSettings] = useState<slotSettings>({
    slotDuration: "30",
    maxDaysInAdvance: "30",
    autoConfirm: false,
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  useEffect(() => {
    const data: slotSettings | undefined = queryClient.getQueryData([
      "schedule",
      "settings",
    ]);
    if (data) {
      setSlotSettings(data);
    }
  }, [queryClient]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addDays(today, 30);

  const addOverrideMutate = async (data: any) => {
    const newOverride = {
      _id: Date.now().toString(),
      date: new Date(data.date),
      isUnavailable: data.isUnavailable,
      timeRanges: data.timeRanges,
    };
    setOverrideDates([...overrideDates, newOverride]);
    return newOverride;
  };

  const removeOverrideMutate = async ({ id }: { id: string }) => {
    setOverrideDates(overrideDates.filter((item) => item._id !== id));
  };

  const refetch = () => {
    console.log("Refetching data...");
  };

  const handleSaveOverride = async () => {
    if (selectedDates.length === 0) return;
    try {
      for (const date of selectedDates) {
        await addOverrideMutate({
          date: date.toISOString().split("T")[0],
          isUnavailable,
          timeRanges: isUnavailable ? [] : timeRanges,
        });
      }
      refetch();
      setIsDialogOpen(false);
      setSelectedDates([]);
      onUpdate();
    } catch (err) {
      console.error("Failed to save override", err);
    }
  };

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { start: "09:00", end: "17:00" }]);
  };

  const removeTimeRange = (index: number) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges.splice(index, 1);
    setTimeRanges(newTimeRanges);
  };

  const updateTimeRange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges[index][field] = value;
    setTimeRanges(newTimeRanges);
  };

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, today) || isAfter(date, maxDate)) {
      return;
    }

    const isSelected = selectedDates.some((d) => isSameDay(d, date));
    if (isSelected) {
      setSelectedDates(selectedDates.filter((d) => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const openOverrideDialog = () => {
    if (selectedDates.length === 0) return;
    setIsDialogOpen(true);
    setIsUnavailable(false);
    setTimeRanges([{ start: "09:00", end: "17:00" }]);
  };

  const removeOverrideDate = async (id: string) => {
    await removeOverrideMutate({ id });
    refetch();
  };

  const generateTimeOptions = () => {
    // const timeOptions = useMemo(() => {
    //   const duration = Number(slotSettings?.slotDuration);

    //   if (!duration || duration <= 0) return [];

    //   const count = Math.floor((24 * 60) / duration);

    //   try {
    //     const times = new RRule({
    //       freq: RRule.MINUTELY,
    //       interval: duration,
    //       count,
    //       dtstart: new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
    //       until: new Date(Date.UTC(2000, 0, 1, 23, 59, 59)),
    //     }).all();

    //     const options = times.map((date) => {
    //       const hours = date.getUTCHours().toString().padStart(2, "0");
    //       const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    //       return `${hours}:${minutes}`;
    //     });
    //     return options;
    //   } catch (error) {
    //     console.error("Error generating time options:", error);
    //     return [];
    //   }
    // }, [slotSettings?.slotDuration]);

    // const formatTime = useCallback((time24: string) => {
    //   const [hours, minutes] = time24.split(":");
    //   const hour = Number.parseInt(hours, 10);
    //   const period = hour >= 12 ? "pm" : "am";
    //   const hour12 = hour % 12 || 12;
    //   return `${hour12}:${minutes}${period}`;
    // }, []);
  };

  const timeOptions = generateTimeOptions();

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium dark:text-white">
          Override Specific Dates
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Select multiple dates to set custom hours or mark as unavailable
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="bg-black text-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Select the dates to override</h2>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">
              {format(currentMonth, "MMMM")} {format(currentMonth, "yyyy")}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="bg-transparent border-gray-700 hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="bg-transparent border-gray-700 hover:bg-gray-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-sm font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-9 w-9"></div>
            ))}

            {monthDays.map((day) => {
              const isSelected = selectedDates.some((d) => isSameDay(d, day));
              const isOverridden = overrideDates.some((d) =>
                isSameDay(new Date(d.date), day)
              );
              const isDisabled = isBefore(day, today) || isAfter(day, maxDate);

              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`h-9 w-9 rounded-md flex items-center justify-center relative
                    ${isSelected ? "bg-white text-black" : "hover:bg-gray-800"}
                    ${isToday(day) ? "bg-gray-800" : ""}
                    ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
                  `}
                >
                  {format(day, "d")}
                  {isOverridden && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                  )}
                </button>
              );
            })}

            {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-9 w-9"></div>
            ))}
          </div>

          {selectedDates.length > 0 && (
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm mb-2">
                Selected: {selectedDates.length} date
                {selectedDates.length > 1 ? "s" : ""}
              </p>
              <Button
                onClick={openOverrideDialog}
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                Set Override for Selected Dates
              </Button>
            </div>
          )}
        </div>

        {/* Overrides List Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium dark:text-white mb-2">
              Current Overrides
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dates with custom availability settings
            </p>
          </div>

          {overrideDates.length === 0 ? (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No date overrides set yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {overrideDates
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((override) => (
                  <Card
                    key={override._id}
                    className="dark:bg-gray-800 dark:border-gray-700"
                  >
                    <CardContent className="p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium dark:text-white">
                          {format(
                            new Date(override.date),
                            "EEEE, MMMM d, yyyy"
                          )}
                        </div>
                        {override.isUnavailable ? (
                          <div className="text-sm text-red-500 mt-1">
                            Unavailable (All day)
                          </div>
                        ) : (
                          <div className="text-sm text-green-500 mt-1">
                            Available:{" "}
                            {override.timeRanges
                              ?.map((range) => `${range.start} - ${range.end}`)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeOverrideDate(override._id)}
                        className="h-8 w-8 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Override for {selectedDates.length} selected date
              {selectedDates.length > 1 ? "s" : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected dates:{" "}
              {selectedDates.map((date) => format(date, "MMM d")).join(", ")}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="unavailable"
                checked={isUnavailable}
                onCheckedChange={setIsUnavailable}
              />
              <Label htmlFor="unavailable">Mark unavailable (All day)</Label>
            </div>

            {!isUnavailable && (
              <div className="space-y-4">
                <h4 className="font-medium">Which hours are you free?</h4>

                {timeRanges.map((range, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={range.start}
                      onValueChange={(value) =>
                        updateTimeRange(index, "start", value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span>-</span>

                    <Select
                      value={range.end}
                      onValueChange={(value) =>
                        updateTimeRange(index, "end", value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="End time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {timeRanges.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeRange(index)}
                      >
                        <span className="sr-only">Remove time range</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addTimeRange}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Range
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <Button type="button" onClick={handleSaveOverride}>
              Save Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
