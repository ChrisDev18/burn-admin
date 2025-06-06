import {LoginResponse, LoginSchema} from '@/app/lib/types/auth'
import {compare} from "@uswriting/bcrypt";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';
import {parseAndValidate} from "@/app/lib/parseRequest";

export async function POST(req: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const result = await parseAndValidate(req, LoginSchema);

    if (! result.success) return result.response;

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !compare(password, user.password))
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });

    return NextResponse.json({ success: true, message: 'Logged in' }, { status: 200 });

  } catch (err) {
    console.error("Unknown error during POST /auth :", err)
    return NextResponse.json({ success: false, message: 'An unexpected error occurred, try again later' }, { status: 500 });
  }
}