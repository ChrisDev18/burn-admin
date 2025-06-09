import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import {FrontendRadioShow} from "@/app/lib/types/RadioShow";

export async function createRadioShow(radioShow: Prisma.RadioShowCreateInput) {
  return prisma.radioShow.create({
    data: {
      title: radioShow.title,
      description: radioShow.description,
      hosts: radioShow.hosts,
      photo: radioShow.photo,
    },
  });
}

export async function getAllRadioShows(): Promise<FrontendRadioShow[]> {
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

export async function updateRadioShow(newRadioShow: Prisma.RadioShowUpdateInput, id: number) {
  // Check if the RadioShow exists
  const radioShow = await prisma.radioShow.findUnique({
    where: { id }
  });

  if (!radioShow) {
    // If it doesn't exist, return error code
    return 404;
  }

  // Proceed with update
  const { title, description, hosts, photo } = newRadioShow;
  return prisma.radioShow.update({
    where: {id: id},
    data: { title, description, hosts, photo },
  });
}

export async function deleteRadioShow(id: number) {
  // Check if the RadioShow exists
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