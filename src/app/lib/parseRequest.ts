import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export type ValidationErrors = Record<string, string[] | undefined>;

export async function parseAndValidate<T>(
    req: NextRequest,
    schema: ZodSchema<T>
): Promise<
    | { success: true; data: T }
    | { success: false; response: NextResponse<{success: false; message: string} | {success: false; errors: ValidationErrors }> }
> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json(
          { success: false, message: 'Invalid or malformed JSON body.' },
          { status: 400 }
      ),
    };
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const errors: ValidationErrors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      response: NextResponse.json(
          { success: false, errors: errors },
          { status: 400 }
      ),
    };
  }

  return { success: true, data: parsed.data };
}