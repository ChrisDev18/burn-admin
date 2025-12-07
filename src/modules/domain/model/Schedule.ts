import {ScheduleEntry} from "@/modules/domain/model/ScheduleEntry";
import { Schedule as PrismaSchedule } from "@prisma/client";

export type Schedule = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ScheduleWithEntries = Schedule & { entries: ScheduleEntry[] };

export type ScheduleRelations = {
  entries?: ScheduleEntry[];
};

export const mapSchedule = (s: PrismaSchedule): Schedule => ({
  id: s.id,
  name: s.name,
  startDate: s.startDate,
  endDate: s.endDate,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt
});