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

export interface OverrideDate {
  _id: string;
  date: Date;
  isUnavailable: boolean;
  timeRanges?: { start: string; end: string }[];
}

export interface OverrideDateResponse {
  lawyer_id: string;
  id: string;
  overrideDates: OverrideDate[];
}
