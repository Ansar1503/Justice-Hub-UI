import { Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Availability, slotSettings } from "@/types/types/SlotTypes";
import { useUpdateAvailableSlots } from "@/store/tanstack/mutations/slotMutations";
import { useFetchAvailableSlots } from "@/store/tanstack/queries";
import { useParams } from "react-router-dom";
import { ResponseType } from "@/types/types/LoginResponseTypes";

interface ModalPosition {
  top: number;
  left: number;
}

const days = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export function AvailabilityForm() {
  const { id } = useParams();
  const { data } = useFetchAvailableSlots();
  const availabilityData = data?.data as Availability;
  const [availability, setAvailability] = useState<Availability>({
    monday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
    sunday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
  });
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copySourceDay, setCopySourceDay] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [modalPosition, setModalPosition] = useState<ModalPosition>({
    top: 0,
    left: 0,
  });
  const [slotSettings, setSlotSettings] = useState<slotSettings>({
    slotDuration: "30",
    maxDaysInAdvance: "30",
    autoConfirm: false,
  });
  const { mutateAsync, isPending } = useUpdateAvailableSlots();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (availabilityData && Object.keys(availabilityData).length > 0) {
      setAvailability(availabilityData);
    }
  }, [availabilityData]);
  useEffect(() => {
    const data: (ResponseType & { data: slotSettings }) | undefined =
      queryClient.getQueryData(["schedule", "settings"]);
    const settings = data?.data;
    if (settings && Object.keys(settings).length > 0) {
      setSlotSettings(settings);
    }
  }, [queryClient]);

 const timeOptions = useMemo(() => {
  const duration = Number(slotSettings?.slotDuration);

  const times = [];

  if (!duration || duration <= 0) {
    // Default: every 30 minutes
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

  // Custom duration
  const totalMinutesInDay = 24 * 60;

  for (let minutes = 0; minutes < totalMinutesInDay; minutes += duration) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const timeString = `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
    times.push(timeString);
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

  const toggleDay = useCallback((day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  }, []);

  const updateTimeSlot = useCallback(
    (day: string, index: number, field: "start" | "end", value: string) => {
      setAvailability((prev) => {
        const newTimeSlots = [...prev[day].timeSlots];
        newTimeSlots[index] = {
          ...newTimeSlots[index],
          [field]: value,
        };
        return {
          ...prev,
          [day]: {
            ...prev[day],
            timeSlots: newTimeSlots,
          },
        };
      });
    },
    []
  );

  const addTimeSlot = useCallback(
    (day: string) => {
      const lastTimeSlot =
        availability[day].timeSlots[availability[day].timeSlots.length - 1];
      const lastEndTime = lastTimeSlot.end;

      const lastEndTimeIndex = timeOptions.indexOf(lastEndTime);

      let newStartTime = "09:00";
      let newEndTime = "17:00";

      if (
        lastEndTimeIndex !== -1 &&
        lastEndTimeIndex < timeOptions.length - 1
      ) {
        newStartTime = lastEndTime;
        newEndTime = timeOptions[lastEndTimeIndex + 1];
      }

      setAvailability((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: [
            ...prev[day].timeSlots,
            { start: newStartTime, end: newEndTime },
          ],
        },
      }));
    },
    [availability, timeOptions]
  );

  const openCopyModal = useCallback(
    (day: string, event: React.MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const modalWidth = 320;
      const modalHeight = 400;

      let left = rect.left + rect.width + 10;
      let top = rect.top;

      if (left + modalWidth > window.innerWidth) {
        left = rect.left - modalWidth - 10;
      }

      if (top + modalHeight > window.innerHeight) {
        top = window.innerHeight - modalHeight - 20;
      }

      if (top < 20) {
        top = 20;
      }

      setCopySourceDay(day);
      setSelectedDays([]);
      setModalPosition({ top, left });
      setCopyModalOpen(true);
    },
    []
  );

  const toggleDaySelection = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  const copyTimesToSelectedDays = useCallback(() => {
    if (copySourceDay && selectedDays.length > 0) {
      const sourceTimeSlots = availability[copySourceDay].timeSlots;

      setAvailability((prev) => {
        const newAvailability = { ...prev };

        selectedDays.forEach((day) => {
          newAvailability[day] = {
            ...newAvailability[day],
            timeSlots: [...sourceTimeSlots],
          };
        });

        return newAvailability;
      });

      setCopyModalOpen(false);
    }
  }, [copySourceDay, selectedDays, availability]);

  const removeTimeSlot = useCallback((day: string, index: number) => {
    setAvailability((prev) => {
      if (prev[day].timeSlots.length <= 1) {
        return prev;
      }
      const newTimeSlots = [...prev[day].timeSlots];
      newTimeSlots.splice(index, 1);

      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: newTimeSlots,
        },
      };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync(availability);
  };

  const handleSelectAllDays = useCallback(() => {
    const allDays = days.map((d) => d.key).filter((d) => d !== copySourceDay);
    if (selectedDays.length === allDays.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(allDays);
    }
  }, [copySourceDay, selectedDays.length]);

  return (
    <form onSubmit={handleSubmit}>
      <CardContent>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg">
          {days.map((day) => (
            <div key={day.key} className="mb-4">
              <div className="flex items-center mb-2">
                <Switch
                  id={`${day.key}-toggle`}
                  checked={availability[day.key].enabled}
                  onCheckedChange={() => toggleDay(day.key)}
                  className="data-[state=checked]:bg-white data-[state=checked]:text-black"
                />
                <Label
                  htmlFor={`${day.key}-toggle`}
                  className="ml-2 text-gray-700 dark:text-gray-200"
                >
                  {day.label}
                </Label>
              </div>

              {availability[day.key].enabled && (
                <div className="pl-10">
                  {availability[day.key].timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3 mb-2">
                      <Select
                        value={slot.start}
                        onValueChange={(value) =>
                          updateTimeSlot(day.key, index, "start", value)
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700">
                          <SelectValue>{formatTime(slot.start)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {formatTime(time)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-gray-400">-</span>

                      <Select
                        value={slot.end}
                        onValueChange={(value) =>
                          updateTimeSlot(day.key, index, "end", value)
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700">
                          <SelectValue>{formatTime(slot.end)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {formatTime(time)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => addTimeSlot(day.key)}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => openCopyModal(day.key, e)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(day.key, index)}
                        disabled={availability[day.key].timeSlots.length <= 1}
                        className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {copyModalOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setCopyModalOpen(false)}
              />

              <div
                className="fixed bg-gray-900 p-6 rounded-lg w-80 shadow-xl border border-gray-700 z-50"
                style={{
                  top: `${modalPosition.top}px`,
                  left: `${modalPosition.left}px`,
                }}
              >
                <h3 className="text-lg font-medium mb-4 text-white">
                  COPY TIMES TO
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="select-all"
                      className="rounded bg-gray-800 border-gray-700"
                      onChange={handleSelectAllDays}
                      checked={selectedDays.length === days.length - 1}
                    />
                    <label htmlFor="select-all" className="ml-2 text-gray-200">
                      Select All
                    </label>
                  </div>

                  {days.map(
                    (day) =>
                      day.key !== copySourceDay && (
                        <div key={day.key} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`copy-to-${day.key}`}
                            className="rounded bg-gray-800 border-gray-700"
                            checked={selectedDays.includes(day.key)}
                            onChange={() => toggleDaySelection(day.key)}
                          />
                          <label
                            htmlFor={`copy-to-${day.key}`}
                            className="ml-2 text-gray-200"
                          >
                            {day.label}
                          </label>
                        </div>
                      )
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCopyModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={copyTimesToSelectedDays}>
                    Apply
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          disabled={isPending}
          type="submit"
          className="w-full bg-gray-200 text-black hover:bg-white"
        >
          {isPending ? "saving..." : id ? "Complete" : "Save"}
        </Button>
      </CardFooter>
    </form>
  );
}
