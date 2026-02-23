import {InitialScheduleEntry, ScheduleEntry} from "@/app/(frontend)/components/CalendarEditor/utils";

type CalendarMode = "create" | "edit"

interface CalendarState {
  isDialogOpen: boolean
  mode: CalendarMode
  selectedEvent: InitialScheduleEntry | null
  selectedRange: { start: Date; end: Date } | null
  timeSlotHeight: number
  minHour: number
  maxHour: number
}

type CalendarAction =
    | { type: "OPEN_EDIT"; event: ScheduleEntry }
    | { type: "OPEN_CREATE"; initialEvent: InitialScheduleEntry, range: { start: Date; end: Date } }
    | { type: "CLOSE_DIALOG" }
    | { type: "SET_TIME_SLOT_HEIGHT"; value: number }
    | { type: "SET_MIN_HOUR"; value: number }
    | { type: "SET_MAX_HOUR"; value: number }

export function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case "OPEN_EDIT":
      return { ...state, isDialogOpen: true, mode: "edit", selectedEvent: action.event, selectedRange: null }
    case "OPEN_CREATE":
      return { ...state, isDialogOpen: true, mode: "create", selectedEvent: action.initialEvent, selectedRange: action.range }
    case "CLOSE_DIALOG":
      return { ...state, isDialogOpen: false, selectedEvent: null, selectedRange: null }
    case "SET_TIME_SLOT_HEIGHT":
      return { ...state, timeSlotHeight: action.value }
    case "SET_MIN_HOUR":
      return { ...state, minHour: action.value }
    case "SET_MAX_HOUR":
      return { ...state, maxHour: action.value }
    default:
      return state
  }
}