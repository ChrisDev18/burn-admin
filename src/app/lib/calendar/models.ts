// The base event type react-big-calendar wants
export type CalendarEvent = {
  title: string
  start: Date
  end: Date
  entryKey: number  // Link to data model
}