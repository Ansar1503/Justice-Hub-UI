export type dayType =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface slotSettings {
  slotDuration: string;
  maxDaysInAdvance: string;
  autoConfirm: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export type Availability = {
  [key in string]: DayAvailability;
};
