"use client";

import type React from "react";

import { useState } from "react";
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

interface SettingsFormProps {
  onUpdate: () => void;
}

export default function SettingsForm({ onUpdate }: SettingsFormProps) {
  const [slotDuration, setSlotDuration] = useState("30");
  const [bufferTime, setBufferTime] = useState("0");
  const [maxDaysInAdvance, setMaxDaysInAdvance] = useState("30");
  const [autoConfirm, setAutoConfirm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would save the settings to your backend
    console.log("Saving settings:", {
      slotDuration,
      bufferTime,
      maxDaysInAdvance,
      autoConfirm,
    });

    // Mock API call
    setTimeout(() => {
      alert("Settings saved successfully");
      onUpdate();
    }, 500);
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
            <SelectItem
              value="15"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              15 minutes
            </SelectItem>
            <SelectItem
              value="30"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              30 minutes
            </SelectItem>
            <SelectItem
              value="45"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              45 minutes
            </SelectItem>
            <SelectItem
              value="60"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              60 minutes
            </SelectItem>
            <SelectItem
              value="90"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              90 minutes
            </SelectItem>
            <SelectItem
              value="120"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              120 minutes
            </SelectItem>
          </SelectContent>
        </Select>
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
            <SelectItem
              value="0"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              No buffer
            </SelectItem>
            <SelectItem
              value="5"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              5 minutes
            </SelectItem>
            <SelectItem
              value="10"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              10 minutes
            </SelectItem>
            <SelectItem
              value="15"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              15 minutes
            </SelectItem>
            <SelectItem
              value="30"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              30 minutes
            </SelectItem>
          </SelectContent>
        </Select>
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
            <SelectItem
              value="7"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              7 days
            </SelectItem>
            <SelectItem
              value="14"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              14 days
            </SelectItem>
            <SelectItem
              value="30"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              30 days
            </SelectItem>
            <SelectItem
              value="60"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              60 days
            </SelectItem>
            <SelectItem
              value="90"
              className="dark:text-white dark:focus:bg-gray-600"
            >
              90 days
            </SelectItem>
          </SelectContent>
        </Select>
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
      >
        Save Settings
      </Button>
    </form>
  );
}
