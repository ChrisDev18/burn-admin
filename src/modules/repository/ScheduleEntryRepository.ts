import prisma from "@/app/lib/prisma";
import {mapScheduleEntry, ScheduleEntry} from "@/modules/domain/model/ScheduleEntry";
import {Day, PrismaClient} from "@prisma/client";
import {mapScheduleException, ScheduleException} from "@/modules/domain/model/ScheduleCancellation";
import {ITXClientDenyList} from "@prisma/client/runtime/library";

export type CreateScheduleEntryResult =
    | { ok: true; scheduleEntry: ScheduleEntry }
    | { ok: false; error: "DATABASE_ERROR" };

export type UpdateScheduleEntryResult =
    | { ok: true; scheduleEntry: ScheduleEntry }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };

export type DeleteScheduleEntryResult =
    | { ok: true; scheduleEntryId: number }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };

export type FindScheduleEntryWithExceptionsResult =
    | { ok: true; scheduleEntry: ScheduleEntry; exceptions: ScheduleException[] }
    | { ok: true; scheduleEntry: null; exceptions: null }
    | { ok: false; error: "DATABASE_ERROR" };

export class ScheduleEntryRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList> = prisma) {}

  withTransaction(tx: Omit<PrismaClient, ITXClientDenyList>) {
    return new ScheduleEntryRepository(tx);
  }

  async createScheduleEntry(data: {
    scheduleId: number;
    radioShowId: number;
    day: Day;
    startTime: string;
    endTime: string;
    activeFrom?: Date | null;
    activeUntil?: Date | null;
  }): Promise<CreateScheduleEntryResult> {
    try {
      const entry = await this.db.scheduleEntry.create({
        data: {
          scheduleId: data.scheduleId,
          radioShowId: data.radioShowId,
          day: data.day,
          startTime: data.startTime,
          endTime: data.endTime,
          activeFrom: data.activeFrom ?? null,
          activeUntil: data.activeUntil ?? null,
        },
      });
      return { ok: true, scheduleEntry: mapScheduleEntry(entry) };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }

  async updateScheduleEntry(
      id: number,
      updates: Partial<Omit<ScheduleEntry, "id" | "createdAt" | "updatedAt">>
  ): Promise<UpdateScheduleEntryResult> {
    try {
      const existing = await this.db.scheduleEntry.findUnique({ where: { id } });
      if (!existing) return { ok: false, error: "DOES_NOT_EXIST" };

      const updated = await this.db.scheduleEntry.update({
        where: { id },
        data: {
          ...(updates.scheduleId !== undefined && { scheduleId: updates.scheduleId }),
          ...(updates.radioShowId !== undefined && { radioShowId: updates.radioShowId }),
          ...(updates.day !== undefined && { day: updates.day }),
          ...(updates.startTime !== undefined && { startTime: updates.startTime }),
          ...(updates.endTime !== undefined && { endTime: updates.endTime }),
          ...(updates.activeFrom !== undefined && { activeFrom: updates.activeFrom }),
          ...(updates.activeUntil !== undefined && { activeUntil: updates.activeUntil }),
        },
      });

      return { ok: true, scheduleEntry: mapScheduleEntry(updated) };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }

  async deleteScheduleEntry(id: number): Promise<DeleteScheduleEntryResult> {
    try {
      const existing = await this.db.scheduleEntry.findUnique({ where: { id } });
      if (!existing) return { ok: false, error: "DOES_NOT_EXIST" };

      await this.db.scheduleEntry.delete({ where: { id } });
      return { ok: true, scheduleEntryId: id };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }

  async findWithScheduleExceptions(
      id: number
  ): Promise<FindScheduleEntryWithExceptionsResult> {
    try {
      const data = await prisma.scheduleEntry.findUnique({
        where: { id },
        include: { exceptions: true },
      });

      if (!data) {
        return { ok: true, scheduleEntry: null, exceptions: null };
      }

      return {
        ok: true,
        scheduleEntry: mapScheduleEntry(data),
        exceptions: data.exceptions.map(mapScheduleException),
      };
    } catch (error) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }
}