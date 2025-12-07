import prisma from "@/app/lib/prisma";
import {mapRadioShow, RadioShow, RadioShowRelations} from "@/modules/domain/model/RadioShow";
import {mapRecording} from "@/modules/domain/model/Recording";
import {mapScheduleEntry} from "@/modules/domain/model/ScheduleEntry";
import {PrismaClient} from "@prisma/client";
import {ITXClientDenyList} from "@prisma/client/runtime/library";

export type CreateRadioShowResult =
    | { ok: true; radioShow: RadioShow }
    | { ok: false; error: "DATABASE_ERROR" };

export type UpdateRadioShowResult =
    | { ok: true; radioShow: RadioShow }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };

export type DeleteRadioShowResult =
    | { ok: true; radioShowId: number }
    | { ok: false; error: "DOES_NOT_EXIST" | "DATABASE_ERROR" };

export type FindRadioShowResult =
    | { ok: true; radioShow: RadioShow, relations: Omit<RadioShowRelations, "offAirSettings" | "defaultSettings"> }
    | { ok: true; radioShow: null, relations: null }
    | { ok: false; error: "DATABASE_ERROR" };


export class RadioShowRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList> = prisma) {}

  withTransaction(tx: Omit<PrismaClient, ITXClientDenyList>) {
    return new RadioShowRepository(tx);
  }

  async createRadioShow(
      data: {
        title: string,
        description: string | null,
        hosts: string[],
        photo: string | null,
      }
  ): Promise<CreateRadioShowResult> {

    try {
      const radioShow = await this.db.radioShow.create({
        data: {
          title: data.title,
          description: data.description,
          hosts: data.hosts.join(",") ?? null,
          photo: data.photo,
        },
      });

      return {
        ok: true,
        radioShow: {
          id: radioShow.id,
          title: radioShow.title,
          description: radioShow.description,
          hosts: radioShow.hosts ? radioShow.hosts.split(",") : [],
          photo: radioShow.photo,
          createdAt: radioShow.createdAt,
          updatedAt: radioShow.updatedAt
        }
      };

    } catch {
      return {
        ok: false,
        error: "DATABASE_ERROR",
      };
    }
  }

  async updateRadioShow(
      id: number,
      updates: {
        title?: string;
        description?: string | null;
        hosts?: string[];
        photo?: string | null;
      }
  ): Promise<UpdateRadioShowResult> {
    try {
      // Check if the radio show exists
      const radioShow = await this.db.radioShow.findUnique({
        where: { id },
      });

      if (!radioShow) {
        return {
          ok: false,
          error: "DOES_NOT_EXIST",
        };
      }

      // Perform the update
      const updated = await this.db.radioShow.update({
        where: { id },
        data: {
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.hosts !== undefined && { hosts: updates.hosts.join(",") }),
          ...(updates.photo !== undefined && { photo: updates.photo }),
        },
      });

      return {
        ok: true,
        radioShow: {
          id: updated.id,
          title: updated.title,
          description: updated.description,
          hosts: updated.hosts ? updated.hosts.split(",") : [],
          photo: updated.photo,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        },
      };
    } catch {
      return {
        ok: false,
        error: "DATABASE_ERROR",
      };
    }
  }

  async deleteRadioShow(
      id: number
  ): Promise<DeleteRadioShowResult> {

    try {
      const radioShow = await this.db.radioShow.findUnique({
        where: { id }
      });

      if (!radioShow) {
        return {
          ok: false,
          error: "DOES_NOT_EXIST",
        };
      }

      await this.db.radioShow.delete({ where: {id} });

      return {
        ok: true,
        radioShowId: radioShow.id
      };

    } catch {
      return {
        ok: false,
        error: "DATABASE_ERROR",
      };
    }
  }

  async findWithRelations(id: number): Promise<FindRadioShowResult> {
    try {
      const data = await prisma.radioShow.findUnique({
        where: { id },
        include: {
          recordings: true,
          scheduleEntries: true,
        }
      });
      if (!data)
        return {
          ok: true,
          radioShow: null,
          relations: null
        }

      return {
        ok: true,
        radioShow: mapRadioShow(data),
        relations: {
          recordings: data.recordings?.map(mapRecording),
          scheduleEntries: data.scheduleEntries?.map(mapScheduleEntry),
        }
      };
    } catch {
      return {
        ok: false,
        error: "DATABASE_ERROR"
      }
    }
  }

}