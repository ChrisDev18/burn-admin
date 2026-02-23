"use client"

import { useMemo, useEffect, useReducer } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CalendarEvent } from "@/app/lib/calendar/models";
import { jsToDay } from "@/app/lib/calendar/utils";
import { Flex, Slider, Text, TextField } from "@radix-ui/themes";
import "@/app/(frontend)/styling/calendarStyles.css";
import { calendarReducer } from "@/app/(frontend)/components/CalendarEditor/CalendarReducer";
import {EntryDialog} from "@/app/(frontend)/components/CalendarEditor/ScheduleEntryEditDialog";
import {ScheduleEntry, Time, toCalendarEvents} from "@/app/(frontend)/components/CalendarEditor/utils";
import {Day} from "@prisma/client";

// Localizer for dates
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DnDCalendar = withDragAndDrop(Calendar);

type Props = {
  scheduleId: number | null
  entries: ScheduleEntry[];
  setEntries: (entries: ScheduleEntry[]) => void;
  shows: { id: number; title: string }[];
  scheduleStart: Date;
  scheduleEnd: Date;
};

export default function ScheduleCalendar({ scheduleId, entries, setEntries, shows, scheduleStart, scheduleEnd }: Props) {
  const [state, dispatch] = useReducer(calendarReducer, {
    isDialogOpen: false,
    mode: "create",
    selectedEvent: null,
    selectedRange: null,
    timeSlotHeight: 30,
    minHour: 0,
    maxHour: 23,
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--time-slot-min-height', `${state.timeSlotHeight}px`);
  }, [state.timeSlotHeight]);

  // Map model data to RBC UI data
  const events: CalendarEvent[] = useMemo(() => {
    return entries.flatMap(entry => toCalendarEvents(entry, shows, scheduleStart, scheduleEnd))
  }, [entries, shows]);

  const hiddenEvents = useMemo(() => {
    return events.filter(ev => ev.start.getHours() < state.minHour || ev.end.getHours() > state.maxHour);
  }, [events, state.minHour, state.maxHour]);

  function hourToTimeString(hour: number) { return `${String(hour).padStart(2, "0")}:00`; }
  function timeStringToHour(value: string) { return parseInt(value.split(":")[0], 10); }

  function handleSelectEvent(event: any) {
    console.log(event)
    // recover schedule event from calendar event
    const recoveredEvent = entries.find(entry => entry.key === event.key);

    if (!recoveredEvent) {
      console.error("Could not recover the abstract event from the calendar entry");
      return;
    }

    dispatch({ type: "OPEN_EDIT", event: recoveredEvent});
  }

  function handleSelectSlot(slotInfo: { start: Date; end: Date }) {
    dispatch({
      type: "OPEN_CREATE",
      initialEvent: {
        id: null,
        key: Math.max(...entries.map(entry => entry.key)),
        scheduleId: scheduleId,
        radioShowId: undefined,
        day: jsToDay[slotInfo.start.getDay()],
        startTime: {minutes: slotInfo.start.getMinutes(), hours: slotInfo.start.getHours()},
        endTime: {minutes: slotInfo.end.getMinutes(), hours: slotInfo.end.getHours()}
      },
      range: { start: slotInfo.start, end: slotInfo.end }
    });
  }

  function handleEventDrop({ event, start, end }: { event: CalendarEvent, start: Date; end: Date }) {
    const key = event.entryKey;
    setEntries(
        entries.map(entry =>
            entry.key === key ? {
              ...entry,
              day: jsToDay[start.getDay()],
              startTime: {minutes: start.getMinutes(), hours: start.getHours()},
              endTime: {minutes: end.getMinutes(), hours: end.getHours()}
            } : entry
        )
    );
  }

  function handleEventResize({ event, start, end }: { event: CalendarEvent, start: Date; end: Date }) {
    handleEventDrop({ event, start, end });
  }

  function handleSave(formData: {
    radioShowId: number
    day: Day
    startTime: Time
    endTime: Time
  }) {
    // If editing an existing entry, update entry in state with new details
    if (state.mode === "edit" && state.selectedEvent) {
      const entryId = state.selectedEvent.id;
      setEntries(entries.map(entry =>
          entry.id === entryId ? { ...entry, ...formData } : entry
      ));
    }

    // If creating a new entry, update entry in state with new details
    if (state.mode === "create" && state.selectedRange) {
      const newEntry: ScheduleEntry = {
        id: null,
        key: Math.max(...entries.map(entry => entry.key)),
        scheduleId: scheduleId,
        radioShowId: formData.radioShowId,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };
      setEntries([...entries, newEntry]);
    }

    dispatch({ type: "CLOSE_DIALOG" });
  }

  return (
      <Flex direction="column">
        {/* Calendar Controls */}
        <Flex justify="between">
          <Flex gap="2">
            <Flex gap="2" align="center">
              <Text>View from:</Text>
              <TextField.Root
                  type="time"
                  step={3600}
                  value={hourToTimeString(state.minHour)}
                  onChange={e => dispatch({ type: "SET_MIN_HOUR", value: timeStringToHour(e.target.value) })}
              />
            </Flex>

            <Flex gap="2" align="center">
              <Text>until:</Text>
              <TextField.Root
                  type="time"
                  step={3600}
                  value={hourToTimeString(state.maxHour)}
                  onChange={e => dispatch({ type: "SET_MAX_HOUR", value: timeStringToHour(e.target.value) })}
              />
            </Flex>
          </Flex>

          <Flex gap="2" align="center" width={"200px"}>
            <Text size="2">Zoom:</Text>
            <Slider
                min={20}
                max={50}
                step={0.5}
                value={[state.timeSlotHeight]}
                onValueChange={val => dispatch({ type: "SET_TIME_SLOT_HEIGHT", value: val[0] })}
            />
          </Flex>
        </Flex>

        {hiddenEvents.length > 0 && (
            <Text color="red">
              {hiddenEvents.length} show{hiddenEvents.length > 1 ? "s" : ""} not visible due to time range
            </Text>
        )}

        <div className="w-full h-[600px]">
          <DnDCalendar
              localizer={localizer}
              events={events}
              defaultView="week"
              views={["week", "day"]}
              selectable
              resizable
              style={{ height: "100%" }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              min={new Date(1970, 1, 1, state.minHour, 0, 0)}
              max={new Date(1970, 1, 1, state.maxHour, 0, 0)}
          />
          {/* Extracted dialog */}
          <EntryDialog
              isOpen={state.isDialogOpen}
              mode={state.mode}
              shows={shows}
              scheduleStart={scheduleStart}
              scheduleEnd={scheduleEnd}
              initialValues={state.selectedEvent}
              onClose={() => dispatch({ type: "CLOSE_DIALOG" })}
              onSave={handleSave}
          />
        </div>
      </Flex>
  );
}