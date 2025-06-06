import {z} from "zod";

export const radioShowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  hosts: z.string().optional(),
  photo: z.string().url().optional(),
});

export type IRadioShow = {
  title: string,
  description: string | null,
  hosts: string | null,
  photo: string | null,
}