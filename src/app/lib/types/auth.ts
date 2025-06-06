import { z } from 'zod'
import {ValidationErrors} from "@/app/lib/parseRequest";
import {User} from "@prisma/client";

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

export type LogoutResponse = {
  success: boolean;
  message: string;
}

export type GetSessionResponse = {
  authenticated: true,
  userId: string
} | {
  authenticated: false
}

export type GetMeResponse = {
  success: false;
  message: string;
} | {
  success: true;
  user: Omit<User, 'password'>;
}