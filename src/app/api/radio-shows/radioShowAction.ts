'use server';

import { LoginSchema, LoginResponse } from '@/app/lib/types/auth';
import { createSession } from '@/app/api/auth/session';
import prisma from '@/app/lib/prisma';
import { compare } from '@uswriting/bcrypt';
import {redirect} from "next/navigation";

export async function radioShowAction(): Promise<LoginResponse> {
  const result = LoginSchema.safeParse(formData);
  if (!result.success) {
    return {
      success: false,
      message: 'Validation error',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !compare(password, user.password)) {
    return {
      success: false,
      message: 'Invalid credentials',
    };
  }

  await createSession(user.id.toString());

  return redirect("/");
}