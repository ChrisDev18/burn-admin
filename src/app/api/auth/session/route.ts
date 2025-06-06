import {getSession} from "@/app/api/auth/session";
import {NextResponse} from "next/server";
import {GetSessionResponse} from "@/app/lib/types/auth";

export async function GET(): Promise<NextResponse<GetSessionResponse>> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, userId: session.userId as string }, { status: 401 });
}