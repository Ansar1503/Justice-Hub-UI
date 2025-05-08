"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useUpdateScheduleSettings } from "@/store/tanstack/mutations";
import { useFetchSlotSettings } from "@/store/tanstack/queries";

interface SettingsFormProps {
  onUpdate: () => void;
  setDateAvailable: (date: any) => void;
}

export default function SettingsForm({
  onUpdate,
  setDateAvailable,
}: SettingsFormProps) {
  const { data, refetch } = useFetchSlotSettings();
  const settings = data?.data;
  const [slotDuration, setSlotDuration] = useState(
    settings?.slotDuration || "30"
  );
  const [bufferTime, setBufferTime] = useState(settings?.bufferTime || "0");
  const [maxDaysInAdvance, setMaxDaysInAdvance] = useState(
    settings?.maxDaysInAdvance || "30"
  );
  const [autoConfirm, setAutoConfirm] = useState(settings?.autoConfirm || true);
  const [errors, setErrors] = useState({
    slotDurationError: "",
    bufferTimeError: "",
    maxDaysInAdvanceError: "",
    autoConfirmError: "",
  });
  useEffect(() => {
    if (settings) {
      setSlotDuration(settings?.slotDuration.toString());
      setBufferTime(settings?.bufferTime.toString());
      setMaxDaysInAdvance(settings?.maxDaysInAdvance.toString());
      setDateAvailable(settings?.maxDaysInAdvance);
      setAutoConfirm(settings?.autoConfirm);
    }
  }, [settings]);
  const {
    mutateAsync: updateScheduleMutation,
    isPending: updateSettingsPending,
  } = useUpdateScheduleSettings();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slotDuration.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        slotDurationError: "slot duration is required",
      }));
      return;
    }
    if (Number(slotDuration) < 15) {
      setErrors((prev) => ({
        ...prev,
        slotDurationError: "slot duration cannot be less than 15",
      }));
      return;
    }
    if (maxDaysInAdvance.trim() == "") {
      setErrors((prev) => ({
        ...prev,
        maxDaysInAdvanceError: "max days in advance is required",
      }));
      return;
    }
    if (Number(maxDaysInAdvance) < 7) {
      setErrors((prev) => ({
        ...prev,
        maxDaysInAdvanceError: "max days in advance cannot be less than 7 days",
      }));
      return;
    }
    try {
      await updateScheduleMutation({
        autoConfirm,
        maxDaysInAdvance,
        slotDuration,
        bufferTime,
      });

      onUpdate();
      refetch();
    } catch (error) {
      console.log("error", error);
    } finally {
      setErrors({
        autoConfirmError: "",
        bufferTimeError: "",
        maxDaysInAdvanceError: "",
        slotDurationError: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="slot-duration" className="dark:text-gray-200">
            Appointment Duration
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="dark:bg-gray-700 dark:text-white">
                <p>How long each appointment slot will be</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={slotDuration} onValueChange={setSlotDuration}>
          <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
            {["15", "30", "45", "60", "90", "120"].map((val) => (
              <SelectItem
                value={val}
                key={val}
                className="dark:text-white dark:focus:bg-gray-600"
              >
                {val} minutes
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-red-600">{errors.slotDurationError}</span>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="buffer-time" className="dark:text-gray-200">
            Buffer Time Between Appointments
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="dark:bg-gray-700 dark:text-white">
                <p>Add break time between consecutive appointments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={bufferTime} onValueChange={setBufferTime}>
          <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select buffer time" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
            {["0", "5", "10", "15", "30"].map((num) => (
              <SelectItem
                value={num}
                key={num}
                className="dark:text-white dark:focus:bg-gray-600"
              >
                {num == "0" ? " No buffer" : num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-red-600">{errors.bufferTimeError}</span>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="max-days" className="dark:text-gray-200">
            Booking Window
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="dark:bg-gray-700 dark:text-white">
                <p>How far in advance clients can book appointments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={maxDaysInAdvance} onValueChange={setMaxDaysInAdvance}>
          <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Select maximum days" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
            {["7", "14", "30", "60", "90"].map((num) => (
              <SelectItem
                value={num}
                key={num}
                className="dark:text-white dark:focus:bg-gray-600"
              >
                {num} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-red-600">{errors.maxDaysInAdvanceError}</span>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-confirm"
          checked={autoConfirm}
          onCheckedChange={setAutoConfirm}
        />
        <Label htmlFor="auto-confirm" className="dark:text-gray-200">
          Auto-confirm bookings
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </TooltipTrigger>
            <TooltipContent className="dark:bg-gray-700 dark:text-white">
              <p>
                When enabled, bookings are automatically confirmed without your
                approval
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        disabled={updateSettingsPending}
      >
        Save Settings
      </Button>
    </form>
  );
}
