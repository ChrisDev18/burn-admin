import {Day, ScheduleEntry as PrismaScheduleEntry} from "@prisma/client";
import {ScheduleCancellation} from "@/modules/domain/model/ScheduleCancellation";

export type ScheduleEntry = {
  id: number;
  scheduleId: number;
  radioShowId: number;
  day: Day;
  startTime: string;
  endTime: string;
  activeFrom: Date | null;
  activeUntil: Date | null;
  overriding: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ScheduleEntryRelations = {
  cancellations?: ScheduleCancellation[];
};

export const mapScheduleEntry = (e: PrismaScheduleEntry): ScheduleEntry => ({
  id: e.id,
  scheduleId: e.scheduleId,
  radioShowId: e.radioShowId,
  day: e.day,
  startTime: e.startTime,
  endTime: e.endTime,
  activeFrom: e.activeFrom,
  activeUntil: e.activeUntil,
  overriding: e.overriding,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt
});