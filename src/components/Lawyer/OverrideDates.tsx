"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import type {
  OverrideDate,
  OverrideDateResponse,
  slotSettings,
} from "@/types/types/SlotTypes";
import { useQueryClient } from "@tanstack/react-query";
import type { ResponseType } from "@/types/types/LoginResponseTypes";
import {
  useFetchOverrideSlots,
  useFetchSlotSettings,
} from "@/store/tanstack/queries";
import {
  useAddOverrideSlots,
  useDeleteOverrideSlot,
} from "@/store/tanstack/mutations/slotMutations";

export default function OverrideDates() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [timeRanges, setTimeRanges] = useState<
    { start: string; end: string }[]
  >([{ start: "09:00", end: "17:00" }]);
  const [overrideDates, setOverrideDates] =
    useState<OverrideDateResponse | null>(null);
  const [slotSettings, setSlotSettings] = useState<slotSettings>({
    slotDuration: "30",
    maxDaysInAdvance: "30",
    autoConfirm: false,
  });
  console.log("overrideDates", overrideDates);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { data: overrideData, refetch: fetchOverrideData } =
    useFetchOverrideSlots();
  const overrideSlots = overrideData?.data;
  const { mutateAsync: DeleteOverrideSlot } = useDeleteOverrideSlot();
  const { data, refetch } = useFetchSlotSettings();
  const { mutateAsync: AddOverrideSlots } = useAddOverrideSlots();
  const slotSettingsData = data?.data;

  const cacheData: (ResponseType & { data: slotSettings }) | undefined =
    useMemo(
      () => queryClient.getQueryData(["schedule", "settings"]),
      [queryClient]
    );
  const cachedSlotSettings = cacheData?.data;

  const cachedOverrideSlots: OverrideDateResponse | undefined = useMemo(
    () => queryClient.getQueryData(["schedule", "overrides"]),
    [queryClient]
  );

  const { today, maxDate } = useMemo(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const maxAdvanceDays = Number(slotSettings?.maxDaysInAdvance) || 30;
    return {
      today: todayDate,
      maxDate: addDays(todayDate, maxAdvanceDays),
    };
  }, [slotSettings?.maxDaysInAdvance]);

  useEffect(() => {
    const fetchData = async () => {
      if (overrideSlots) {
        setOverrideDates({
          lawyer_id: overrideSlots.lawyer_id,
          _id: overrideSlots._id || "",
          overrideDates: overrideSlots.overrideDates,
        });
      } else if (cachedOverrideSlots) {
        setOverrideDates({
          lawyer_id: cachedOverrideSlots.lawyer_id,
          _id: cachedOverrideSlots._id || "",
          overrideDates: cachedOverrideSlots.overrideDates,
        });
      } else {
        await fetchOverrideData();
      }
    };
    fetchData();
  }, [overrideSlots, cachedOverrideSlots, fetchOverrideData]);

  const allOverrideDates = useMemo(() => {
    return overrideDates?.overrideDates || [];
  }, [overrideDates]);

  useEffect(() => {
    const fetchData = async () => {
      if (cachedSlotSettings && Object.keys(cachedSlotSettings).length > 0) {
        setSlotSettings({
          slotDuration: cachedSlotSettings.slotDuration.toString(),
          maxDaysInAdvance: cachedSlotSettings.maxDaysInAdvance.toString(),
          autoConfirm: cachedSlotSettings.autoConfirm,
        });
      } else if (slotSettingsData && Object.keys(slotSettingsData).length > 0) {
        setSlotSettings({
          slotDuration: slotSettingsData.slotDuration.toString(),
          maxDaysInAdvance: slotSettingsData.maxDaysInAdvance.toString(),
          autoConfirm: slotSettingsData.autoConfirm,
        });
      } else {
        await refetch();
      }
    };
    fetchData();
  }, [cachedSlotSettings, slotSettingsData, refetch]);

  const timeOptions = useMemo(() => {
    const duration = Number(slotSettings?.slotDuration);

    if (!duration || duration <= 0) {
      const times = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
          times.push(timeString);
        }
      }
      return times;
    }

    const times = [];
    const totalMinutesInDay = 24 * 60;

    for (let minutes = 0; minutes < totalMinutesInDay; minutes += duration) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      if (hours < 24) {
        const timeString = `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}`;
        times.push(timeString);
      }
    }

    return times;
  }, [slotSettings?.slotDuration]);

  const formatTime = useCallback((time24: string) => {
    const [hours, minutes] = time24.split(":");
    const hour = Number.parseInt(hours, 10);
    const period = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes}${period}`;
  }, []);

  const validateTimeRanges = useCallback(
    (ranges: { start: string; end: string }[]): boolean => {
      for (const range of ranges) {
        if (!range.start || !range.end) return false;

        const [startHour, startMin] = range.start.split(":").map(Number);
        const [endHour, endMin] = range.end.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        if (startMinutes >= endMinutes) return false;
      }
      return true;
    },
    []
  );

  const isDateOverridden = useCallback(
    (date: Date): boolean => {
      return allOverrideDates.some((override) =>
        isSameDay(new Date(override.date), date)
      );
    },
    [allOverrideDates]
  );

  const getAlreadyOverriddenDates = useCallback(
    (dates: Date[]): Date[] => {
      return dates.filter((date) => isDateOverridden(date));
    },
    [isDateOverridden]
  );

  const handleFormSubmit = async () => {
    if (selectedDates.length === 0) {
      toast.error("Please select at least one date to override");
      return;
    }

    const duplicateDates = getAlreadyOverriddenDates(selectedDates);
    if (duplicateDates.length > 0) {
      const duplicateDateStrings = duplicateDates
        .map((date) => format(date, "MMM d"))
        .join(", ");
      toast.error(
        `The following dates already have overrides: ${duplicateDateStrings}. Please remove them from your selection.`
      );
      return;
    }

    if (!isUnavailable && !validateTimeRanges(timeRanges)) {
      toast.error(
        "Please ensure all time ranges have valid start and end times, with start time before end time."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const newOverrides: OverrideDate[] = selectedDates.map((date) => ({
        _id: `${Date.now()}-${Math.random()}-${date.getTime()}`,
        date: date,
        isUnavailable,
        timeRanges: isUnavailable ? [] : [...timeRanges],
      }));

      await AddOverrideSlots(newOverrides);

      setIsDialogOpen(false);
      setSelectedDates([]);
      setIsUnavailable(false);
      setTimeRanges([{ start: "09:00", end: "17:00" }]);
    } catch (err) {
      console.error("Failed to add override", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTimeRange = useCallback(() => {
    setTimeRanges((prev) => [...prev, { start: "09:00", end: "17:00" }]);
  }, []);

  const removeTimeRange = useCallback(
    (index: number) => {
      if (timeRanges.length <= 1) return;
      setTimeRanges((prev) => prev.filter((_, i) => i !== index));
    },
    [timeRanges.length]
  );

  const updateTimeRange = useCallback(
    (index: number, field: "start" | "end", value: string) => {
      setTimeRanges((prev) => {
        const newTimeRanges = [...prev];
        newTimeRanges[index][field] = value;
        return newTimeRanges;
      });
    },
    []
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (isBefore(date, today) || isAfter(date, maxDate)) {
        return;
      }

      if (isDateOverridden(date)) {
        toast.error(
          `${format(
            date,
            "MMM d"
          )} already has an override. Please remove the existing override first.`
        );
        return;
      }

      setSelectedDates((prev) => {
        const isSelected = prev.some((d) => isSameDay(d, date));
        if (isSelected) {
          return prev.filter((d) => !isSameDay(d, date));
        } else {
          return [...prev, date];
        }
      });
    },
    [today, maxDate, isDateOverridden]
  );

  const openOverrideDialog = useCallback(() => {
    if (selectedDates.length === 0) return;
    setIsDialogOpen(true);
    setIsUnavailable(false);
    setTimeRanges([{ start: "09:00", end: "17:00" }]);
  }, [selectedDates.length]);

  const removeOverrideDate = async (overrideId: string) => {
    try {
      await DeleteOverrideSlot(overrideId);
    } catch (error) {
      console.error("Failed to remove override date", error);
    }
  };

  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }, []);

  const { monthStart, monthEnd, monthDays } = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    return { monthStart: start, monthEnd: end, monthDays: days };
  }, [currentMonth]);
  console.log('selectedDates', selectedDates);
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
            <h3 className="text-lg">{format(currentMonth, "MMMM yyyy")}</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="bg-transparent border-gray-700 hover:bg-gray-800"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="bg-transparent border-gray-700 hover:bg-gray-800"
                aria-label="Next month"
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
              const isOverridden = isDateOverridden(day);
              const isDisabled = isBefore(day, today) || isAfter(day, maxDate);

              return (
                <button
                  key={day.toString()}
                  onClick={() => handleDateSelect(day)}
                  disabled={isDisabled}
                  aria-label={`${format(day, "MMMM d, yyyy")}${
                    isSelected ? " (selected)" : ""
                  }${isOverridden ? " (overridden)" : ""}`}
                  className={`h-9 w-9 rounded-md flex items-center justify-center relative transition-colors
                    ${isSelected ? "bg-white text-black" : "hover:bg-gray-800"}
                    ${isToday(day) ? "bg-gray-800" : ""}
                    ${isOverridden ? "bg-red-600 hover:bg-red-700" : ""}
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
              <div className="text-xs text-gray-400 mb-2">
                {selectedDates
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date) => format(date, "MMM d"))
                  .join(", ")}
              </div>
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
              Overrides
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Dates with custom availability settings
            </p>
          </div>

          {allOverrideDates.length === 0 ? (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No date overrides added yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {allOverrideDates
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
                              ?.map(
                                (range) =>
                                  `${formatTime(range.start)} - ${formatTime(
                                    range.end
                                  )}`
                              )
                              .join(", ") || "No time ranges"}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeOverrideDate(override._id)}
                        className="h-8 w-8 ml-2"
                        aria-label={`Remove override for ${format(
                          new Date(override.date),
                          "MMMM d, yyyy"
                        )}`}
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
              Override for {selectedDates.length} date
              {selectedDates.length > 1 && "s"}
            </DialogTitle>
            <DialogDescription>
              Choose whether to mark these dates unavailable, or specify
              available hours. Each date will be created as a separate override
              entry.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected dates:{" "}
              {selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date) => format(date, "MMM d"))
                .join(", ")}
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
                            {formatTime(time)}
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
                        <SelectValue>{formatTime(range.end)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={`end-${time}`} value={time}>
                            {formatTime(time)}
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
                        aria-label="Remove time range"
                      >
                        <X className="h-4 w-4" />
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
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Adding..."
                : `Add ${selectedDates.length} Override${
                    selectedDates.length > 1 ? "s" : ""
                  }`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
