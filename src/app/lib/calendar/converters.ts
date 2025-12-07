import {RadioShow, Schedule, ScheduleEntry} from "@/app/data/models";
import {CalendarEvent} from "@/app/lib/calendar/models";
import {applyTime, dayToJs} from "@/app/lib/calendar/utils";
import {addDays, startOfWeek, format, parse} from "date-fns";

// Date -> string (YYYY-MM-DD)
function dateToInputString(date: Date | null): string {
  return date ? format(date, "yyyy-MM-dd") : "";
}

// string -> Date
function inputStringToDate(value: string, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = parse(value, "yyyy-MM-dd", new Date());
  return isNaN(parsed.getTime()) ? fallback : parsed;
}

// Date -> string (HH:mm)
function timeToInputString(date: Date | null): string {
  return date ? format(date, "HH:mm") : "09:00";
}

// string -> Date
function inputStringToTime(value: string, fallback: Date): Date {
  const parsed = parse(value, "HH:mm", fallback);
  return isNaN(parsed.getTime()) ? fallback : parsed;
}

export function scheduleEntryToEvent(
    entry: ScheduleEntry,
    show: RadioShow,
    schedule: Schedule
): CalendarEvent {

  // anchor to first week of the schedule
  const firstWeekStart = startOfWeek(schedule.startDate, { weekStartsOn: 0 });
  const eventDate: Date = addDays(firstWeekStart, dayToJs[entry.day]);

  const start = applyTime(eventDate, entry.startTime);
  const end = applyTime(eventDate, entry.endTime);

  return {
    id: `entry-${entry.id}`,
    title: show.title,
    start,
    end,
    resource: { type: "entry", entryId: entry.id, scheduleId: schedule.id },
  };
}