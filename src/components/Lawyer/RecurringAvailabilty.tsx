import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface RecurringSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  active: boolean;
}

interface RecurringAvailabilityProps {
  onUpdate: () => void;
}

export default function RecurringAvailability({
  onUpdate,
}: RecurringAvailabilityProps) {
  const [recurringSlots, setRecurringSlots] = useState<RecurringSlot[]>([
    {
      id: crypto.randomUUID(),
      day: "monday",
      startTime: "09:00",
      endTime: "17:00",
      active: true,
    },
    {
      id: crypto.randomUUID(),
      day: "tuesday",
      startTime: "09:00",
      endTime: "17:00",
      active: true,
    },
    {
      id: crypto.randomUUID(),
      day: "wednesday",
      startTime: "09:00",
      endTime: "17:00",
      active: true,
    },
    {
      id: crypto.randomUUID(),
      day: "thursday",
      startTime: "09:00",
      endTime: "17:00",
      active: true,
    },
    {
      id: crypto.randomUUID(),
      day: "friday",
      startTime: "09:00",
      endTime: "17:00",
      active: true,
    },
    {
      id: crypto.randomUUID(),
      day: "saturday",
      startTime: "10:00",
      endTime: "14:00",
      active: false,
    },
    {
      id: crypto.randomUUID(),
      day: "sunday",
      startTime: "10:00",
      endTime: "14:00",
      active: false,
    },
  ]);

  const addRecurringSlot = (day: string) => {
    // Check if day already exists
    if (recurringSlots.some((slot) => slot.day === day)) {
      alert(
        `You already have a recurring slot for ${
          day.charAt(0).toUpperCase() + day.slice(1)
        }`
      );
      return;
    }

    setRecurringSlots([
      ...recurringSlots,
      {
        id: crypto.randomUUID(),
        day,
        startTime: "09:00",
        endTime: "17:00",
        active: true,
      },
    ]);
  };

  const removeRecurringSlot = (id: string) => {
    setRecurringSlots(recurringSlots.filter((slot) => slot.id !== id));
  };

  const updateRecurringSlot = (
    id: string,
    field: keyof RecurringSlot,
    value: string | boolean
  ) => {
    setRecurringSlots(
      recurringSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would save the recurring slots to your backend
    console.log("Saving recurring availability:", recurringSlots);

    // Mock API call
    setTimeout(() => {
      alert("Recurring availability saved successfully");
      onUpdate();
    }, 500);
  };

  const weekdays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const availableWeekdays = weekdays.filter(
    (day) => !recurringSlots.some((slot) => slot.day === day.value)
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h3 className="text-lg font-medium dark:text-white">
          Recurring Weekly Schedule
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Set your regular weekly availability pattern
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {recurringSlots
          .sort((a, b) => {
            const dayOrder = [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ];
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
          })
          .map((slot) => (
            <Card
              key={slot.id}
              className={`dark:border-gray-600 ${
                slot.active ? "dark:bg-gray-700" : "dark:bg-gray-800 opacity-70"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full sm:w-3/12">
                    <Label className="dark:text-gray-200">Day</Label>
                    <div className="text-base font-medium mt-2 dark:text-white capitalize">
                      {slot.day}
                    </div>
                  </div>
                  <div className="w-full sm:w-3/12">
                    <Label
                      htmlFor={`start-time-${slot.id}`}
                      className="dark:text-gray-200"
                    >
                      Start Time
                    </Label>
                    <Input
                      id={`start-time-${slot.id}`}
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateRecurringSlot(
                          slot.id,
                          "startTime",
                          e.target.value
                        )
                      }
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      disabled={!slot.active}
                      required
                    />
                  </div>
                  <div className="w-full sm:w-3/12">
                    <Label
                      htmlFor={`end-time-${slot.id}`}
                      className="dark:text-gray-200"
                    >
                      End Time
                    </Label>
                    <Input
                      id={`end-time-${slot.id}`}
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateRecurringSlot(slot.id, "endTime", e.target.value)
                      }
                      className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      disabled={!slot.active}
                      required
                    />
                  </div>
                  <div className="w-full sm:w-3/12 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${slot.id}`}
                        checked={slot.active}
                        onCheckedChange={(checked) =>
                          updateRecurringSlot(slot.id, "active", checked)
                        }
                      />
                      <Label
                        htmlFor={`active-${slot.id}`}
                        className="dark:text-gray-200"
                      >
                        {slot.active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeRecurringSlot(slot.id)}
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

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {availableWeekdays.length > 0 && (
          <Select onValueChange={(value) => addRecurringSlot(value)}>
            <SelectTrigger className="w-full sm:w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Add weekday" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              {availableWeekdays.map((day) => (
                <SelectItem
                  key={day.value}
                  value={day.value}
                  className="dark:text-white dark:focus:bg-gray-600"
                >
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Button
        type="submit"
        className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
      >
        Save Recurring Schedule
      </Button>
    </form>
  );
}
