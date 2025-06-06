import {NewUserSchema} from "@/app/lib/types/auth";
import {hash} from "@uswriting/bcrypt";
import prisma from "@/app/lib/prisma";
import { Prisma } from '@prisma/client'

import {NextRequest, NextResponse} from "next/server";
import {parseAndValidate} from "@/app/lib/parseRequest";

// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const result = await parseAndValidate(req, NewUserSchema);

    if (! result.success) return result.response;

    const { firstName, lastName, email, password } = result.data;

    // Hash password before storing it
    const hashedPassword = hash(password, 10);

    // Try to create user
    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      return NextResponse.json(user, { status: 201 });

    } catch (prismaErr) {
      if (prismaErr instanceof Prisma.PrismaClientKnownRequestError) {
        if (prismaErr.code === "P2002") {
          // Unique constraint failed (e.g. duplicate email)
          return NextResponse.json({ message: "Email already in use." }, { status: 409 });
        }
      }

      // Generic fallback (safe, no internals)
      console.error("Database error:", prismaErr); // Only log internally
      return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }

  } catch (err) {
    console.error("Unexpected error during signup: ", err);
    return NextResponse.json(
        { message: 'An unexpected error occurred, try again later' },
        { status: 500 }
    );
  }
}
