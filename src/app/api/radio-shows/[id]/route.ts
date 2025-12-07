import { NextResponse } from 'next/server'
import {deleteRadioShow, getRadioShowById, updateRadioShow} from "@/app/lib/repositories/RadioShowRepository";
import {RadioShowSchema} from "@/app/lib/types/RadioShow";


// GET /api/radio-shows/[id]
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const id_n = parseInt(id);
  if (isNaN(id_n))
    return NextResponse.json({ message: 'Invalid id parameter given' }, { status: 400 });

  const show = await getRadioShowById(id_n);

  if (!show) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(show, { status: 200 });
}

// PUT /api/radio-shows/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const id_n = parseInt(id);
  if (isNaN(id_n))
    return NextResponse.json({ message: 'Invalid id parameter given' }, { status: 400 });

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

  const response = await updateRadioShow(body, id_n);

  if (response === 404)
    return NextResponse.json({ message: "Item to be updated not found" }, { status: 404 });

  return NextResponse.json(response, { status: 200 });
}

// DELETE /api/radio-shows/[id]
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const id_n = parseInt(id);
  if (isNaN(id_n))
    return NextResponse.json({ message: 'Invalid id parameter given' }, { status: 400 });

  const status = await deleteRadioShow(id_n);

  if (status === 404)
    return NextResponse.json({ message: 'Item to be deleted not found' }, { status: 404 });

  return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
}