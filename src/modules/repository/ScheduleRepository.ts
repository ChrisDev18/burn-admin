import prisma from "@/app/lib/prisma";
import {mapSchedule, Schedule} from "@/modules/domain/model/Schedule";
import {mapScheduleEntry, ScheduleEntry} from "@/modules/domain/model/ScheduleEntry";
import {PrismaClient} from "@prisma/client";
import { ITXClientDenyList } from "@prisma/client/runtime/library";

export type CreateScheduleResult =
    | { ok: true; schedule: Schedule }
    | { ok: false; error: "DATABASE_ERROR" };

export type UpdateScheduleResult =
    | { ok: true; schedule: Schedule }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };

export type DeleteScheduleResult =
    | { ok: true; scheduleId: number }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };

export type FindScheduleWithEntriesResult =
    | { ok: true; schedule: Schedule; entries: ScheduleEntry[] }
    | { ok: true; schedule: null; entries: null }
    | { ok: false; error: "DATABASE_ERROR" };

export class ScheduleRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList> = prisma) {}

  withTransaction(tx: Omit<PrismaClient, ITXClientDenyList>) {
    return new ScheduleRepository(tx);
  }

  async createSchedule(data: {
    name: string,
    startDate: Date,
    endDate: Date
  }): Promise<CreateScheduleResult> {
    try {
      const schedule = await this.db.schedule.create({
        data: {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
        },
      });
      return { ok: true, schedule: mapSchedule(schedule) };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }

  async updateSchedule(
      id: number,
      updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>
  ): Promise<UpdateScheduleResult> {
    try {
      const existing = await this.db.schedule.findUnique({ where: { id } });
      if (!existing) return { ok: false, error: "DOES_NOT_EXIST" };

      const updated = await this.db.schedule.update({
        where: { id },
        data: {
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.startDate !== undefined && { startDate: updates.startDate }),
          ...(updates.endDate !== undefined && { endDate: updates.endDate }),
        },
      });

      return { ok: true, schedule: mapSchedule(updated) };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }

  async deleteSchedule(id: number): Promise<DeleteScheduleResult> {
    try {
      const existing = await this.db.schedule.findUnique({ where: { id } });
      if (!existing) return { ok: false, error: "DOES_NOT_EXIST" };

      await this.db.schedule.delete({ where: { id } });
      return { ok: true, scheduleId: id };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }

  async findWithScheduleEntries(
      id: number
  ): Promise<FindScheduleWithEntriesResult> {
    try {
      const data = await prisma.schedule.findUnique({
        where: { id },
        include: { entries: true },
      });

      if (!data) {
        return { ok: true, schedule: null, entries: null };
      }

      return {
        ok: true,
        schedule: mapSchedule(data),
        entries: data.entries.map(mapScheduleEntry),
      };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }
}