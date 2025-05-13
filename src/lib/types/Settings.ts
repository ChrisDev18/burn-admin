import {z} from "zod";

export const settingSchema = z.object({
  defaultShow: z.number().int().optional(),
  offAirShow: z.number().int().optional(),
});