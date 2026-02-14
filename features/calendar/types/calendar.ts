export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  start: string;
  allDay: boolean;
}

export interface DayGroup {
  dateObj: Date;
  dateLabel: string;
  events: CalendarEvent[];
  isToday: boolean;
}