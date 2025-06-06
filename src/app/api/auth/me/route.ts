import {NextResponse} from "next/server";
import {GetMeResponse} from "@/app/lib/types/auth";
import {getSession} from "@/app/api/auth/session";
import prisma from "@/app/lib/prisma";

export async function GET(): Promise<NextResponse<GetMeResponse>> {
  // 1. Check user is authenticated
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthenticated request" }, { status: 401 });
  }

  // 2. Find user
  const user = await prisma.user.findUnique({
    where: {
      id: Number.parseInt(session.userId)
    },
    omit: {
      password: true
    }
  });
  if (! user) {
    return NextResponse.json({ success: false, message: "Authenticated user no longer found in database" }, { status: 400 });
  }

  // 3. Return user
  return NextResponse.json({ success: true, user }, { status: 200 });
}