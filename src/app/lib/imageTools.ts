"use server"

import { put } from "@vercel/blob";
import sharp from "sharp";

type ImageProcessResult = {
  success: true,
  buffer: Buffer<ArrayBufferLike>
} | {
  success: false,
  error: string
}

export async function processImage(img: File): Promise<ImageProcessResult> {
  if (img.size > 5 * 1024 * 1024) {
    return {success: false, error: 'Image too large (must be smaller than 5MB)'};
  }

  const arrayBuffer = await img.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const image = sharp(buffer);
  const metadata = await image.metadata();

  // 1. Check if it's square
  if (metadata.width !== metadata.height) {
    return { success: false, error: 'Image must be square' };
  }

  // 2. Determine if resize is needed (if > 1200x1200)
  const resizeNeeded = metadata.width! > 1200;

  // 3. Convert to WebP if necessary
  const processedBuffer = await image
      .resize(
          resizeNeeded ? 1200 : undefined,
          resizeNeeded ? 1200 : undefined,
          {
        fit: 'cover',
      })
      .webp({ quality: 80 }) // You can tune quality
      .toBuffer();

  return { success: true, buffer: processedBuffer }; ;
}

export async function saveImage(path: string, image: Buffer) {
  const { url } = await put(path, image, { access: 'public' });
  return url;
}