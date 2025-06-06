import {updateSession} from "@/app/api/auth/session";
import {NextResponse} from "next/server";

export async function GET() {
  const result = await updateSession()

  if (!result) {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}