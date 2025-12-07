import {Day} from "@prisma/client";

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date | null
}

export type Settings = {
  id: number
  defaultShowId?: number | null
  offAirShowId?: number | null
  defaultShow?: RadioShow | null
  offAirShow?: RadioShow | null
}

export type RadioShow = {
  id: number
  title: string
  description: string | null
  hosts: string[]
  photo: string | null
  createdAt: Date
  updatedAt: Date
  // relations
  recordings?: Recording[]
  scheduleEntries?: ScheduleEntry[]
  defaultSettings?: Settings[]
  offAirSettings?: Settings[]
  ScheduleException?: ScheduleException[]
}

export type Recording = {
  id: number
  radioShowId: number
  recording: string
  title: string | null
  recordedAt: Date
  // relation
  radioShow?: RadioShow
}

export type Schedule = {
  id: number
  name: string
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
  // relation
  entries?: ScheduleEntry[]
}

export type ScheduleEntry = {
  id: number
  scheduleId: number
  radioShowId: number
  day: Day
  startTime: string // stored as text in Prisma schema
  endTime: string
  activeFrom: Date | null
  activeUntil: Date | null
  createdAt: Date
  updatedAt: Date
  // relations
  schedule?: Schedule
  radioShow?: RadioShow
  exceptions?: ScheduleException[]
}

export type Podcast = {
  id: number
  title: string
  description: string | null
  hosts: string | null
  photo: string | null
  term: string
  createdAt: Date
  updatedAt: Date
}

export type Post = {
  id: number
  title: string
  content: string
  likes: number
  createdAt: Date
  updatedAt: Date
}