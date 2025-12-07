import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import {createRadioShowWithoutPhoto} from "@/app/lib/repositories/RadioShowRepository";
import {RadioShowSchema} from "@/app/lib/types/RadioShow";

// GET /api/radio-shows
export async function GET() {
  const shows = await prisma.radioShow.findMany();
  return NextResponse.json(shows, { status: 200 });
}

// POST /api/radio-shows
export async function POST(request: Request) {
  let body;
  try {
    // Try to parse the JSON body
    body = await request.json();
  } catch {
    // If an error occurs during parsing, it means the body is either missing or invalid
    return NextResponse.json({ message: 'No valid JSON body provided' }, { status: 400 });
  }
  if (! RadioShowSchema.safeParse(body).success)
    return NextResponse.json({ message: "Incorrect request body format" }, { status: 400 });
  const show = await createRadioShowWithoutPhoto(body);
  return NextResponse.json(show, { status: 201 });
}