import {CalendarEvent} from "@/app/lib/calendar/models";
import {dayToJs} from "@/app/lib/calendar/utils";
import {Day} from "@prisma/client";


// Map an event model to RBC UI data
export function toCalendarEvents(event: ScheduleEntry, shows: { id: number, title: string }[], start_date: Date, end_date: Date): CalendarEvent[] {
  // determine number of occurrences of day in period
  const dates = getMatchingWeekdays(dayToJs[event.day], start_date, end_date);
  return dates.map(date => {
    start_date = date
    start_date.setMinutes(event.startTime.minutes)
    start_date.setHours(event.startTime.hours)

    end_date = date
    end_date.setMinutes(event.endTime.minutes)
    end_date.setHours(event.endTime.hours)

    return {
      title: shows.find(val => val.id === event.radioShowId)?.title || "N/A",
      start: start_date,
      end: end_date,
      entryKey: event.key
    }
  });
}

/**
 * Returns all dates between startDate and endDate (inclusive)
 * that fall on the given weekday: 0 = Sunday ... 6 = Saturday
 */
export function getMatchingWeekdays(
    day: number,
    startDate: Date,
    endDate: Date
): Date[] {
  if (day < 0 || day > 6) throw new Error("Day must be between 0 (Sunday) and 6 (Saturday)");

  const results: Date[] = [];

  // Clone dates to avoid mutating user inputs
  let current = new Date(startDate);

  // Move "current" forward to the first matching weekday
  while (current.getDay() !== day) {
    current.setDate(current.getDate() + 1);
  }

  // Collect all matching weekdays up to endDate (inclusive)
  while (current <= endDate) {
    results.push(new Date(current)); // push a copy
    current.setDate(current.getDate() + 7); // jump to next week
  }

  return results;
}

export type ScheduleEntry = {
  id: number | null;
  key: number,
  scheduleId: number | null;
  radioShowId: number;
  day: Day;
  startTime: Time;
  endTime: Time;
};

export type InitialScheduleEntry = Omit<ScheduleEntry, "radioShowId"> & {radioShowId: number | undefined}

export type Time = {
  minutes: number,
  hours: number
}

const pad2 = (n: number) => String(n).padStart(2, "0");
export function formatTime(t: { hours: number; minutes: number }) {
  return `${pad2(t.hours)}:${pad2(t.minutes)}`;
}
export const toTime = (time: string): Time => {
  const [hours, minutes] = time.split(":");
  return {hours: parseInt(hours), minutes: parseInt(minutes)};
}
