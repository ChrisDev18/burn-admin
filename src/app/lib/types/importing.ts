import {z} from "zod";

export const RadioShowsFileSchema = z.array(
    z.object({
      title: z.string(),
      description: z.string().or(z.null()).optional(),
      hosts: z.string().or(z.null()).optional(),
      photo: z.string().or(z.null()).optional()
    })
);