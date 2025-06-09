import {z} from "zod";
import {RadioShow} from "@prisma/client";

export const radioShowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  hosts: z.string().optional(),
  photo: z.string().url().optional(),
});

export type FrontendRadioShow = Omit<RadioShow, 'hosts'> & {
  hosts: string[]
};