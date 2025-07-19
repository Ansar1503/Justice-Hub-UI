import { z } from "zod";

const slotSettingsSchema = z.object({
  slotDuration: z.string(),
  maxDaysInAdvance: z.string(),
  autoConfirm: z.boolean(),
});

export const getSlotSettingsZod = () => {
  return slotSettingsSchema;
};  
