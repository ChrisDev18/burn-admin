import {LogoutResponse} from '@/app/lib/types/auth'
import { NextRequest, NextResponse } from 'next/server';
import {deleteSession} from "@/app/api/auth/session";

export async function GET(req: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {

    await deleteSession();

    return NextResponse.json({ success: true, message: 'Logged out' }, { status: 200 });

  } catch (err) {
    console.error("Unknown error during POST /auth :", err)
    return NextResponse.json({ success: false, message: 'An unexpected error occurred, try again later' }, { status: 500 });
  }
}