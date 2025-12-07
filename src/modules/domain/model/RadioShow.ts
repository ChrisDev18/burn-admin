import {Settings} from "@/app/data/models";
import {RadioShow as PrismaRadioShow} from "@prisma/client";
import {Recording} from "@/modules/domain/model/Recording";
import {ScheduleEntry} from "@/modules/domain/model/ScheduleEntry";

export type RadioShow = {
  id: number
  title: string
  description: string | null
  hosts: string[]
  photo: string | null
  createdAt: Date
  updatedAt: Date
}

export type RadioShowRelations = {
  recordings?: Recording[]
  scheduleEntries?: ScheduleEntry[]
  defaultSettings?: Settings[]
  offAirSettings?: Settings[]
}

export const mapRadioShow = (r: PrismaRadioShow): RadioShow => ({
  id: r.id,
  title: r.title,
  description: r.description,
  hosts: r.hosts ? r.hosts.split(",").map(h => h.trim()) : [],
  photo: r.photo,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt
});