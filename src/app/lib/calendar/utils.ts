import {Day} from "@prisma/client";

export const dayToJs: Record<Day, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export const jsToDay: Day[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function applyTime(base: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function toTimeString(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
}