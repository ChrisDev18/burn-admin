// The base event type react-big-calendar wants
export type CalendarEvent = {
  id: string // unique, could be "entry-12" or "exception-34"
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource?: CalendarResource
}

// Metadata we keep with each event to map back to your domain
export type CalendarResource =
    | { type: "entry"; entryId: number; scheduleId: number }
    | { type: "exception"; exceptionId: number; entryId?: number | null }