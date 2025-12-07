import {z} from "zod";
import {Prisma, RadioShow} from "@prisma/client";
import {ValidationErrors} from "@/app/lib/parseRequest";

export const RadioShowSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  hosts: z.array(z.string()),
  photo: z.instanceof(File).optional()
      .or(z.literal('').transform(() => undefined)), // supports empty input fallback
});

export const RadioShowUploadSchema = z.object({
  file: z.any(),
 });

export type FrontendRadioShow = Omit<RadioShow, 'hosts'> & {
  hosts: string[]
};

export type FrontendNewRadioShow = Omit<Prisma.RadioShowCreateInput, 'hosts' | 'photo'> & {
  photo?: File,
  hosts: string[]
};

export type CreateRadioShowResponse = {
  success: true;
  radioShow: FrontendRadioShow
  message: string;
} | {
  success: false;
  message: string;
} | {
  success: false;
  errors: ValidationErrors;
}

export type UpdateRadioShowResponse = {
  success: true;
  radioShow: FrontendRadioShow
  message: string;
} | {
  success: false;
  message: string;
} | {
  success: false;
  errors: ValidationErrors;
}

export type ImportRadioShowResponse = {
  success: true;
  message: string;
} | {
  success: false;
  message: string;
} | {
  success: false;
  errors: ValidationErrors;
}