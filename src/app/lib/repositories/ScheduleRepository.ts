import prisma from "@/app/lib/prisma";
import {Schedule, ScheduleWithEntries} from "@/modules/domain/model/Schedule"; // Vercel Blob delete API

export async function getAllSchedules(): Promise<Schedule[]> {
  return prisma.schedule.findMany();
}

export async function getScheduleById(id: number): Promise<Schedule | null> {
  return prisma.schedule.findUnique({ where: { id } });
}

export async function getScheduleByIdWithEntries(id: number): Promise<ScheduleWithEntries | null> {
  return prisma.schedule.findUnique({
    where: { id },
    include: {
      entries: true,
    }
  });
}