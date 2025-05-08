"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityFormProps {
  selectedDate: Date | undefined;
  onUpdate: () => void;
}

export default function AvailabilityForm({
  selectedDate,
  onUpdate,
}: AvailabilityFormProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[] | []>([]);

  const addTimeSlot = () => {
    setTimeSlots([
      { id: crypto.randomUUID(), startTime: "09:00", endTime: "10:00" },
    ]);
    const lastSlot = timeSlots[timeSlots.length - 1];
    const newStartTime = lastSlot.endTime;

    const [hours, minutes] = newStartTime.split(":").map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes, 0);
    endDate.setHours(endDate.getHours() + 1);
    const newEndTime = `${endDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

    setTimeSlots([
      ...timeSlots,
      { id: crypto.randomUUID(), startTime: newStartTime, endTime: newEndTime },
    ]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const updateTimeSlot = (
    id: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Saving availability for:", selectedDate);
    console.log("Time slots:", timeSlots);
    onUpdate()
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h3 className="text-lg font-medium dark:text-white">
          {selectedDate
            ? format(selectedDate, "EEEE, MMMM d, yyyy")
            : "Select a date"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add available time slots for this specific date
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {timeSlots.map((slot, index) => (
          <Card key={slot.id} className="dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-5/12">
                  <Label
                    htmlFor={`start-time-${index}`}
                    className="dark:text-gray-200"
                  >
                    Start Time
                  </Label>
                  <Input
                    id={`start-time-${index}`}
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateTimeSlot(slot.id, "startTime", e.target.value)
                    }
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="w-full sm:w-5/12">
                  <Label
                    htmlFor={`end-time-${index}`}
                    className="dark:text-gray-200"
                  >
                    End Time
                  </Label>
                  <Input
                    id={`end-time-${index}`}
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      updateTimeSlot(slot.id, "endTime", e.target.value)
                    }
                    className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="w-full sm:w-2/12 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeTimeSlot(slot.id)}
                    disabled={timeSlots.length === 0}
                    className="dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={addTimeSlot}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>

        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          disabled={!selectedDate}
        >
          Save Availability
        </Button>
      </div>
    </form>
  );
}
