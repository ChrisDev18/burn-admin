'use server';

import {
  CreateRadioShowResponse,
  ImportRadioShowResponse,
  RadioShowSchema,
  UpdateRadioShowResponse
} from "@/app/lib/types/RadioShow";
import { processImage } from "@/app/lib/imageTools";
import {
  createRadioShow,
  createRadioShowWithPhoto,
  deleteRadioShow,
  updateRadioShowWithPhoto
} from "@/app/lib/repositories/RadioShowRepository";
import {ValidationErrors} from "@/app/lib/parseRequest";
import {RadioShowsFileSchema} from "@/app/lib/types/importing";

export async function importRadioShowsAction(
    formData: FormData
): Promise<ImportRadioShowResponse> {
  const file = formData.get("file");

  console.log(file)

  // -------------------------------
  // Validate presence of file
  // -------------------------------
  if (!file || !(file instanceof File)) {
    return {
      success: false,
      message: "No file was uploaded.",
    };
  }

  // -------------------------------
  // Validate file is JSON by extension or MIME
  // -------------------------------
  const fileName = file.name.toLowerCase();
  const validExtension = fileName.endsWith(".json");
  const validMime =
      file.type === "application/json" || file.type === "text/json";

  if (!validExtension && !validMime) {
    return {
      success: false,
      message: "Invalid file type. Please upload a .json file.",
    };
  }

  // -------------------------------
  // Read + parse file
  // -------------------------------
  let data: unknown;

  try {
    const rawText = await file.text();
    data = JSON.parse(rawText);
  } catch (err) {
    return {
      success: false,
      message: "The JSON file could not be parsed. Ensure it is valid JSON.",
    };
  }

  // -------------------------------
  // Validate against schema
  // -------------------------------
  const parsed = RadioShowsFileSchema.safeParse(data);

  if (!parsed.success) {
    const errors: ValidationErrors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      errors,
    };
  }

  // -------------------------------
  // Insert into database
  // -------------------------------
  try {
    for (const radioShow of parsed.data) {
      await createRadioShow(radioShow);
    }
  } catch (err: unknown) {
    console.error("Error inserting radio shows:", err);

    return {
      success: false,
      message: "An error occurred while saving the radio shows.",
    };
  }

  // -------------------------------
  // Success!
  // -------------------------------
  return { success: true, message: "Shows Imported Successfully" };
}

export async function deleteRadioShowAction(showId: number): Promise<{ success: boolean; message?: string }> {
  try {
    await deleteRadioShow(showId);
    return {
      success: true,
      message: `Radio Show with id=${showId} deleted successfully`,
    };
  } catch (error) {
    console.error("Failed to delete radio show:", error);
    return {
      success: false,
      message: "Could not delete radio show. Please try again.",
    };
  }
}

export async function updateRadioShowAction(formData: FormData, showId: number): Promise<UpdateRadioShowResponse> {
  const photo = formData.get("photo");
  let doDeletePhoto = false;

  console.log("photo", photo);

  if (photo !== null && photo !== "" && !(photo instanceof File)) {
    return {
      success: false,
      errors: {
        photo: ["Invalid file upload"],
      },
    };
  }

  if (photo === "") {
    doDeletePhoto = true;
  }

  let hosts: FormDataEntryValue | string[] | null = formData.get("hosts");

  if (typeof hosts === "string") {
    hosts = JSON.parse(hosts);
  }

  const parsed = RadioShowSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    hosts: hosts,
    photo: photo ?? undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation error",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const values = parsed.data;

  let photoBuffer: Buffer | undefined;
  if (photo) {
    const processed = await processImage(photo);
    if (!processed.success) {
      return { success: false, errors: { photo: [processed.error] } };
    }
    photoBuffer = processed.buffer;
  }

  try {
    const updatedShow = await updateRadioShowWithPhoto(showId, values, doDeletePhoto, photoBuffer);
    if (updatedShow === null) {
      console.error("Failed to update radio show:", `Show with id=${showId} does not exist`);
      return {
        success: false,
        message: "Could not update radio show. Please try again.",
      };
    }
    return {
      success: true,
      message: `Radio Show updated successfully with id=${updatedShow.id}`,
      radioShow: updatedShow,
    };
  } catch (error) {
    console.error("Failed to update radio show:", error);
    return {
      success: false,
      message: "Could not update radio show. Please try again.",
    };
  }
}

export async function createRadioShowAction(formData: FormData): Promise<CreateRadioShowResponse> {
  const photo = formData.get('photo');
  if (photo !== null && !(photo instanceof File)) {
    return {
      success: false,
      errors: {
        photo: ['Invalid file upload']
      }
    };
  }

  let hosts: FormDataEntryValue | string[] | null = formData.get('hosts');

  if (typeof hosts === "string") {
    hosts = JSON.parse(hosts);
  }

  const parsed = RadioShowSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') ?? undefined,
    hosts: hosts,
    photo: photo ?? undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation error',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const values = parsed.data;

  let photoBuffer: Buffer | undefined;
  if (photo) {
    console.log("Processing Image");
    const processed = await processImage(photo);
    console.log(processed);
    if (!processed.success) {
      return { success: false, errors: { photo: [processed.error] } };
    }
    photoBuffer = processed.buffer;
  }

  try {
    const createdShow = await createRadioShowWithPhoto(values, photoBuffer);

    return {
      success: true,
      message: `Radio Show created successfully with id=${createdShow.id}`,
      radioShow: createdShow,
    };
  } catch (error) {
    console.error("Failed to create radio show:", error);
    return {
      success: false,
      message: 'Could not create radio show. Please try again.',
    };
  }
}