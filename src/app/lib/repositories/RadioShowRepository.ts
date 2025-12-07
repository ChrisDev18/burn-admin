import prisma from "@/app/lib/prisma";
import {FrontendNewRadioShow, FrontendRadioShow} from "@/app/lib/types/RadioShow";
import {saveImage} from "@/app/lib/imageTools";
import { del } from "@vercel/blob";
import {RadioShow} from "@/modules/domain/model/RadioShow";
import {Prisma} from "@prisma/client";


export async function createRadioShowWithoutPhoto(radioShow: FrontendNewRadioShow): Promise<FrontendRadioShow> {
  const newShow = await prisma.radioShow.create({
    data: {
      title: radioShow.title,
      description: radioShow.description,
      hosts: radioShow.hosts.join(","),
    },
  });

  const hosts = newShow.hosts?.split(",") || [];

  return {
    ...newShow,
    hosts,
  };
}

export async function createRadioShow(radioShow: Prisma.RadioShowCreateInput) {
  const newShow = await prisma.radioShow.create({
    data: {
      title: radioShow.title,
      description: radioShow.description,
      hosts: radioShow.hosts,
      photo: radioShow.photo ?? null
    },
  });
}

export async function getAllRadioShows(): Promise<RadioShow[]> {
  const shows = await prisma.radioShow.findMany();

  return shows.map(show => {
    const hosts = show.hosts?.split(",") || [];

    return {
      ...show,
      hosts,
    };
  });
}

export async function getRadioShowById(id: number): Promise<FrontendRadioShow | null> {
  const show = await prisma.radioShow.findUnique({
    where: { id },
  });

  if (!show) return null;

  const hosts = show.hosts?.split(",") || [];

  return {
    ...show,
    hosts,
  };
}

export async function updateRadioShow(newRadioShow: FrontendRadioShow, id: number): Promise<FrontendRadioShow | null> {
  // Check if the Recording exists
  const radioShow = await prisma.radioShow.findUnique({
    where: { id }
  });

  if (!radioShow) {
    // If it doesn't exist, return error code
    return null;
  }

  // Proceed with update
  const { title, description, hosts, photo } = newRadioShow;
  const updatedShow = await prisma.radioShow.update({
    where: {id: id},
    data: {
      title,
      description,
      hosts: hosts.join(","),
      photo },
  });

  const updatedHosts = updatedShow.hosts?.split(",") || [];

  return {
    ...updatedShow,
    hosts: updatedHosts,
  };
}

export async function deleteRadioShow(id: number) {
  // Check if the Recording exists
  const radioShow = await prisma.radioShow.findUnique({
    where: { id }
  });

  if (!radioShow) {
    // If it doesn't exist, return error code
    return 404;
  }

  // Proceed with deletion
  await prisma.radioShow.delete({
    where: { id }
  });

  return 200;
}

export async function createRadioShowWithPhoto(
    values: FrontendNewRadioShow,
    photoBuffer?: Buffer
): Promise<FrontendRadioShow> {
  return prisma.$transaction(async (tx) => {
    // Step 1: Insert new radio show without photo
    const created = await tx.radioShow.create({
      data: {
        title: values.title,
        description: values.description,
        hosts: values.hosts.length ? values.hosts.join(",") : null,
      },
    });

    let photoPath: string | undefined;

    // Step 2: Upload photo and update record if photo is provided
    if (photoBuffer) {
      const safeTimestamp = created.createdAt.toISOString();
      photoPath = await saveImage(
          `radio_show_photos/${created.id}-${safeTimestamp}.webp`,
          photoBuffer
      );

      await tx.radioShow.update({
        where: { id: created.id },
        data: { photo: photoPath },
      });
    }

    return {
      ...created,
      hosts: values.hosts,
      photo: photoPath ?? null,
    };
  });
}

export async function updateRadioShowWithPhoto(
    id: number,
    values: FrontendNewRadioShow,
    doDeletePhoto: boolean,
    photoBuffer?: Buffer | null
): Promise<FrontendRadioShow | null> {
  return prisma.$transaction(async (tx) => {
    // Step 1: Check if show exists
    const existing = await tx.radioShow.findUnique({ where: { id } });
    if (!existing) return null;

    let photoPath: string | null | undefined = existing.photo;

    // Step 2: If user uploaded a new photo, process + replace
    if (photoBuffer) {
      const safeTimestamp = new Date().toISOString();
      photoPath = await saveImage(
          `radio_show_photos/${id}-${safeTimestamp}.webp`,
          photoBuffer
      );

      // Optional: delete old photo if it exists
      if (existing.photo) {
        try {
          await del(existing.photo);
        } catch (err) {
          console.error("Failed to delete old photo:", err);
        }
      }
    }

    // Step 3: If user explicitly removed the photo, delete it from storage
    if (doDeletePhoto) {
      if (existing.photo) {
        try {
          await del(existing.photo);
        } catch (err) {
          console.error("Failed to delete removed photo:", err);
        }
      }
      photoPath = null;
    }

    // Step 4: Update the show
    const updated = await tx.radioShow.update({
      where: { id },
      data: {
        title: values.title,
        description: values.description,
        hosts: values.hosts.length ? values.hosts.join(",") : null,
        photo: photoPath,
      },
    });

    return {
      ...updated,
      hosts: values.hosts,
      photo: updated.photo,
    };
  });
}