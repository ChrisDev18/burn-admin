import { Schedule } from "@/modules/domain/model/Schedule";
import { ScheduleEntry } from "@/modules/domain/model/ScheduleEntry";
import { Day } from "@prisma/client";
import {ScheduleRepository} from "@/modules/repository/ScheduleRepository";
import {ScheduleEntryRepository} from "@/modules/repository/ScheduleEntryRepository";
import prisma from "@/app/lib/prisma";

export type CreateScheduleWithEntriesResult =
    | { ok: true; schedule: Schedule; entries: ScheduleEntry[] }
    | { ok: false; error: "DATABASE_ERROR" };

export class CreateScheduleWithEntriesUseCase {
  constructor(
      private readonly scheduleRepo = new ScheduleRepository(),
      private readonly entryRepo = new ScheduleEntryRepository()
  ) {}

  async execute(input: {
    name: string;
    startDate: Date;
    endDate: Date;
    entries: {
      radioShowId: number;
      day: Day;
      startTime: string;
      endTime: string;
      activeFrom?: Date | null;
      activeUntil?: Date | null;
    }[];
  }): Promise<CreateScheduleWithEntriesResult> {
    try {
      return prisma.$transaction(async (tx) => {
        const scheduleRepoTx = this.scheduleRepo.withTransaction(tx);
        const entryRepoTx = this.entryRepo.withTransaction(tx);
        try {
          const scheduleResult = await scheduleRepoTx.createSchedule({
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
          });

          if (!scheduleResult.ok) return { ok: false, error: "DATABASE_ERROR" };

          const createdEntries: ScheduleEntry[] = [];
          for (const entry of input.entries) {
            const entryResult = await entryRepoTx.createScheduleEntry({
              scheduleId: scheduleResult.schedule.id,
              radioShowId: entry.radioShowId,
              day: entry.day,
              startTime: entry.startTime,
              endTime: entry.endTime,
              activeFrom: entry.activeFrom ?? null,
              activeUntil: entry.activeUntil ?? null,
            });
            if (!entryResult.ok) throw Error("DATABASE_ERROR");
            createdEntries.push(entryResult.scheduleEntry);
          }

          return {
            ok: true,
            schedule: scheduleResult.schedule,
            entries: createdEntries,
          };
        } catch {
         throw Error("DATABASE_ERROR");
        }
      })
    } catch (err) {
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }
}