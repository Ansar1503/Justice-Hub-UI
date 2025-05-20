"use client";

import * as React from "react";
import { Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RRule } from "rrule";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export function AvailabilityForm() {
  const [availability, setAvailability] = React.useState<
    Record<string, DayAvailability>
  >({
    monday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
    sunday: { enabled: false, timeSlots: [{ start: "09:00", end: "17:00" }] },
  });

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const updateTimeSlot = (
    day: string,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
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
  };

  const addTimeSlot = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const duplicateTimeSlot = (day: string, index: number) => {
    setAvailability((prev) => {
      const slotToDuplicate = prev[day].timeSlots[index];
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: [...prev[day].timeSlots, { ...slotToDuplicate }],
        },
      };
    });
  };

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":");
    const hour = Number.parseInt(hours, 10);
    const period = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes}${period}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const times = new RRule({
    freq: RRule.MINUTELY,
    interval: 30,
    count: 48,
    dtstart: new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
  }).all();

  const timeOptions = times.map((date) => {
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  });

  console.log(timeOptions);

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-[600px] bg-black text-white border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Set your availability
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Define ranges of time when you are available
            <br />
            You can customise all of this later in the availability page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 p-6 rounded-lg">
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
                    className="ml-2 text-gray-200"
                  >
                    {day.label}
                  </Label>
                </div>

                {availability[day.key].enabled && (
                  <div className="pl-10">
                    {availability[day.key].timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
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
                          onClick={() => duplicateTimeSlot(day.key, index)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-gray-200 text-black hover:bg-white"
          >
            Save Now
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
