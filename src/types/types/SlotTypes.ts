export type dayType =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface reccuringType {
  day: dayType;
  startTime?: string;
  endTime?: string;
  active?: boolean;
}

export interface slotSettings {
  slotDuration: string;
  bufferTime?: string;
  maxDaysInAdvance: string;
  autoConfirm: boolean;
}
