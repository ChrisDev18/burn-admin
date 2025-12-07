import {ScheduleCancellation as PrismaScheduleCancellation} from "@prisma/client";

export type ScheduleCancellation = {
  id: number;
  scheduleEntryId: number;
  weekDate: Date;
};

export const mapScheduleException = (ex: PrismaScheduleCancellation): ScheduleCancellation => ({
  id: ex.id,
  scheduleEntryId: ex.scheduleEntryId,
  weekDate: ex.weekDate,
});