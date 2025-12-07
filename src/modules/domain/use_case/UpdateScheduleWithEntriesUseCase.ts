import { Schedule } from "@/modules/domain/model/Schedule";
import { ScheduleEntry } from "@/modules/domain/model/ScheduleEntry";
import { Day } from "@prisma/client";
import {ScheduleRepository} from "@/modules/repository/ScheduleRepository";
import {ScheduleEntryRepository} from "@/modules/repository/ScheduleEntryRepository";
import prisma from "@/app/lib/prisma";

export type UpdateScheduleWithEntriesResult =
    | { ok: true; schedule: Schedule; entries: ScheduleEntry[] }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };

export class UpdateScheduleWithEntriesUseCase {
  constructor(
      private readonly scheduleRepo = new ScheduleRepository(),
      private readonly entryRepo = new ScheduleEntryRepository()
  ) {}

  async execute(input: {
    scheduleId: number;
    updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>;
    entries: ({
      id: number; // existing entry
      updates: Partial<Omit<ScheduleEntry, "id" | "createdAt" | "updatedAt">>;
    } | {
      radioShowId: number;
      day: Day;
      startTime: string;
      endTime: string;
      activeFrom?: Date | null;
      activeUntil?: Date | null;
    })[];
  }): Promise<UpdateScheduleWithEntriesResult> {
    try {
      return prisma.$transaction(async (tx) => {
        const scheduleRepoTx = this.scheduleRepo.withTransaction(tx);
        const entryRepoTx = this.entryRepo.withTransaction(tx);
        // 1. Update schedule
        const scheduleResult = await scheduleRepoTx.updateSchedule(
            input.scheduleId,
            input.updates
        );
        if (!scheduleResult.ok) {
          return {ok: false, error: scheduleResult.error};
        }

        // 2. Fetch current entries in DB
        const existingResult = await scheduleRepoTx.findWithScheduleEntries(
            input.scheduleId
        );
        if (!existingResult.ok || !existingResult.schedule) {
          throw Error("DOES_NOT_EXIST");
        }
        const existingEntries = existingResult.entries ?? [];

        // 3. Handle updates & creations and keep track updated/created entries
        const updatedEntries: ScheduleEntry[] = [];
        for (const entry of input.entries) {
          if ("id" in entry) {
            // Update existing entry
            const entryResult = await entryRepoTx.updateScheduleEntry(
                entry.id,
                entry.updates
            );
            if (!entryResult.ok) throw Error("DATABASE_ERROR");
            updatedEntries.push(entryResult.scheduleEntry);
          } else {
            // create new entry
            const entryResult = await entryRepoTx.createScheduleEntry({
              scheduleId: input.scheduleId,
              radioShowId: entry.radioShowId,
              day: entry.day,
              startTime: entry.startTime,
              endTime: entry.endTime,
              activeFrom: entry.activeFrom ?? null,
              activeUntil: entry.activeUntil ?? null,
            });
            if (!entryResult.ok) throw Error("DATABASE_ERROR");
            updatedEntries.push(entryResult.scheduleEntry);
          }
        }


        // 4. Delete entries not included in input
        const inputIds = input.entries
            .filter(e => "id" in e)
            .map((e) => e.id);

        // Determine which entries in the DB were not included in the given ids
        const toDelete = existingEntries.filter(
            (existing) => !inputIds.includes(existing.id)
        );

        // Delete these entries
        for (const entry of toDelete) {
          const deleteResult = await entryRepoTx.deleteScheduleEntry(entry.id);
          if (!deleteResult.ok) return {ok: false, error: deleteResult.error};
        }

        return {
          ok: true,
          schedule: scheduleResult.schedule,
          entries: updatedEntries,
        };
      });
    } catch (err) {
      // transaction is auto-rolled back
      if (err instanceof Error && err.message === "DOES_NOT_EXIST") {
        return { ok: false, error: "DOES_NOT_EXIST" };
      }
      return { ok: false, error: "DATABASE_ERROR" };
    }
  }
}