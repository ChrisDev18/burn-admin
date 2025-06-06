import { z } from 'zod'
import {ValidationErrors} from "@/app/lib/parseRequest";
import {User} from "@prisma/client";

export const NewUserSchema = z.object({
  firstName: z
      .string()
      .trim()
      .min(1, { message: 'First name is required.' }),
  lastName: z
      .string()
      .trim()
      .min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      // .regex(/[^a-zA-Z0-9]/, {
      //   message: 'Contain at least one special character.',
      // })
      .trim(),
});

export type NewUserResponse = {
  success: true;
  user: User
  message: string;
} | {
  success: false;
  message: string;
} | {
  success: false;
  errors: ValidationErrors;
}