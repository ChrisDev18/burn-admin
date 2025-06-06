import { z } from 'zod'
import {ValidationErrors} from "@/app/lib/parseRequest";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
      .string()
      .min(1, { message: 'Password is required' }),
});

export type LoginResponse = {
  success: true;
  message: string;
} | {
  success: false;
  message: string;
} | {
  success: false;
  errors: ValidationErrors;
}