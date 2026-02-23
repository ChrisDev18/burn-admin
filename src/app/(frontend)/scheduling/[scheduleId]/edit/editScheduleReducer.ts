import {Schedule, ScheduleWithEntries} from "@/modules/domain/model/Schedule";
import {ScheduleEntry} from "@/app/(frontend)/components/CalendarEditor/utils";

export interface EditScheduleState {
  loading: boolean;
  schedule: Schedule & {
    entries: ScheduleEntry[]
  };
  originalSchedule: Schedule & {
    entries: ScheduleEntry[]
  };
  error: { status: "SAVE_FAILURE", message: string } | null;
}

export type EditScheduleAction =
    | { type: "START_REQUEST" }
    | { type: "UPDATE_SUCCESS" }
    | { type: "UPDATE_FAILURE"; payload: string }
    | { type: "SET_NAME"; payload: string }
    | { type: "SET_START_DATE"; payload: Date }
    | { type: "SET_END_DATE"; payload: Date }
    | { type: "SET_ENTRIES"; payload: ScheduleEntry[] }
    | { type: "RESET_SCHEDULE" };

export function editScheduleReducer(state: EditScheduleState, action: EditScheduleAction): EditScheduleState {
  switch (action.type) {
    case "START_REQUEST":
      return {
        ...state,
        loading: true,
        error: null
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        originalSchedule: state.schedule
      };
    case "UPDATE_FAILURE":
      return {
        ...state,
        loading: false,
        error: { status: "SAVE_FAILURE", message: action.payload }
      };
    case "SET_NAME":
      return { ...state, schedule: { ...state.schedule, name: action.payload } };
    case "SET_START_DATE":
      return { ...state, schedule: { ...state.schedule, startDate: action.payload } };
    case "SET_END_DATE":
      return { ...state, schedule: { ...state.schedule, endDate: action.payload } };
    case "SET_ENTRIES":
      return { ...state, schedule: { ...state.schedule, entries: action.payload } };
    case "RESET_SCHEDULE":
      return { ...state, schedule: state.originalSchedule };
  }
}